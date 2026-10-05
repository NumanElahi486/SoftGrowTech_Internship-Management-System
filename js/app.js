/* =========================================================
   INTERNHUB
   GLOBAL APPLICATION
   ========================================================= */

"use strict";

const STORAGE_KEYS = {
    USERS: "internhub_users",
    CURRENT_USER: "internhub_current_user",
    TASKS: "internhub_tasks",
    SUBMISSIONS: "internhub_submissions",
    PROJECTS: "internhub_projects",
    NOTIFICATIONS: "internhub_notifications"
};


/* =========================================================
   STORAGE
   ========================================================= */

const Storage = {

    get(key, fallback = []) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch (error) {
            console.error("Storage read error:", error);
            return fallback;
        }
    },

    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error("Storage write error:", error);
            return false;
        }
    },

    remove(key) {
        localStorage.removeItem(key);
    }
};


/* =========================================================
   CURRENT USER
   ========================================================= */

const Auth = {

    getUser() {
        return Storage.get(STORAGE_KEYS.CURRENT_USER, null);
    },

    setUser(user) {
        Storage.set(STORAGE_KEYS.CURRENT_USER, user);
    },

    logout() {
        Storage.remove(STORAGE_KEYS.CURRENT_USER);
        window.location.href = "login.html";
    },

    isLoggedIn() {
        return Boolean(this.getUser());
    }
};


/* =========================================================
   HELPERS
   ========================================================= */

const Utils = {

    id(prefix = "id") {
        return `${prefix}_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;
    },

    getElement(selector) {
        return document.querySelector(selector);
    },

    getElements(selector) {
        return document.querySelectorAll(selector);
    },

    escapeHTML(value = "") {
        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    },

    formatDate(date = new Date()) {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }).format(new Date(date));
    },

    today() {
        return new Date().toISOString().split("T")[0];
    },

    showMessage(element, message, type = "error") {
        if (!element) return;

        element.textContent = message;
        element.className = `form-message ${type}`;

        setTimeout(() => {
            element.textContent = "";
            element.className = "form-message";
        }, 4000);
    },

    initials(name = "User") {
        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(word => word.charAt(0).toUpperCase())
            .join("");
    }
};


/* =========================================================
   DEFAULT DATA
   ========================================================= */

function initializeApplicationData() {

    if (!Storage.get(STORAGE_KEYS.TASKS, null)) {

        const tasks = [
            {
                id: Utils.id("task"),
                title: "Responsive Landing Page",
                category: "Frontend Development",
                description:
                    "Build a responsive company landing page using semantic HTML, CSS and JavaScript.",
                status: "In Progress",
                priority: "High",
                dueDate: "2026-10-12",
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.id("task"),
                title: "JavaScript Form Validation",
                category: "JavaScript",
                description:
                    "Create client-side validation for registration and contact forms.",
                status: "Pending",
                priority: "Medium",
                dueDate: "2026-10-17",
                createdAt: new Date().toISOString()
            },
            {
                id: Utils.id("task"),
                title: "Dashboard UI Implementation",
                category: "UI Development",
                description:
                    "Convert the provided dashboard design into a responsive frontend interface.",
                status: "Completed",
                priority: "Low",
                dueDate: "2026-10-05",
                createdAt: new Date().toISOString()
            }
        ];

        Storage.set(STORAGE_KEYS.TASKS, tasks);
    }


    if (!Storage.get(STORAGE_KEYS.PROJECTS, null)) {

        const projects = [
            {
                id: Utils.id("project"),
                name: "InternHub Portal",
                description:
                    "A complete internship management platform for tasks, submissions and progress tracking.",
                type: "Web Application",
                progress: 72,
                status: "Active",
                deadline: "2026-11-15"
            },
            {
                id: Utils.id("project"),
                name: "Company Portfolio",
                description:
                    "A professional company portfolio website with responsive layouts and reusable components.",
                type: "Frontend",
                progress: 45,
                status: "Active",
                deadline: "2026-11-25"
            },
            {
                id: Utils.id("project"),
                name: "Task Automation",
                description:
                    "Frontend prototype for managing recurring internship workflows and activities.",
                type: "JavaScript",
                progress: 28,
                status: "Planning",
                deadline: "2026-12-10"
            }
        ];

        Storage.set(STORAGE_KEYS.PROJECTS, projects);
    }


    if (!Storage.get(STORAGE_KEYS.SUBMISSIONS, null)) {
        Storage.set(STORAGE_KEYS.SUBMISSIONS, []);
    }


    if (!Storage.get(STORAGE_KEYS.NOTIFICATIONS, null)) {

        Storage.set(STORAGE_KEYS.NOTIFICATIONS, [
            {
                id: Utils.id("notification"),
                title: "Welcome to InternHub",
                message: "Your internship workspace is ready.",
                read: false,
                createdAt: new Date().toISOString()
            }
        ]);
    }
}


/* =========================================================
   USER UI
   ========================================================= */

function updateUserInterface() {

    const user = Auth.getUser();

    if (!user) return;

    const nameElements = document.querySelectorAll(
        "[data-user-name], .user-name"
    );

    nameElements.forEach(element => {
        element.textContent = user.name;
    });


    const emailElements = document.querySelectorAll(
        "[data-user-email], .user-email"
    );

    emailElements.forEach(element => {
        element.textContent = user.email;
    });


    const avatarElements = document.querySelectorAll(
        "[data-user-avatar], .user-avatar"
    );

    avatarElements.forEach(element => {
        if (!element.querySelector("img")) {
            element.textContent = Utils.initials(user.name);
        }
    });
}


/* =========================================================
   LOGOUT
   ========================================================= */

function setupLogout() {

    document.querySelectorAll(
        "#logoutBtn, .logout-button, [data-action='logout']"
    ).forEach(button => {

        button.addEventListener("click", event => {
            event.preventDefault();

            const confirmed = confirm(
                "Are you sure you want to logout?"
            );

            if (confirmed) {
                Auth.logout();
            }
        });

    });
}


/* =========================================================
   MOBILE SIDEBAR
   ========================================================= */

function setupSidebar() {

    const sidebar = document.querySelector(".sidebar");
    const openButton = document.querySelector(
        ".mobile-menu-button, #mobileMenuBtn"
    );
    const closeButton = document.querySelector(
        ".sidebar-close, #sidebarClose"
    );

    if (!sidebar) return;

    openButton?.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    closeButton?.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });


    document.querySelectorAll(".sidebar-link").forEach(link => {

        link.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });

    });
}


/* =========================================================
   ACTIVE SIDEBAR LINK
   ========================================================= */

function setActiveNavigation() {

    const currentPage =
        window.location.pathname.split("/").pop();

    document.querySelectorAll(".sidebar-link").forEach(link => {

        const href = link.getAttribute("href");

        if (href && href === currentPage) {
            link.classList.add("active");
        }

    });
}


/* =========================================================
   AUTH PAGE GUARD
   ========================================================= */

function protectApplicationPages() {

    const publicPages = [
        "",
        "index.html",
        "login.html",
        "register.html"
    ];

    const currentPage =
        window.location.pathname.split("/").pop();

    if (
        !publicPages.includes(currentPage) &&
        !Auth.isLoggedIn()
    ) {
        window.location.href = "login.html";
    }
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApplicationData();

    protectApplicationPages();

    updateUserInterface();

    setupLogout();

    setupSidebar();

    setActiveNavigation();

});