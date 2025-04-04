import json
from datetime import datetime
from decimal import Decimal
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

from database import (
    get_employees_by_expertise_list,
    update_employees_after_assignment,
    refresh_employee_statuses
)
from task_allocator import assign_tasks_with_constraints
from expertise_mapping import EXPERTISE_MAPPING

# Azure DeepSeek Configuration
use_deepseek = True
endpoint = "https://aitaskallocati6442223044.services.ai.azure.com/models"
model_name = "DeepSeek-R1"
api_key = "BmGzYShLgRJSPmNEkURPbcitlLzHqdFhPZl4iioIySQo7yB0ilMLJQQJ99BDACHYHv6XJ3w3AAAAACOGSctC"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectInput(BaseModel):
    project_name: str
    priority: str
    due_date: str  # YYYY-MM-DD
    description: str
    useAI: bool = True

def extract_json_array(text: str) -> str:
    start = text.find('[')
    if start == -1:
        return None
    stack = 0
    for i in range(start, len(text)):
        if text[i] == '[':
            stack += 1
        elif text[i] == ']':
            stack -= 1
            if stack == 0:
                return text[start:i+1]
    return None

def get_project_requirements_from_deepseek(prompt: str) -> list:
    client = ChatCompletionsClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(api_key)
    )
    system_msg = SystemMessage(content=(
        "You are a strict JSON extractor. Given a NEW and unique project problem statement, "
        "you must output a **new** valid JSON array every time. Each item should include "
        "'expertise' (string) and 'count' (integer). "
        "Only use expertise names from this list: " + ", ".join(sorted(set(EXPERTISE_MAPPING.values()))) + ". "
        "Do not reuse previous output. Do not explain. Return JSON only. If input is invalid, return []."
    ))
    response = client.complete(
        messages=[system_msg, UserMessage(content=prompt)],
        max_tokens=2000,
        model=model_name
    )
    client.close()

    full_response = response.choices[0].message.content.strip()

    if full_response.startswith('[') and full_response.endswith(']'):
        try:
            return json.loads(full_response)
        except json.JSONDecodeError:
            pass

    json_str = extract_json_array(full_response)
    if json_str:
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
    return []

def map_expertise(extracted_requirements: list) -> list:
    return [{
        "expertise": EXPERTISE_MAPPING.get(req.get("expertise", "").strip(), req.get("expertise", "").strip()),
        "count": req.get("count", 1)
    } for req in extracted_requirements]

@app.post("/api/assign-project")
def assign_project(project_input: ProjectInput):
    frontend_priority = project_input.priority
    frontend_due_date = project_input.due_date
    frontend_project_name = project_input.project_name
    frontend_project_description = project_input.description

    manager_manual_requirements = [
        {"expertise": "frontend_dev", "count": 2},
        {"expertise": "backend_dev", "count": 2},
        {"expertise": "database_admin", "count": 1},
        {"expertise": "design", "count": 1},
        {"expertise": "security", "count": 1},
        {"expertise": "project_management", "count": 1},
        {"expertise": "qa_testing", "count": 1},
        {"expertise": "cloud_infra", "count": 1},
        {"expertise": "data_viz", "count": 1}
    ]

    if use_deepseek and project_input.useAI:
        extracted_requirements = get_project_requirements_from_deepseek(frontend_project_description)
        if not extracted_requirements:
            extracted_requirements = manager_manual_requirements
    else:
        extracted_requirements = manager_manual_requirements

    mapped_requirements = map_expertise(extracted_requirements)

    project_data = {
        "project_name": frontend_project_name,
        "priority": frontend_priority,
        "due_date": datetime.strptime(frontend_due_date, "%Y-%m-%d"),
        "requirements": mapped_requirements
    }

    refresh_employee_statuses()

    required_expertise = [req["expertise"] for req in mapped_requirements]
    employee_dict = get_employees_by_expertise_list(required_expertise)
    employee_pool = [emp for sublist in employee_dict.values() for emp in sublist]

    assignment_df = assign_tasks_with_constraints(project_data, employee_pool)
    assignments = assignment_df.to_dict(orient="records")

    update_employees_after_assignment(assignments, project_data["due_date"].strftime("%Y-%m-%d"))

    return {
        "project_data": {
            "project_name": project_data["project_name"],
            "priority": project_data["priority"],
            "due_date": project_data["due_date"].strftime("%Y-%m-%d"),
            "requirements": mapped_requirements
        },
        "assignments": assignments
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5000, reload=True)
