/* =========================================================
   INTERNHUB
   PROJECT MANAGEMENT
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    const projectContainer =
        document.querySelector(
            ".project-grid, #projectGrid"
        );

    if (!projectContainer) return;

    renderProjects();

    setupProjectSearch();
});


/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects() {

    const container =
        document.querySelector(
            ".project-grid, #projectGrid"
        );

    const projects =
        Storage.get(
            STORAGE_KEYS.PROJECTS,
            []
        );


    if (!projects.length) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>No projects found</h3>
                <p>Projects assigned to you will appear here.</p>
            </div>
        `;

        return;
    }


    container.innerHTML =
        projects.map(project => {

            return `
                <article
                    class="project-card"
                    data-project-name="${Utils.escapeHTML(
                        project.name.toLowerCase()
                    )}"
                >

                    <div class="project-card-top">

                        <span class="project-type">
                            ${Utils.escapeHTML(project.type)}
                        </span>

                        <span class="badge ${
                            project.status === "Active"
                                ? "badge-success"
                                : "badge-neutral"
                        }">
                            ${Utils.escapeHTML(project.status)}
                        </span>

                    </div>


                    <h3>
                        ${Utils.escapeHTML(project.name)}
                    </h3>


                    <p>
                        ${Utils.escapeHTML(project.description)}
                    </p>


                    <div class="project-progress">

                        <div class="progress-label">

                            <span>
                                Project progress
                            </span>

                            <strong>
                                ${project.progress}%
                            </strong>

                        </div>

                        <div class="progress-bar">
                            <span
                                style="width:${project.progress}%"
                            ></span>
                        </div>

                    </div>


                    <div class="project-meta">

                        <span>
                            Deadline
                        </span>

                        <strong>
                            ${Utils.formatDate(project.deadline)}
                        </strong>

                    </div>


                    <button
                        class="btn btn-outline btn-small"
                        data-project-id="${project.id}"
                    >
                        View Project
                    </button>

                </article>
            `;

        }).join("");
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupProjectSearch() {

    const search =
        document.querySelector(
            "#projectSearch, .project-search input"
        );

    if (!search) return;


    search.addEventListener(
        "input",
        () => {

            const value =
                search.value
                    .toLowerCase()
                    .trim();


            document.querySelectorAll(
                ".project-card"
            ).forEach(card => {

                const name =
                    card.dataset.projectName || "";

                card.style.display =
                    name.includes(value)
                        ? ""
                        : "none";
            });

        }
    );
}


/* =========================================================
   PROJECT DETAILS
   ========================================================= */

document.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "[data-project-id]"
            );

        if (!button) return;


        const project =
            Storage.get(
                STORAGE_KEYS.PROJECTS,
                []
            ).find(
                item =>
                    item.id ===
                    button.dataset.projectId
            );


        if (!project) return;


        alert(
            `${project.name}\n\n` +
            `${project.description}\n\n` +
            `Progress: ${project.progress}%\n` +
            `Deadline: ${Utils.formatDate(project.deadline)}`
        );
    }
);