import json
import re
from datetime import datetime
from decimal import Decimal
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential

from database import get_employees_by_expertise_list, update_employees_after_assignment, refresh_employee_statuses
from task_allocator import assign_tasks_with_constraints, update_score_weights
from expertise_mapping import EXPERTISE_MAPPING  # Import external mapping

# Set use_deepseek to True to use the AI chatbot extraction.
use_deepseek = True

# Azure DeepSeek R1 settings (only used in chatbot mode)
endpoint = "https://aitaskallocati6442223044.services.ai.azure.com/models"
model_name = "DeepSeek-R1"
api_key = "BmGzYShLgRJSPmNEkURPbcitlLzHqdFhPZl4iioIySQo7yB0ilMLJQQJ99BDACHYHv6XJ3w3AAAAACOGSctC"

def extract_json_array(text: str) -> str:
    """
    Extracts the first complete JSON array from the input text using a simple stack-based approach.
    """
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
        "'expertise' (string), 'count' (integer) and optionally 'mandatory' (list of employee names). "
        "Only use expertise names from this list: " + ", ".join(sorted(set(EXPERTISE_MAPPING.values()))) + ". "
        "Do not reuse previous output. Do not explain. Return JSON only. If input is invalid, return []."
    ))
    response = client.complete(
        messages=[
            system_msg,
            UserMessage(content=prompt)
        ],
        max_tokens=2000,
        model=model_name
    )
    client.close()
    
    full_response = response.choices[0].message.content.strip()
    print("📝 Prompt sent to model:", prompt)
    print("📩 Full model response:\n", full_response)

    if full_response.startswith('[') and full_response.endswith(']'):
        try:
            return json.loads(full_response)
        except json.JSONDecodeError as e:
            print("Error decoding JSON:", e)
    
    json_str = extract_json_array(full_response)
    if json_str:
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            print("Error decoding JSON with extract_json_array:", e)
    return []

def map_expertise(extracted_requirements: list) -> list:
    mapped_requirements = []
    for req in extracted_requirements:
        exp = req.get("expertise", "").strip()
        count = req.get("count", 1)
        mandatory = req.get("mandatory", [])
        mapped_requirements.append({
            "expertise": EXPERTISE_MAPPING.get(exp, exp),
            "count": count,
            "mandatory": mandatory
        })
    return mapped_requirements

def main():
    frontend_priority = "high"
    frontend_due_date = "2025-04-15"
    frontend_project_name = "Automate Task Scheduling in Python"
    frontend_project_description = (
      "Manually managing repetitive tasks can be inefficient."
      "This project aims to use APScheduler to schedule and automate tasks such as sending notifications, running scripts, or updating databases at predefined intervals."
    )
    # Manager may optionally provide mandatory employee names (which will be applied to any requirement if matching DB data)
    manager_mandatory_names = ["Employee29", "Employee60"]  # Example names

    # Manager-provided manual requirements fallback (if DeepSeek output is not acceptable)
    manager_manual_requirements = [
        {"expertise": "frontend_dev", "count": 2, "mandatory": []},
        {"expertise": "backend_dev", "count": 2, "mandatory": []},
        {"expertise": "database_admin", "count": 1, "mandatory": []},
        {"expertise": "design", "count": 1, "mandatory": []},
        {"expertise": "security", "count": 1, "mandatory": []},
        {"expertise": "project_management", "count": 1, "mandatory": []},
        {"expertise": "qa_testing", "count": 1, "mandatory": []},
        {"expertise": "cloud_infra", "count": 1, "mandatory": []},
        {"expertise": "data_viz", "count": 1, "mandatory": []}
    ]

    if use_deepseek:
        extracted_requirements = get_project_requirements_from_deepseek(frontend_project_description)
        # For a library management system, we expect expertise such as frontend_dev, backend_dev, design, etc.
        desired_expertise = {"frontend_dev", "backend_dev", "database_admin", "design", "security", 
                             "project_management", "qa_testing", "cloud_infra", "data_viz"}
        # Check if at least one of the extracted expertise (after mapping) is among the desired ones.
        if not any(EXPERTISE_MAPPING.get(req.get("expertise", "").strip(), req.get("expertise", "").strip()) in desired_expertise 
                   for req in extracted_requirements):
            print("⚠️ DeepSeek output does not match expected library-related expertise. Using manual fallback requirements.")
            extracted_requirements = manager_manual_requirements
    else:
        extracted_requirements = manager_manual_requirements

    mapped_requirements = map_expertise(extracted_requirements)

    project_data = {
        "project_name": frontend_project_name,
        "priority": frontend_priority,
        "due_date": frontend_due_date,
        "requirements": mapped_requirements,
        "mandatory_names": manager_mandatory_names
    }
    project_data["due_date"] = datetime.strptime(project_data["due_date"], "%Y-%m-%d")

    refresh_employee_statuses()

    required_expertise = [req["expertise"] for req in mapped_requirements]
    employee_dict = get_employees_by_expertise_list(required_expertise)
    employee_pool = [emp for sublist in employee_dict.values() for emp in sublist]

    assignment_df = assign_tasks_with_constraints(project_data, employee_pool)
    assignments = assignment_df.to_dict(orient="records")

    update_employees_after_assignment(assignments, project_data["due_date"].strftime("%Y-%m-%d"))

    output = {
        "project_data": {
            "project_name": project_data["project_name"],
            "priority": project_data["priority"],
            "due_date": project_data["due_date"].strftime("%Y-%m-%d"),
            "requirements": mapped_requirements,
            "mandatory_names": manager_mandatory_names
        },
        "assignments": assignments
    }
    print(json.dumps(output, indent=2, default=lambda o: float(o) if isinstance(o, Decimal) else str(o)))

if __name__ == "__main__":
    main()
