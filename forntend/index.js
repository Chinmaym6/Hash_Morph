// /**
//  * Employee Assignment System - AJAX Implementation
//  * This script handles the interaction with the Python backend for task assignment
//  */

// // Configuration
// const API_ENDPOINT = '/api';  // Change this to match your API endpoint

// // Initialize when DOM is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Attach event listeners to your existing HTML elements
//     const projectForm = document.getElementById('project-form');
//     if (projectForm) {
//         projectForm.addEventListener('submit', handleProjectSubmission);
//     }
    
//     const refreshBtn = document.getElementById('refresh-status-btn');
//     if (refreshBtn) {
//         refreshBtn.addEventListener('click', refreshEmployeeStatuses);
//     }
    
//     const weightForm = document.getElementById('weight-form');
//     if (weightForm) {
//         weightForm.addEventListener('submit', updateScoreWeights);
//     }
    
//     const mandatoryAddBtn = document.getElementById('add-mandatory-btn');
//     if (mandatoryAddBtn) {
//         mandatoryAddBtn.addEventListener('click', addMandatoryEmployee);
//     }
// });

// /**
//  * Handles project form submission
//  * @param {Event} event - The submit event
//  */
// function handleProjectSubmission(event) {
//     event.preventDefault();
    
//     // Get form data
//     const projectName = document.getElementById('project-name').value;
//     const priority = document.getElementById('priority').value;
//     const dueDate = document.getElementById('due-date').value;
//     const projectDesc = document.getElementById('project-description').value;
//     const useAI = document.getElementById('use-ai')?.checked || false;
    
//     // Get mandatory employees (assuming there's an element with ID 'mandatory-list')
//     const mandatoryNames = [];
//     const mandatoryItems = document.querySelectorAll('#mandatory-list li');
//     mandatoryItems.forEach(item => {
//         mandatoryNames.push(item.textContent.replace('×', '').trim());
//     });
    
//     // Validate inputs
//     if (!projectName || !dueDate) {
//         showError('Project name and due date are required');
//         return;
//     }
    
//     // Show loading state
//     showLoading(true);
    
//     // Prepare data for backend
//     const projectData = {
//         project_name: projectName,
//         priority: priority,
//         due_date: dueDate,
//         description: projectDesc,
//         useAI: useAI,
//         mandatory_names: mandatoryNames
//     };
    
//     // Call backend API
//     fetch(${API_ENDPOINT}/assign-project, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(projectData)
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(Server error: ${response.status});
//         }
//         return response.json();
//     })
//     .then(data => {
//         // Process successful response
//         displayAssignmentResults(data);
//         showLoading(false);
//     })
//     .catch(error => {
//         // Handle errors
//         showError(Failed to process assignment: ${error.message});
//         showLoading(false);
//         console.error('Assignment error:', error);
//     });
// }

// /**
//  * Refresh employee statuses in the database
//  */
// function refreshEmployeeStatuses() {
//     showLoading(true);
    
//     fetch(${API_ENDPOINT}/refresh-statuses, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(Server error: ${response.status});
//         }
//         return response.json();
//     })
//     .then(data => {
//         showNotification('Employee statuses refreshed successfully');
//         showLoading(false);
//     })
//     .catch(error => {
//         showError(Failed to refresh statuses: ${error.message});
//         showLoading(false);
//         console.error('Refresh error:', error);
//     });
// }

// /**
//  * Update employee score weights
//  * @param {Event} event - The submit event
//  */
// function updateScoreWeights(event) {
//     if (event) {
//         event.preventDefault();
//     }
    
//     // Get weight values from your form
//     const weightData = {
//         performance_rating: parseFloat(document.getElementById('weight-performance').value) || 5,
//         years_experience: parseFloat(document.getElementById('weight-experience').value) || 2,
//         communication_rating: parseFloat(document.getElementById('weight-communication').value) || 3,
//         task_completion_rate: parseFloat(document.getElementById('weight-completion').value) || 4,
//         workload_metric: parseFloat(document.getElementById('weight-workload').value) || 2,
//         current_projects: parseFloat(document.getElementById('weight-projects').value) || 2,
//         days_to_available: parseFloat(document.getElementById('weight-available').value) || 1
//     };
    
