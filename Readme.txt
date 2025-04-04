AI Task Allocation Agent
1. Solution Approach:
This AI Task Allocation Agent optimizes the assignment of tasks to employees by leveraging their expertise, availability, workload, and project priorities. Here’s an overview of the process:

Project Requirement Extraction:
Automated Expertise Identification: Utilizes Azure DeepSeek to analyze task descriptions, extracting required skill sets and necessary headcount automatically. This ML-driven approach ensures precision in matching project needs with the right expertise.

Fallback Mechanism: In cases where Azure DeepSeek does not provide complete or successful results, manual input is available to ensure no task goes unattended.

Optimal Employee Matching:
Scoring System: Employees are scored based on various attributes including:
Performance Rating

Years of Experience

Communication Skills

Task Completion Rate

Current Workload

Availability

Priority and Urgency Consideration: Tasks are assigned with consideration to the urgency (high, medium, low) and proximity of due dates, ensuring critical projects are prioritized.

Manual Overrides: Managers can specify certain employees to be included in specific tasks, providing flexibility and control over the allocation process.
A detailed expertise-mapping file ensures accurate and consistent identification of skills across diverse domains like Web Development, DevOps, ML, UI/UX, Security, and more.

Real-time Availability and Workload Management:
Daily Refresh: An automated daily refresh adjusts employee availability and workload in real-time based on ongoing project due dates and existing workloads, utilizing APScheduler for these updates.

Workload Adjustments: After task assignments, the system automatically updates the workload metrics to reflect the new status, ensuring data accuracy.

Comprehensive Expertise Mapping:
Extensive Domain Coverage: An expertise mapping file covers a wide range of skills from Web Development to Security, ensuring accurate alignment of tasks to employee skills.

2. Implementation Details:
Languages & Frameworks: Python for backend logic, HTML/CSS/JavaScript for frontend interaction, and PostgreSQL for database management.

Cloud & AI Services: Azure DeepSeek for real-time expertise extraction and Azure AI Foundry for deploying the system as a web service.

Tools: Utilizes Pandas for data handling, Psycopg2 for database interaction, and APScheduler for scheduling tasks.

3. Algorithm Details:
Employee Ranking and Matching: A weighted scoring system ranks employees, and a Hungarian algorithm-inspired approach ensures optimal matching by minimizing allocation inefficiency.

Dynamic Allocation Based on Project Priority:

High Priority: Immediate assignment of tasks, prioritizing employees with the highest scores and nearest availability.

Medium Priority: Balances between optimal matching and due date proximity, ensuring efficient use of resources without compromising project timelines.

Low Priority: More flexible in assignment timings, allowing for optimization of workload distribution across available employees.

4. Execution Steps:
Detailed steps for setting up the environment, cloning the repository, installing dependencies, configuring the database, and running the system are provided, ensuring that the user can easily replicate and deploy the system locally.

5. Expected Output:
Backend Output: Generates a detailed JSON output including project details, assigned employees, their scores, reasons for selection, and their current workload and availability status.

Frontend Output: Displays assignments and required expertise intuitively, with capabilities for manual override by managers.

Database Output: Updates employee records in real-time to reflect new assignments and adjusted availability.

6. Key Considerations:
Integration Challenges: The current implementation focuses primarily on backend logic; frontend and backend integration will need to be completed for full system functionality.

Flexibility and Adaptability: The system is designed to be adaptable to various business environments and can be customized to meet specific organizational needs.






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
