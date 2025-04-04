import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
import json

def get_employees_by_expertise_list(expertise_list):
    """
    Retrieves employee data from PostgreSQL by expertise list.
    Returns a dictionary mapping each expertise to a list of matching employee records.
    """
    connection = None
    result = {}
    try:
        connection = psycopg2.connect(
            host="localhost",
            database="Company_DB2",
            user="postgres",
            password="935391"
        )
        cursor = connection.cursor(cursor_factory=RealDictCursor)
        query = """
            SELECT employee_id, name, expertise, assigned_projects, next_available_date,
                   workload_metric, current_projects, performance_rating, years_experience,
                   communication_rating, task_completion_rate, preferred_task_type,
                   availability_status, last_updated
            FROM employees
            WHERE expertise IN %s
        """
        cursor.execute(query, (tuple(expertise_list),))
        rows = cursor.fetchall()
        for row in rows:
            exp = row["expertise"]
            if exp not in result:
                result[exp] = []
            result[exp].append(row)
    except Exception as e:
        print("❌ Error retrieving data from database:", e)
    finally:
        if connection:
            connection.close()
    return result

def update_employees_after_assignment(assignments, project_due_date_str):
    """
    Updates the employee records after assignments:
    - Increments workload_metric and current_projects.
    - Appends the project name to assigned_projects.
    - Sets next_available_date to the project due date.
    - Updates last_updated to now.
    - Sets availability_status to false if current_projects reach 3.
    """
    connection = None
    try:
        project_due_date = datetime.strptime(project_due_date_str, "%Y-%m-%d")
        connection = psycopg2.connect(
            host="localhost",
            database="Company_DB2",
            user="postgres",
            password="935391"
        )
        cursor = connection.cursor()
        for emp in assignments:
            emp_id = emp["employee_id"]
            project_name = emp.get("project_name", "Unnamed Project")
            updated_time = datetime.now()

            cursor.execute(
                "SELECT assigned_projects, workload_metric, current_projects FROM employees WHERE employee_id = %s",
                (emp_id,)
            )
            row = cursor.fetchone()
            if row is None:
                print(f"Warning: No record found for employee_id {emp_id}. Skipping update.")
                continue
            assigned_projects = row[0] or []
            if isinstance(assigned_projects, str):
                try:
                    assigned_projects = json.loads(assigned_projects)
                except Exception as e:
                    print(f"Error decoding assigned_projects for employee {emp_id}: {e}")
                    assigned_projects = []
            assigned_projects.append(project_name)
            workload = row[1] or 0
            current_projects = row[2] or 0
            new_workload = workload + 1
            new_current = current_projects + 1
            new_availability = True if new_current < 3 else False

            update_query = """
                UPDATE employees
                SET assigned_projects = %s,
                    workload_metric = %s,
                    current_projects = %s,
                    next_available_date = %s,
                    last_updated = %s,
                    availability_status = %s
                WHERE employee_id = %s
            """
            cursor.execute(update_query, (
                json.dumps(assigned_projects),
                new_workload,
                new_current,
                project_due_date,
                updated_time,
                new_availability,
                emp_id
            ))
        connection.commit()
        print(f"✅ Database updated for {len(assignments)} employee(s).")
    except Exception as e:
        print("❌ Error updating employee assignments:", e)
    finally:
        if connection:
            connection.close()

def refresh_employee_statuses():
    """
    Checks each employee's next_available_date against today.
    If the due date has passed, decreases current_projects (minimum 0)
    and sets availability_status to True if current_projects is less than 3.
    """
    conn = None
    try:
        conn = psycopg2.connect(
            host="localhost",
            database="Company_DB2",
            user="postgres",
            password="935391"
        )
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        today = datetime.now().date()
        query = "SELECT employee_id, next_available_date, current_projects, availability_status, assigned_projects FROM employees"
        cursor.execute(query)
        rows = cursor.fetchall()

        for emp in rows:
            eid = emp['employee_id']
            next_available = emp['next_available_date']
            current_proj = emp.get('current_projects', 0)

            if next_available and isinstance(next_available, datetime):
                next_available = next_available.date()

            if current_proj > 0 and next_available and next_available <= today:
                new_current = max(current_proj - 1, 0)
                new_availability = True if new_current < 3 else False
                update_q = """
                    UPDATE employees
                    SET current_projects = %s,
                        availability_status = %s,
                        last_updated = %s
                    WHERE employee_id = %s
                """
                cursor.execute(update_q, (new_current, new_availability, datetime.now(), eid))
        conn.commit()
        print("🔁 Employee statuses refreshed based on due dates.")
    except Exception as e:
        print("❌ Error refreshing statuses:", e)
    finally:
        if conn:
            conn.close()