//     // Send weights to backend
//     fetch(${API_ENDPOINT}/update-weights, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ weights: weightData })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(Server error: ${response.status});
//         }
//         return response.json();
//     })
//     .then(data => {
//         showNotification('Score weights updated successfully');
//     })
//     .catch(error => {
//         showError(Failed to update weights: ${error.message});
//         console.error('Weight update error:', error);
//     });
// }

// /**
//  * Add a mandatory employee to the list
//  */
// function addMandatoryEmployee() {
//     const nameInput = document.getElementById('mandatory-name');
//     const name = nameInput.value.trim();
    
//     if (!name) {
//         return;
//     }
    
//     const mandatoryList = document.getElementById('mandatory-list');
    
//     // Create new list item
//     const listItem = document.createElement('li');
//     listItem.textContent = name;
    
//     // Add remove button
//     const removeBtn = document.createElement('span');
//     removeBtn.textContent = '×';
//     removeBtn.className = 'remove-btn';
//     removeBtn.addEventListener('click', function() {
//         mandatoryList.removeChild(listItem);
//     });
    
//     listItem.appendChild(removeBtn);
//     mandatoryList.appendChild(listItem);
    
//     // Clear input
//     nameInput.value = '';
// }

// /**
//  * Save final assignments to database
//  * @param {Array} assignments - The assignment data to save
//  */
// function saveAssignments(assignments) {
//     if (!confirm('Save these assignments to the database?')) {
//         return;
//     }
    
//     showLoading(true);
    
//     fetch(${API_ENDPOINT}/save-assignments, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ assignments: assignments })
//     })
//     .then(response => {
//         if (!response.ok) {
//             throw new Error(Server error: ${response.status});
//         }
//         return response.json();
//     })
//     .then(data => {
//         showNotification('Assignments saved successfully!');
//         showLoading(false);
//     })
//     .catch(error => {
//         showError(Failed to save assignments: ${error.message});
//         showLoading(false);
//         console.error('Save error:', error);
//     });
// }

// /**
//  * Display assignment results in your existing HTML container
//  * @param {Object} data - The results data from the backend
//  */
// function displayAssignmentResults(data) {
//     const resultsContainer = document.getElementById('results-container');
    
//     if (!resultsContainer) {
//         console.error('Results container not found');
//         return;
//     }
    
//     if (!data.assignments || data.assignments.length === 0) {
//         resultsContainer.innerHTML = '<div class="alert alert-warning">No assignments generated. Try adjusting your requirements.</div>';
//         return;
//     }
    
//     // Group assignments by expertise
//     const expertiseGroups = {};
//     data.assignments.forEach(assignment => {
//         if (!expertiseGroups[assignment.expertise]) {
//             expertiseGroups[assignment.expertise] = [];
//         }
//         expertiseGroups[assignment.expertise].push(assignment);
//     });
    
//     // Build HTML for results
//     let resultsHTML = `
//         <div class="project-summary">
//             <h3>Project: ${data.project_data.project_name}</h3>
//             <div class="project-info">
//                 <span>Priority: ${data.project_data.priority}</span>
//                 <span>Due Date: ${formatDate(data.project_data.due_date)}</span>
//             </div>
//         </div>
//     `;
    
//     // Add assignments by expertise
//     resultsHTML += '<div class="expertise-groups">';
    
//     for (const expertise in expertiseGroups) {
//         const employees = expertiseGroups[expertise];
        
//         resultsHTML += `
//             <div class="expertise-group">
//                 <h4>${formatExpertiseName(expertise)} (${employees.length})</h4>
//                 <table class="assignments-table">
//                     <thead>
//                         <tr>
//                             <th>Employee</th>
//                             <th>Score</th>
//                             <th>Current Projects</th>
//                             <th>Days to Available</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//         `;
        
//         employees.forEach(emp => {
//             resultsHTML += `
//                 <tr>
//                     <td>${emp.employee_name}</td>
//                     <td>${emp.score.toFixed(2)}</td>
//                     <td>${emp.current_projects}/3</td>
//                     <td>${emp.days_to_available}</td>
//                 </tr>
//             `;
//         });
        
//         resultsHTML += `
//                     </tbody>
//                 </table>
//             </div>
//         `;
//     }
    
//     resultsHTML += '</div>';
    
