/* =========================================================
   INTERNHUB
   DASHBOARD
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    if (!document.querySelector(".dashboard-main")) {
        return;
    }

    renderDashboard();
});


function renderDashboard() {

    const tasks =
        Storage.get(STORAGE_KEYS.TASKS, []);

    const submissions =
        Storage.get(STORAGE_KEYS.SUBMISSIONS, []);

    const projects =
        Storage.get(STORAGE_KEYS.PROJECTS, []);


    const totalTasks =
        tasks.length;

    const completedTasks =
        tasks.filter(
            task => task.status === "Completed"
        ).length;

    const pendingTasks =
        tasks.filter(
            task => task.status === "Pending"
        ).length;

    const progressTasks =
        tasks.filter(
            task => task.status === "In Progress"
        ).length;


    updateValue(
        [
            "#totalTasks",
            "[data-stat='total-tasks']"
        ],
        totalTasks
    );

    updateValue(
        [
            "#completedTasks",
            "[data-stat='completed-tasks']"
        ],
        completedTasks
    );

    updateValue(
        [
            "#pendingTasks",
            "[data-stat='pending-tasks']"
        ],
        pendingTasks
    );

    updateValue(
        [
            "#totalSubmissions",
            "[data-stat='submissions']"
        ],
        submissions.length
    );


    renderTaskPreview(tasks);

    renderProjectProgress(projects);

    updateProgressCircle(
        completedTasks,
        totalTasks
    );
}


/* =========================================================
   VALUE HELPER
   ========================================================= */

function updateValue(selectors, value) {

    selectors.forEach(selector => {

        const element =
            document.querySelector(selector);

        if (element) {
            element.textContent = value;
        }

    });
}


/* =========================================================
   TASK PREVIEW
   ========================================================= */

function renderTaskPreview(tasks) {

    const container =
        document.querySelector(
            "#dashboardTaskList, .task-list"
        );

    if (!container || !tasks.length) {
        return;
    }


    container.innerHTML =
        tasks.slice(0, 5).map(task => {

            const statusClass =
                task.status === "Completed"
                    ? "status-completed"
                    : task.status === "In Progress"
                        ? "status-progress"
                        : "status-pending";


            return `
                <div class="task-row">

                    <span class="task-status ${statusClass}"></span>

                    <div class="task-info">
                        <h4>
                            ${Utils.escapeHTML(task.title)}
                        </h4>

                        <span>
                            ${Utils.escapeHTML(task.category)}
                        </span>
                    </div>

                    <span class="badge ${
                        task.status === "Completed"
                            ? "badge-success"
                            : task.status === "In Progress"
                                ? "badge-warning"
                                : "badge-neutral"
                    }">
                        ${Utils.escapeHTML(task.status)}
                    </span>

                    <span class="task-date">
                        ${Utils.formatDate(task.dueDate)}
                    </span>

                </div>
            `;

        }).join("");
}


/* =========================================================
   PROJECT PROGRESS
   ========================================================= */

function renderProjectProgress(projects) {

    const container =
        document.querySelector(
            "#projectProgress, .progress-projects"
        );

    if (!container || !projects.length) {
        return;
    }


    const total =
        projects.reduce(
            (sum, project) =>
                sum + Number(project.progress || 0),
            0
        );


    const average =
        Math.round(total / projects.length);


    container.innerHTML = `
        <div class="progress-circle">
            ${average}%
        </div>

        <h4>Overall Project Progress</h4>

        <p>
            Your current progress across active internship projects.
        </p>
    `;
}


/* =========================================================
   PROGRESS CIRCLE
   ========================================================= */

function updateProgressCircle(completed, total) {

    const circle =
        document.querySelector(
            ".progress-circle"
        );

    if (!circle || total === 0) {
        return;
    }


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    circle.textContent =
        `${percentage}%`;
}