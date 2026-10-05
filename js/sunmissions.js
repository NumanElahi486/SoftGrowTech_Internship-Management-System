/* =========================================================
   INTERNHUB
   SUBMISSIONS
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    setupSubmissionForm();

    renderSubmissions();
});


/* =========================================================
   SUBMISSION FORM
   ========================================================= */

function setupSubmissionForm() {

    const form =
        document.querySelector(
            "#submissionForm"
        );

    if (!form) return;


    const params =
        new URLSearchParams(
            window.location.search
        );

    const taskId =
        params.get("task");


    if (taskId) {

        const task =
            Storage.get(
                STORAGE_KEYS.TASKS,
                []
            ).find(
                item => item.id === taskId
            );


        if (task) {

            const taskInput =
                form.querySelector(
                    "#taskId, [name='taskId']"
                );

            const titleInput =
                form.querySelector(
                    "#taskTitle, [name='taskTitle']"
                );


            if (taskInput) {
                taskInput.value = task.id;
            }

            if (titleInput) {
                titleInput.value = task.title;
            }
        }
    }


    form.addEventListener(
        "submit",
        submitTask
    );
}


/* =========================================================
   SUBMIT
   ========================================================= */

function submitTask(event) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const user =
        Auth.getUser();


    if (!user) {
        window.location.href =
            "login.html";
        return;
    }


    const taskId =
        form.querySelector(
            "#taskId, [name='taskId']"
        )?.value;


    const title =
        form.querySelector(
            "#taskTitle, [name='taskTitle']"
        )?.value.trim();


    const description =
        form.querySelector(
            "#submissionDescription, [name='description']"
        )?.value.trim();


    const link =
        form.querySelector(
            "#projectLink, [name='projectLink']"
        )?.value.trim();


    const message =
        form.querySelector(
            ".form-message, #submissionMessage"
        );


    if (!taskId || !title || !description) {

        Utils.showMessage(
            message,
            "Please complete all required fields."
        );

        return;
    }


    const submissions =
        Storage.get(
            STORAGE_KEYS.SUBMISSIONS,
            []
        );


    const newSubmission = {

        id: Utils.id("submission"),

        taskId,

        title,

        description,

        link: link || "",

        submittedBy: user.id,

        submittedAt:
            new Date().toISOString(),

        status: "Under Review",

        feedback: ""
    };


    submissions.unshift(
        newSubmission
    );


    Storage.set(
        STORAGE_KEYS.SUBMISSIONS,
        submissions
    );


    updateTaskStatus(
        taskId,
        "Completed"
    );


    addNotification(
        "Task submitted",
        `${title} was successfully submitted for review.`
    );


    Utils.showMessage(
        message,
        "Task submitted successfully.",
        "success"
    );


    setTimeout(() => {

        window.location.href =
            "submissions.html";

    }, 900);
}


/* =========================================================
   RENDER SUBMISSIONS
   ========================================================= */

function renderSubmissions() {

    const table =
        document.querySelector(
            "#submissionTableBody, .submission-data-table tbody"
        );

    if (!table) return;


    const user =
        Auth.getUser();


    const submissions =
        Storage.get(
            STORAGE_KEYS.SUBMISSIONS,
            []
        ).filter(
            item =>
                !user ||
                item.submittedBy === user.id
        );


    if (!submissions.length) {

        table.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <h3>No submissions yet</h3>
                        <p>
                            Your submitted tasks will appear here.
                        </p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }


    table.innerHTML =
        submissions.map(item => {

            const badgeClass =
                item.status === "Approved"
                    ? "badge-success"
                    : item.status === "Rejected"
                        ? "badge-danger"
                        : "badge-warning";


            return `
                <tr>

                    <td>
                        <strong>
                            ${Utils.escapeHTML(item.title)}
                        </strong>

                        <span>
                            ${Utils.escapeHTML(
                                item.description.substring(0, 60)
                            )}
                        </span>
                    </td>

                    <td>
                        ${Utils.formatDate(item.submittedAt)}
                    </td>

                    <td>
                        <span class="badge ${badgeClass}">
                            ${Utils.escapeHTML(item.status)}
                        </span>
                    </td>

                    <td>
                        ${
                            item.feedback
                                ? Utils.escapeHTML(item.feedback)
                                : "Awaiting review"
                        }
                    </td>

                    <td>
                        ${
                            item.link
                                ? `<a
                                    class="table-action"
                                    href="${Utils.escapeHTML(item.link)}"
                                    target="_blank"
                                    rel="noopener"
                                   >
                                    View
                                   </a>`
                                : "—"
                        }
                    </td>

                </tr>
            `;

        }).join("");
}


/* =========================================================
   NOTIFICATION
   ========================================================= */

function addNotification(title, message) {

    const notifications =
        Storage.get(
            STORAGE_KEYS.NOTIFICATIONS,
            []
        );


    notifications.unshift({

        id: Utils.id("notification"),

        title,

        message,

        read: false,

        createdAt:
            new Date().toISOString()

    });


    Storage.set(
        STORAGE_KEYS.NOTIFICATIONS,
        notifications.slice(0, 30)
    );
}