/* =========================================================
   INTERNHUB
   AUTHENTICATION
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.querySelector("#loginForm");

    const registerForm =
        document.querySelector("#registerForm");


    if (loginForm) {
        setupLogin(loginForm);
    }

    if (registerForm) {
        setupRegister(registerForm);
    }

    setupPasswordToggles();
    setupPasswordStrength();

});


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin(form) {

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        const email =
            form.querySelector(
                "[name='email'], #loginEmail"
            )?.value.trim();


        const password =
            form.querySelector(
                "[name='password'], #loginPassword"
            )?.value;


        const message =
            form.querySelector(
                ".form-message, #loginMessage"
            );


        if (!email || !password) {

            Utils.showMessage(
                message,
                "Please enter your email and password."
            );

            return;
        }


        const users =
            Storage.get(STORAGE_KEYS.USERS, []);


        const user =
            users.find(
                item =>
                    item.email.toLowerCase() ===
                        email.toLowerCase() &&
                    item.password === password
            );


        if (!user) {

            Utils.showMessage(
                message,
                "Invalid email or password."
            );

            return;
        }


        Auth.setUser({

            id: user.id,

            name: user.name,

            email: user.email,

            role: user.role

        });


        window.location.href = "dashboard.html";

    });

}


/* =========================================================
   REGISTER
   ========================================================= */

function setupRegister(form) {

    form.addEventListener("submit", (event) => {

        event.preventDefault();


        /* -------------------------------------------------
           GET FORM VALUES
           ------------------------------------------------- */

        const firstName =
            form.querySelector("#firstName")?.value.trim();


        const lastName =
            form.querySelector("#lastName")?.value.trim();


        const email =
            form.querySelector("#registerEmail")?.value.trim();


        const phone =
            form.querySelector("#phone")?.value.trim();


        const institution =
            form.querySelector("#institution")?.value.trim();


        const field =
            form.querySelector("#field")?.value;


        const password =
            form.querySelector("#registerPassword")?.value;


        const confirmPassword =
            form.querySelector("#confirmPassword")?.value;


        const agreeTerms =
            form.querySelector("#agreeTerms")?.checked;


        const message =
            form.querySelector("#registerMessage");


        /* -------------------------------------------------
           REQUIRED FIELDS
           ------------------------------------------------- */

        if (
            !firstName ||
            !lastName ||
            !email ||
            !institution ||
            !field ||
            !password ||
            !confirmPassword
        ) {

            Utils.showMessage(
                message,
                "Please complete all required fields."
            );

            return;
        }


        /* -------------------------------------------------
           TERMS & CONDITIONS
           ------------------------------------------------- */

        if (!agreeTerms) {

            Utils.showMessage(
                message,
                "Please agree to the terms and conditions."
            );

            return;
        }


        /* -------------------------------------------------
           EMAIL VALIDATION
           ------------------------------------------------- */

        if (!isValidEmail(email)) {

            Utils.showMessage(
                message,
                "Please enter a valid email address."
            );

            return;
        }


        /* -------------------------------------------------
           PASSWORD VALIDATION
           ------------------------------------------------- */

        if (password.length < 8) {

            Utils.showMessage(
                message,
                "Password must contain at least 8 characters."
            );

            return;
        }


        /* -------------------------------------------------
           CONFIRM PASSWORD
           ------------------------------------------------- */

        if (password !== confirmPassword) {

            Utils.showMessage(
                message,
                "Passwords do not match."
            );

            return;
        }


        /* -------------------------------------------------
           GET EXISTING USERS
           ------------------------------------------------- */

        const users =
            Storage.get(
                STORAGE_KEYS.USERS,
                []
            );


        /* -------------------------------------------------
           CHECK EXISTING EMAIL
           ------------------------------------------------- */

        const existingUser =
            users.some(
                user =>
                    user.email.toLowerCase() ===
                    email.toLowerCase()
            );


        if (existingUser) {

            Utils.showMessage(
                message,
                "An account with this email already exists."
            );

            return;
        }


        /* -------------------------------------------------
           CREATE NEW USER
           ------------------------------------------------- */

        const newUser = {

            id: Utils.id("user"),

            name: `${firstName} ${lastName}`,

            email: email,

            password: password,

            role: "Intern",

            createdAt:
                new Date().toISOString(),

            profile: {

                phone: phone,

                university: institution,

                department: field,

                bio: "",

                skills: ""

            }

        };


        /* -------------------------------------------------
           SAVE USER
           ------------------------------------------------- */

        users.push(newUser);


        Storage.set(
            STORAGE_KEYS.USERS,
            users
        );


        /* -------------------------------------------------
           SET CURRENT USER
           ------------------------------------------------- */

        Auth.setUser({

            id: newUser.id,

            name: newUser.name,

            email: newUser.email,

            role: newUser.role

        });


        /* -------------------------------------------------
           REDIRECT TO DASHBOARD
           ------------------------------------------------- */

        window.location.href =
            "dashboard.html";

    });

}


/* =========================================================
   EMAIL VALIDATION
   ========================================================= */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =========================================================
   PASSWORD TOGGLE
   ========================================================= */

function setupPasswordToggles() {

    document.querySelectorAll(
        ".password-toggle, [data-password-toggle]"
    ).forEach(button => {

        button.addEventListener("click", () => {

            const field =
                button
                    .closest(".password-field")
                    ?.querySelector("input");


            if (!field) {
                return;
            }


            if (field.type === "password") {

                field.type = "text";

                button.textContent = "HIDE";

            } else {

                field.type = "password";

                button.textContent = "SHOW";

            }

        });

    });

}


/* =========================================================
   PASSWORD STRENGTH
   ========================================================= */

function setupPasswordStrength() {

    const passwordInput =
        document.querySelector(
            "#registerPassword, [name='password']"
        );


    if (!passwordInput) {
        return;
    }


    passwordInput.addEventListener("input", () => {

        const password =
            passwordInput.value;


        const strengthText =
            document.querySelector(
                ".strength-text"
            );


        const strengthBar =
            document.querySelector(
                ".strength-bar"
            );


        if (!strengthText) {
            return;
        }


        let score = 0;


        if (password.length >= 8) {
            score++;
        }


        if (/[A-Z]/.test(password)) {
            score++;
        }


        if (/[a-z]/.test(password)) {
            score++;
        }


        if (/[0-9]/.test(password)) {
            score++;
        }


        if (/[^A-Za-z0-9]/.test(password)) {
            score++;
        }


        const levels = [

            "Very weak",

            "Weak",

            "Fair",

            "Strong",

            "Very strong",

            "Excellent"

        ];


        strengthText.textContent =
            levels[score];


        if (strengthBar) {

            strengthBar.style.width =
                `${Math.max(score * 20, 5)}%`;

        }

    });

}