//     // Add save button
//     resultsHTML += `
//         <div class="actions-bar">
//             <button class="save-btn" onclick="saveAssignments(${JSON.stringify(data.assignments)})">
//                 Save Assignments to Database
//             </button>
//         </div>
//     `;
    
//     // Update the results container
//     resultsContainer.innerHTML = resultsHTML;
// }

// /**
//  * Show loading indicator
//  * @param {boolean} isLoading - Whether to show or hide loading
//  */
// function showLoading(isLoading) {
//     const loadingElement = document.getElementById('loading-indicator');
    
//     if (loadingElement) {
//         loadingElement.style.display = isLoading ? 'block' : 'none';
//     }
// }

// /**
//  * Show error message
//  * @param {string} message - The error message
//  */
// function showError(message) {
//     const errorContainer = document.getElementById('error-container');
    
//     if (errorContainer) {
//         errorContainer.innerHTML = <div class="alert alert-danger">${message}</div>;
//         errorContainer.style.display = 'block';
        
//         // Auto-hide after 5 seconds
//         setTimeout(() => {
//             errorContainer.style.display = 'none';
//         }, 5000);
//     } else {
//         // Fallback to alert if container not found
//         alert(Error: ${message});
//     }
// }

// /**
//  * Show notification message
//  * @param {string} message - The notification message
//  */
// function showNotification(message) {
//     // If you have a notification container, use it
//     const notifContainer = document.getElementById('notification-container');
    
//     if (notifContainer) {
//         notifContainer.innerHTML = <div class="alert alert-success">${message}</div>;
//         notifContainer.style.display = 'block';
        
//         // Auto-hide after 3 seconds
//         setTimeout(() => {
//             notifContainer.style.display = 'none';
//         }, 3000);
//     } else {
//         // Simple notification if container not found
//         const notification = document.createElement('div');
//         notification.className = 'floating-notification';
//         notification.innerHTML = message;
        
//         document.body.appendChild(notification);
        
//         setTimeout(() => {
//             document.body.removeChild(notification);
//         }, 3000);
//     }
// }

// /**
//  * Format expertise name for display
//  * @param {string} expertise - The raw expertise name
//  * @returns {string} - Formatted expertise name
//  */
// function formatExpertiseName(expertise) {
//     return expertise
//         .split('_')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
// }

// /**
//  * Format date for display
//  * @param {string} dateStr - ISO date string
//  * @returns {string} - Formatted date string
//  */
// function formatDate(dateStr) {
//     const date = new Date(dateStr);
//     const options = { year: 'numeric', month: 'short', day: 'numeric' };
//     return date.toLocaleDateString(undefined, options);
// }

document.addEventListener("DOMContentLoaded", function () {
    // Ensure the canvas exists before initializing the chart
    const ctx = document.getElementById("taskCompletionChart");

    if (ctx) {
        // Sample data (Adjust these values dynamically if needed)
        const data = {
            labels: ["Completed", "Pending", "In Progress"],
            datasets: [{
                data: [60, 25, 15], // Adjust these numbers based on actual data
                backgroundColor: ["#39A0ED", "#ef2c2c", "#FFA62B"],
                borderWidth: 1
            }]
        };

        // Chart options
        const options = {
            cutout: '70%', // Makes it a donut instead of a pie
            plugins: {
                legend: { display: false } // Hide legend for a cleaner look
            }
        };

        // Create the chart
        new Chart(ctx, {
            type: "doughnut",
            data: data,
            options: options
        });
    }
});


//task matching tab switching

document.addEventListener("DOMContentLoaded", function() {
    // Get all tab buttons
    const tabs = document.querySelectorAll('.tab');
    
    // Add click event listener to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Get the tab id from data-tab attribute
            const tabId = tab.getAttribute('data-tab');
            
            // Remove active class from all tabs and tab contents
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            // Add active class to the clicked tab and corresponding content
            tab.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Ensure only the active tab is shown on page load
    const activeTabId = document.querySelector('.tab.active').getAttribute('data-tab');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(activeTabId).classList.add('active');
});

function updateTaskOutput(text) {
    document.getElementById("task-output").textContent = text;
}


//add expertise
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the "Add More" button
    document.getElementById("add-expertise").addEventListener("click", addRow);
    
    // Add event listeners to all initial remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            removeRow(this);
        });
    });
});

