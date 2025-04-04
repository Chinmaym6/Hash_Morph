document.addEventListener("DOMContentLoaded", function () {
    // Initializations
    initializeTaskCompletionChart();
    setupTabSwitching();
    setupFormSubmissions();
    setupAddRemoveButtons();
    updateTeamStatusCounters();
});

function initializeTaskCompletionChart() {
    const ctx = document.getElementById("taskCompletionChart");
    if (!ctx) return;

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completed', 'Pending', 'In Progress'],
            datasets: [{
                data: [60, 25, 15],
                backgroundColor: ['#39A0ED', '#ef2c2c', '#FFA62B'],
                borderWidth: 1
            }]
        },
        options: {
            cutout: '70%',
            plugins: {
                legend: { display: false }
            }
        }
    });
}

function setupTabSwitching() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            const activeTabContent = document.getElementById(tabId);

            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

            tab.classList.add('active');
            activeTabContent.classList.add('active');
        });
    });
}

function setupFormSubmissions() {
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', handleProjectSubmission);
    }

    const weightForm = document.getElementById('weight-form');
    if (weightForm) {
        weightForm.addEventListener('submit', updateScoreWeights);
    }
    
    // Setup direct submit button click as a fallback
    const submitBtn = document.getElementById("submit-btn");
    if (submitBtn && !projectForm) {
        submitBtn.addEventListener("click", function() {
            handleManualSubmission();
        });
    }
}

function handleProjectSubmission(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const projectData = {
        project_name: formData.get('project-name'),
        priority: formData.get('priority'),
        due_date: formData.get('due-date'),
        description: formData.get('project-description'),
        useAI: formData.get('use-ai') === 'on',
        mandatory_names: Array.from(document.querySelectorAll('#mandatory-list li')).map(li => li.textContent.trim())
    };

    submitProjectData(projectData);
}

function handleManualSubmission() {
    // Collect form data manually if the form isn't directly submitted
    const projectData = {
        project_name: document.querySelector('[name="project-name"]')?.value,
        priority: document.querySelector('[name="priority"]')?.value,
        due_date: document.querySelector('[name="due-date"]')?.value,
        description: document.querySelector('[name="project-description"]')?.value,
        useAI: document.querySelector('[name="use-ai"]')?.checked,
        mandatory_names: Array.from(document.querySelectorAll('#mandatory-list li')).map(li => li.textContent.trim())
    };

    submitProjectData(projectData);
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("submit-btn").addEventListener("click", submitProjectData);
});

function submitProjectData() {
    const projectData = {
        project_name: document.getElementById("project_name").value.trim(),
        description: document.getElementById("description").value.trim(),
        priority: document.getElementById("priority").value,
        due_date: document.getElementById("due_date").value,
        useAI: true
    };

    fetch('http://127.0.0.1:5000/api/assign-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
    })
    .then(res => res.json())
    .then(displayAssignmentResults)
    .catch(err => alert(`Error: ${err}`));
}

function displayAssignmentResults(data) {
    const assignedTab = document.getElementById('assigned');
    assignedTab.innerHTML = `<h3>${data.project_data.project_name}</h3>
        <p>Priority: ${data.project_data.priority}</p>
        <p>Due Date: ${data.project_data.due_date}</p>`;

    data.assignments.forEach(emp => {
        assignedTab.innerHTML += `<div>
            ${emp.employee_name} (${emp.expertise}) - Score: ${emp.score}, Available in: ${emp.days_to_available} days
        </div>`;
    });

    document.querySelector('.tab[data-tab="assigned"]').click();
}
