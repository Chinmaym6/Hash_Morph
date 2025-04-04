AI Task Allocation Agent
1. Solution Approach:
This AI Task Allocation Agent provides an intelligent solution to efficiently assign tasks to employees based on their expertise, availability, workload, and project priorities. The process involves:

Project Requirement Extraction:

Utilizes Azure DeepSeek Chatbot to analyze task descriptions, automatically identifying required skill sets and headcount.

Falls back to manual input if chatbot extraction is unsuccessful or incomplete.

Optimal Employee Matching:

Employs a score-based assignment algorithm considering multiple attributes:

Performance Rating

Years of Experience

Communication Skills

Task Completion Rate

Current Workload

Availability

Prioritizes task assignments based on project urgency (high, medium, low) and due date proximity.

Manager can manually specify mandatory employee names to include in task assignments (manual mode only).

Real-time Availability and Workload Management:

Daily automated refresh ensures real-time accuracy by adjusting employee availability based on ongoing project due dates and current workloads.

Automatically updates workload metrics after task assignments.

Comprehensive Expertise Mapping:

A detailed expertise-mapping file ensures accurate and consistent identification of skills across diverse domains like Web Development, DevOps, ML, UI/UX, Security, and more.

2. Implementation Details:
Programming Languages & Frameworks:

Python (main backend logic)

HTML/CSS/JavaScript (frontend interaction)

PostgreSQL (database for employee data management)

Cloud & AI Services:

Azure DeepSeek Chatbot API (for automated expertise extraction)

Azure AI Foundry (deployment and web service integration)

Libraries & Tools:

Pandas (data handling and analysis)

Psycopg2 (PostgreSQL interaction)

APScheduler (daily automated status updates)

VS Code (Integrated Development Environment)

Algorithm Details:

Weighted scoring system for employee ranking.

Hungarian algorithm-inspired optimal matching to minimize resource allocation inefficiency.

3. Execution Steps:
To run the AI Task Allocation Agent locally, follow these steps:

Step 1: Clone the repository from GitHub.

bash
Copy
Edit
git clone <repository-link>
cd AI_Task_Allocator_VS
Step 2: Set up Python environment.

bash
Copy
Edit
python -m venv venv
.\venv\Scripts\activate  # For Windows
source venv/bin/activate  # For Linux/macOS
Step 3: Install dependencies.

bash
Copy
Edit
pip install -r requirements.txt
Step 4: Configure your PostgreSQL database.

Create databases named Company_DB1 or as per configuration.

Import provided employee dataset (employees.sql).

Step 5: Configure Azure API keys and endpoints in main.py.

Step 6: Run the task allocation script.

bash
Copy
Edit
python main.py
Frontend: Open the frontend HTML file in your browser to interact with the backend.

4. Dependencies:
Python (3.9 or higher recommended)

Azure API subscription and valid API keys for DeepSeek model

PostgreSQL Database (version 12 or higher)

Python Packages:

psycopg2

pandas

APScheduler

azure-ai-inference

azure-core

Flask (optional if used as a web service)

5. Expected Output:
Running the AI Task Allocation Agent yields:

Backend Output:

Detailed JSON including project details, assigned employee names, expertise, scores, reasons for selection, availability, and workload information.

Example:

json
Copy
Edit
{
  "project_data": {
    "project_name": "Local Library Management System",
    "priority": "high",
    "due_date": "2025-04-15",
    "requirements": [
      {"expertise": "frontend_dev", "count": 2},
      {"expertise": "backend_dev", "count": 2}
    ]
  },
  "assignments": [
    {
      "employee_id": 101,
      "employee_name": "Alice Johnson",
      "expertise": "frontend_dev",
      "score": 132,
      "days_to_available": 0,
      "current_projects": 1,
      "priority": "high",
      "assigned_reason": "Selected based on high priority strategy",
      "project_name": "Local Library Management System"
    },
        {
      "employee_id": 101,
      "employee_name": "Alice Johnson",
      "expertise": "frontend_dev",
      "score": 132,
      "days_to_available": 0,
      "current_projects": 1,
      "priority": "high",
      "assigned_reason": "Selected based on high priority strategy",
      "project_name": "Local Library Management System"
    }
    {
      "employee_id": 142,
      "employee_name": "Bob Smith",
      "expertise": "backend_dev",
      "score": 124,
      "days_to_available": 2,
      "current_projects": 1,
      "priority": "high",
      "assigned_reason": "Selected based on high priority strategy",
      "project_name": "Local Library Management System"
    }

    {
      "employee_id": 142,
      "employee_name": "Bob Smith",
      "expertise": "backend_dev",
      "score": 124,
      "days_to_available": 2,
      "current_projects": 1,
      "priority": "high",
      "assigned_reason": "Selected based on high priority strategy",
      "project_name": "Local Library Management System"
    }
  ]
}
Frontend Output:

Visually displays assigned tasks, required expertise, and final employee assignments clearly and intuitively.

Allows manual override by managers through interactive forms.

Database Output:

Employee records updated in real-time to reflect new assignments, workload increments, and updated availability.

Note:- The backend and frontend integration is not yest done so please kindly try to run only the backend codes main.py,task_allocator.py,database.py,expertise_map