function addRow() {
    let container = document.getElementById("expertise-container");
    let rows = document.querySelectorAll(".expertise-row");
    
    // Only add a new row if there's at least one row
    if (rows.length > 0) {
        // Clone the first expertise row
        let expertiseRow = rows[0].cloneNode(true);
        
        // Clear input values in the cloned row
        expertiseRow.querySelector("select").value = "AI/Machine Learning";
        expertiseRow.querySelector("input").value = "";
        
        // Add event listener to the new remove button
        expertiseRow.querySelector(".remove-btn").addEventListener("click", function() {
            removeRow(this);
        });
        
        container.appendChild(expertiseRow);
    }
}

function removeRow(button) {
    // Only remove if there's more than one row to prevent removing all rows
    let rows = document.querySelectorAll(".expertise-row");
    if (rows.length > 1) {
        button.closest(".expertise-row").remove();
    }
}
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the "Add More" button
    document.getElementById("add-mandatory").addEventListener("click", addMandatoryRow);
    
    // Add event listeners to all initial remove buttons
    document.querySelectorAll('#mandatory-container .remove-btn').forEach(button => {
        button.addEventListener('click', function() {
            removeMandatoryRow(this);
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to the "Add More" button
    document.getElementById("add-mandatory").addEventListener("click", addMandatoryRow);
    
    // Add event listeners to all initial remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', function() {
        removeField(this);
      });
    });
  });
  
  function addMandatoryRow() {
    let container = document.querySelector(".mandatory-members-rows");
    let rows = document.querySelectorAll(".mandatory-row");
    
    if (rows.length > 0) {
      // Clone the first row
      let newRow = rows[0].cloneNode(true);
      
      // Clear input values
      newRow.querySelectorAll("input").forEach(input => {
        input.value = "";
      });
      
      // Add event listeners to remove buttons
      newRow.querySelectorAll(".remove-btn").forEach(button => {
        button.addEventListener('click', function() {
          removeField(this);
        });
      });
      
      container.appendChild(newRow);
      
      // Scroll to the bottom to show the new row
      container.scrollTop = container.scrollHeight;
    }
  }
  
  function removeField(button) {
    // Get the parent field container
    const fieldContainer = button.closest('.input-field-container');
    
    // Get the parent row
    const parentRow = button.closest('.mandatory-row');
    
    // If this is the only remaining field in the row and there's more than one row
    const remainingFieldsInRow = parentRow.querySelectorAll('.input-field-container').length;
    const totalRows = document.querySelectorAll('.mandatory-row').length;
    
    if (remainingFieldsInRow <= 1 && totalRows > 1) {
      // Remove the entire row
      parentRow.remove();
    } else if (remainingFieldsInRow > 1) {
      // Just remove this field
      fieldContainer.remove();
    } else {
      // This is the last field in the last row, just clear it
      fieldContainer.querySelector('input').value = '';
    }
  }


  // Keep all existing code

// Team Status Counter Update
function updateTeamStatusCounters() {
  // Sample data - in production, this would come from your database
  const teamCounts = {
      available: 5,
      assigned: 8,
      leave: 2,
      remote: 3
  };
  
  // Update the counters in the UI
  document.getElementById('available').textContent = teamCounts.available;
  document.getElementById('assigned').textContent = teamCounts.assigned;
  document.getElementById('leave').textContent = teamCounts.leave;
  document.getElementById('remote').textContent = teamCounts.remote;
}

// AI Task Analysis Simulation
function simulateTaskAnalysis() {
  const taskNameInput = document.querySelector('#matching .input-group:first-of-type input');
  const taskDetailsInput = document.querySelector('#matching .input-group:nth-of-type(2) input');
  const smallSubmitBtn = document.querySelector('.small-submit-btn');
  
  if (taskNameInput && taskDetailsInput && smallSubmitBtn) {
      smallSubmitBtn.addEventListener('click', function() {
          const taskName = taskNameInput.value.trim();
          const taskDetails = taskDetailsInput.value.trim();
          
          if (taskName === '' || taskDetails === '') {
              updateTaskOutput("Please provide both task name and details for analysis.");
              return;
          }
          
          // Show loading state
          updateTaskOutput("Analyzing task requirements...");
          
          // Simulate AI processing delay
          setTimeout(() => {
              // Generate AI analysis based on input
              const analysis = generateAIAnalysis(taskName, taskDetails);
              updateTaskOutput(analysis);
          }, 1200);
      });
  }
}

