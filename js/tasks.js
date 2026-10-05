/* =========================================================
   INTERNHUB
   TASK MANAGEMENT
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    const taskContainer =
        document.querySelector(
            ".tasks-container, #tasksContainer"
        );

    if (!taskContainer) return;

    renderTasks();

    setupTaskFilters();

    setupTaskActions();
});


/* =========================================================
   RENDER TASKS
   ========================================================= */

function renderTasks() {

    const container =
        document.querySelector(
            ".tasks-container, #tasksContainer"
        );

    if (!container) return;


    const tasks =
        Storage.get(
            STORAGE_KEYS.TASKS,
            []
        );


    if (!tasks.length) {

        container.innerHTML = `
            <div class="no-results">
                <h3>No tasks available</h3>
                <p>Your assigned tasks will appear here.</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        tasks.map(task => {

            const badgeClass =
                task.status === "Completed"
                    ? "badge-success"
                    : task.status === "In Progress"
                        ? "badge-warning"
                        : "badge-neutral";


            return `
                <article
                    class="task-card"
                    data-task-id="${task.id}"
                    data-status="${task.status}"
                    data-category="${task.category}"
                >

                    <div class="task-card-header">

                        <div>
                            <span class="task-category">
                                ${Utils.escapeHTML(task.category)}
                            </span>

                            <h3>
                                ${Utils.escapeHTML(task.title)}
                            </h3>
                        </div>

                        <span class="badge ${badgeClass}">
                            ${Utils.escapeHTML(task.status)}
                        </span>

                    </div>


                    <p class="task-description">
                        ${Utils.escapeHTML(task.description)}
                    </p>


                    <div class="task-meta">

                        <span>
                            Priority:
                            <strong>
                                ${Utils.escapeHTML(task.priority)}
                            </strong>
                        </span>

                        <span>
                            Due:
                            ${Utils.formatDate(task.dueDate)}
                        </span>

                    </div>


                    <div class="task-card-footer">

                        <span class="assigned-date">
                            Assigned
                            ${Utils.formatDate(task.createdAt)}
                        </span>

                        <button
                            class="btn btn-primary btn-small"
                            data-task-submit="${task.id}"
                        >
                            Submit Task
                        </button>

                    </div>

                </article>
            `;

        }).join("");
}


/* =========================================================
   FILTERS
   ========================================================= */

function setupTaskFilters() {

    const search =
        document.querySelector(
            "#taskSearch, .search-field input"
        );

    const status =
        document.querySelector(
            "#statusFilter"
        );

    const category =
        document.querySelector(
            "#categoryFilter"
        );


    const filter = () => {

        const searchValue =
            search?.value
                .toLowerCase()
                .trim() || "";

        const statusValue =
            status?.value || "All";

        const categoryValue =
            category?.value || "All";


        document.querySelectorAll(
            ".task-card"
        ).forEach(card => {

            const title =
                card.textContent.toLowerCase();

            const cardStatus =
                card.dataset.status;

            const cardCategory =
                card.dataset.category;


            const matchesSearch =
                title.includes(searchValue);

            const matchesStatus =
                statusValue === "All" ||
                cardStatus === statusValue;

            const matchesCategory =
                categoryValue === "All" ||
                cardCategory === categoryValue;


            card.style.display =
                matchesSearch &&
                matchesStatus &&
                matchesCategory
                    ? ""
                    : "none";
        });
    };


    search?.addEventListener(
        "input",
        filter
    );

    status?.addEventListener(
        "change",
        filter
    );

    category?.addEventListener(
        "change",
        filter
    );
}


/* =========================================================
   TASK ACTIONS
   ========================================================= */

function setupTaskActions() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "[data-task-submit]"
                );

            if (!button) return;


            const taskId =
                button.dataset.taskSubmit;


            const task =
                Storage.get(
                    STORAGE_KEYS.TASKS,
                    []
                ).find(
                    item => item.id === taskId
                );


            if (!task) return;


            window.location.href =
                `submit-task.html?task=${encodeURIComponent(
                    task.id
                )}`;
        }
    );
}


/* =========================================================
   TASK STATUS UPDATE
   ========================================================= */

function updateTaskStatus(taskId, status) {

    const tasks =
        Storage.get(
            STORAGE_KEYS.TASKS,
            []
        );


    const task =
        tasks.find(
            item => item.id === taskId
        );


    if (!task) return false;


    task.status = status;

    Storage.set(
        STORAGE_KEYS.TASKS,
        tasks
    );


    return true;
}