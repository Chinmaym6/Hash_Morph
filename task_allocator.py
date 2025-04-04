from datetime import datetime
import pandas as pd

# Global weight matrix for scoring factors.
SCORE_WEIGHTS = {
    "performance_rating": 5,
    "years_experience": 2,
    "communication_rating": 3,
    "task_completion_rate": 4,
    "workload_metric": 2,
    "current_projects": 2,
    "days_to_available": 1
}

def update_score_weights(new_weights: dict):
    """
    Updates the global SCORE_WEIGHTS dictionary with new values.
    """
    global SCORE_WEIGHTS
    SCORE_WEIGHTS.update(new_weights)

MAX_PROJECTS_PER_EMPLOYEE = 3  # Maximum allowed projects per employee

def compute_employee_score(emp, due_date):
    # Convert next_available_date to a date object if needed.
    if isinstance(emp["next_available_date"], str):
        available_date = datetime.strptime(emp["next_available_date"], "%Y-%m-%d").date()
    else:
        available_date = emp["next_available_date"]
        if isinstance(available_date, datetime):
            available_date = available_date.date()
    today = datetime.now().date()
    days_to_available = (available_date - today).days
    days_to_available = max(days_to_available, 0)
    
    score = (
        SCORE_WEIGHTS["performance_rating"] * emp["performance_rating"] +
        SCORE_WEIGHTS["years_experience"] * emp["years_experience"] +
        SCORE_WEIGHTS["communication_rating"] * emp["communication_rating"] +
        SCORE_WEIGHTS["task_completion_rate"] * emp["task_completion_rate"] -
        SCORE_WEIGHTS["workload_metric"] * emp["workload_metric"] -
        SCORE_WEIGHTS["current_projects"] * emp.get("current_projects", 0) -
        SCORE_WEIGHTS["days_to_available"] * days_to_available
    )
    return score, days_to_available

def split_by_score_ranked(employees):
    sorted_emps = sorted(employees, key=lambda e: -e["score"])
    mid = len(sorted_emps) // 2
    return sorted_emps[:mid], sorted_emps[mid:]

def assign_tasks_with_constraints(project_data, employee_pool):
    """
    For each requirement, first include mandatory employees (if available) whose names are provided in project_data["mandatory_names"]
    (these names are not associated with a specific expertise from the manager's side, so they are taken as available for any requirement if their expertise matches),
    then fill in remaining slots based on computed scores.
    """
    assignments = []
    priority = project_data["priority"].lower()
    due_date = project_data["due_date"] if isinstance(project_data["due_date"], datetime) else datetime.strptime(project_data["due_date"], "%Y-%m-%d")
    global_mandatory_names = set(project_data.get("mandatory_names", []))
    
    for req in project_data["requirements"]:
        expertise = req["expertise"]
        total_count = req["count"]
        # Filter employees matching the required expertise.
        potential_emps = [emp for emp in employee_pool if emp["expertise"] == expertise]
        
        # Select mandatory employees for this requirement whose names are in the manager-provided mandatory list.
        mandatory_emps = [emp for emp in potential_emps if emp["name"] in global_mandatory_names]
        for emp in mandatory_emps:
            global_mandatory_names.discard(emp["name"])
        assigned_for_req = []
        for emp in mandatory_emps:
            score, days_to_available = compute_employee_score(emp, due_date)
            emp["score"] = score
            emp["days_to_available"] = days_to_available
            assigned_for_req.append(emp)
        
        remaining_count = max(total_count - len(assigned_for_req), 0)
        valid_emps = []
        for emp in potential_emps:
            if emp["name"] in [m["name"] for m in assigned_for_req]:
                continue
            score, days_to_available = compute_employee_score(emp, due_date)
            emp["score"] = score
            emp["days_to_available"] = days_to_available
            if not emp["availability_status"]:
                continue
            if emp.get("current_projects", 0) >= MAX_PROJECTS_PER_EMPLOYEE:
                continue
            valid_emps.append(emp)
        
        if not valid_emps and potential_emps:
            valid_emps = potential_emps
        
        if priority == "high":
            sorted_valid = sorted(valid_emps, key=lambda e: -e["score"])
        else:
            sorted_valid = sorted(valid_emps, key=lambda e: e["score"])
        
        additional_selected = sorted_valid[:remaining_count]
        assigned_for_req.extend(additional_selected)
        
        for emp in assigned_for_req:
            assignments.append({
                "employee_id": emp["employee_id"],
                "employee_name": emp["name"],
                "expertise": expertise,
                "score": round(emp["score"], 2),
                "days_to_available": emp["days_to_available"],
                "current_projects": emp.get("current_projects", 0),
                "priority": priority,
                "assigned_reason": f"Selected based on {priority} priority strategy (including mandatory selection if applicable)",
                "project_name": project_data["project_name"]
            })
    return pd.DataFrame(assignments)