function generateAIAnalysis(taskName, taskDetails) {
  // This simulates an AI analysis of the task
  const skills = ["Database Design", "AI/Machine Learning", "Web Development", "Cloud Infrastructure", "UI/UX Design"];
  const selectedSkills = [];
  
  // Simple keyword matching to suggest skills
  if (taskDetails.toLowerCase().includes("database") || taskDetails.toLowerCase().includes("sql")) {
      selectedSkills.push("Database Design");
  }
  if (taskDetails.toLowerCase().includes("ai") || taskDetails.toLowerCase().includes("machine learning") || taskDetails.toLowerCase().includes("ml")) {
      selectedSkills.push("AI/Machine Learning");
  }
  if (taskDetails.toLowerCase().includes("web") || taskDetails.toLowerCase().includes("frontend") || taskDetails.toLowerCase().includes("backend")) {
      selectedSkills.push("Web Development");
  }
  if (taskDetails.toLowerCase().includes("cloud") || taskDetails.toLowerCase().includes("aws") || taskDetails.toLowerCase().includes("azure")) {
      selectedSkills.push("Cloud Infrastructure");
  }
  if (taskDetails.toLowerCase().includes("design") || taskDetails.toLowerCase().includes("ui") || taskDetails.toLowerCase().includes("ux")) {
      selectedSkills.push("UI/UX Design");
  }
  
  // If no skills matched, select random ones
  if (selectedSkills.length === 0) {
      const randomSkill1 = skills[Math.floor(Math.random() * skills.length)];
      let randomSkill2;
      do {
          randomSkill2 = skills[Math.floor(Math.random() * skills.length)];
      } while (randomSkill2 === randomSkill1);
      
      selectedSkills.push(randomSkill1, randomSkill2);
  }
  
  // Calculate estimated time
  const complexity = Math.floor(Math.random() * 3) + 1; // 1-3
  const estimatedDays = complexity * (Math.floor(Math.random() * 5) + 3); // 3-15 days
  
  return `Based on analysis of "${taskName}":
• Required expertise: ${selectedSkills.join(", ")}
• Estimated team size: ${selectedSkills.length}
• Complexity level: ${complexity === 1 ? "Low" : complexity === 2 ? "Medium" : "High"}
• Estimated completion time: ${estimatedDays} days`;
}

// Team Member Filtering
function setupTeamMemberFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const teamMembers = document.querySelectorAll('.team-member');
  const searchInput = document.querySelector('.search-input');
  
  // Filter by status (Available, Busy, On Leave)
  filterButtons.forEach(button => {
      button.addEventListener('click', function() {
          // Remove active class from all buttons
          filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          const filterValue = this.textContent.trim();
          
          teamMembers.forEach(member => {
              const statusBadge = member.querySelector('.badge').textContent.trim();
              
              if (filterValue === 'All' || statusBadge === filterValue) {
                  member.style.display = 'block';
              } else {
                  member.style.display = 'none';
              }
          });
      });
  });
  
  // Search functionality
  if (searchInput) {
      searchInput.addEventListener('input', function() {
          const searchTerm = this.value.toLowerCase();
          
          teamMembers.forEach(member => {
              const name = member.querySelector('.member-name').textContent.toLowerCase();
              const role = member.querySelector('.member-role').textContent.toLowerCase();
              
              if (name.includes(searchTerm) || role.includes(searchTerm)) {
                  member.style.display = 'block';
              } else {
                  member.style.display = 'none';
              }
          });
      });
  }
}

// Task Matching Optimization
function setupTaskMatchingOptimization() {
  const optimizeButton = document.getElementById('submit-btn');
  
  if (optimizeButton) {
      optimizeButton.addEventListener('click', function() {
          // Get all input values
          const taskName = document.querySelector('#matching .input-group:first-of-type input')?.value;
          const taskAnalysis = document.getElementById('task-output')?.textContent;
          const priorityLevel = document.querySelector('#matching select')?.value;
          const dueDate = document.getElementById('due-date')?.value;
          
          if (!taskName || !taskAnalysis) {
              alert("Please provide task details and generate an analysis first.");
              return;
          }
          
          // Show processing state
          this.textContent = "Optimizing...";
          this.disabled = true;
          
          // Simulate processing
          setTimeout(() => {
              // Simulate successful matching
              alert(Task "${taskName}" has been successfully matched with optimal team members based on AI analysis.);
              
              // Go to the Assigned tab to show the results
              const assignedTab = document.querySelector('.tab[data-tab="assigned"]');
              if (assignedTab) {
                  assignedTab.click();
                  populateAssignedTasksTab(taskName, taskAnalysis, priorityLevel, dueDate);
              }
              
              // Reset button
              this.textContent = "Optimize Matches";
              this.disabled = false;
          }, 2000);
      });
  }
}

// Populate Assigned Tasks Tab
function populateAssignedTasksTab(taskName, analysis, priority, dueDate) {
  const assignedTab = document.getElementById('assigned');
  
  if (assignedTab) {
      // Extract expertise from analysis
      const expertiseMatch = analysis.match(/Required expertise: ([^•]+)/);
      const expertise = expertiseMatch ? expertiseMatch[1].trim() : "Various skills";
      
      // Create a new assigned task card
      const taskCard = document.createElement('div');
      taskCard.className = 'assigned-task-card';
      
      // Add to the assigned tab
      assignedTab.appendChild(taskCard);
  }
}

// Dynamic Statistics for Completed Tasks
function setupCompletedTasksStatistics() {
  // Completed tasks data - this would come from your database in a real application
  const completedTasksData = [
      { name: "Database Migration", team: ["Anna", "David"], completionTime: 5, expectedTime: 7 },
      { name: "API Integration", team: ["Mark", "Susan"], completionTime: 8, expectedTime: 6 },
      { name: "UI Redesign", team: ["David"], completionTime: 3, expectedTime: 4 }
  ];
  
  // Add completed tasks to the completed tab when it's clicked
  const completedTab = document.querySelector('.tab[data-tab="completed"]');
  if (completedTab) {
      completedTab.addEventListener('click', function() {
          const completedTabContent = document.getElementById('completed');
          
          // Check if we've already added the stats (avoid duplicate content)
          if (!document.getElementById('completed-tasks-stats')) {
              // Create stats container
              const statsContainer = document.createElement('div');
              statsContainer.id = 'completed-tasks-stats';
              statsContainer.style.padding = '20px';
              statsContainer.style.marginTop = '20px';
              
              // Add stats content
              let statsHTML = `
                  <h3 style="margin-bottom: 16px;">Completed Tasks Statistics</h3>
                  <div style="background-color: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
                          <div>
                              <div style="font-size: 28px; font-weight: bold; color: #3b82f6;">${completedTasksData.length}</div>
                              <div style="font-size: 14px; color: #94a3b8;">Tasks Completed</div>
                          </div>
                          <div>
                              <div style="font-size: 28px; font-weight: bold; color: #10b981;">83%</div>
                              <div style="font-size: 14px; color: #94a3b8;">On Schedule</div>
                          </div>
                          <div>
                              <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">92%</div>
                              <div style="font-size: 14px; color: #94a3b8;">Team Efficiency</div>
                          </div>
                      </div>
                  </div>
                  
                  <h3 style="margin-bottom: 16px;">Recently Completed</h3>
              `;
              
              // Add individual completed task cards
              completedTasksData.forEach(task => {
                  const efficiencyColor = task.completionTime <= task.expectedTime ? '#10b981' : '#f59e0b';
                  
                  statsHTML += `
                      <div style="background-color: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                              <h3 style="margin: 0; font-size: 18px;">${task.name}</h3>
                              <span style="color: ${efficiencyColor}; font-weight: bold;">
                                  ${task.completionTime} / ${task.expectedTime} days
                              </span>
                          </div>
                          <div style="font-size: 14px; color: #94a3b8; margin-bottom: 8px;">Team: ${task.team.join(", ")}</div>
                      </div>
                  `;
              });
              
              statsContainer.innerHTML = statsHTML;
              completedTabContent.appendChild(statsContainer);
          }
      });
  }
}

// Initialize all added functionality
document.addEventListener("DOMContentLoaded", function() {
  // Run existing initialization code first
  
  // Then initialize our new functionality
  updateTeamStatusCounters();
  simulateTaskAnalysis();
  setupTeamMemberFiltering();
  setupTaskMatchingOptimization();
  setupCompletedTasksStatistics();
});