/* =========================================================
   INTERNHUB
   PROFILE
   ========================================================= */

"use strict";


document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.querySelector(
            "#profileForm"
        );

    if (!form) return;


    loadProfile(form);

    setupProfileUpdate(form);
});


/* =========================================================
   LOAD PROFILE
   ========================================================= */

function loadProfile(form) {

    const currentUser =
        Auth.getUser();

    if (!currentUser) return;


    const users =
        Storage.get(
            STORAGE_KEYS.USERS,
            []
        );


    const user =
        users.find(
            item =>
                item.id ===
                currentUser.id
        );


    if (!user) return;


    setField(
        form,
        ["name", "fullName"],
        user.name
    );

    setField(
        form,
        ["email"],
        user.email
    );

    setField(
        form,
        ["phone"],
        user.profile?.phone || ""
    );

    setField(
        form,
        ["university"],
        user.profile?.university || ""
    );

    setField(
        form,
        ["department"],
        user.profile?.department || ""
    );

    setField(
        form,
        ["bio"],
        user.profile?.bio || ""
    );

    setField(
        form,
        ["skills"],
        user.profile?.skills || ""
    );
}


/* =========================================================
   FIELD HELPER
   ========================================================= */

function setField(
    form,
    names,
    value
) {

    for (const name of names) {

        const field =
            form.querySelector(
                `[name="${name}"], #${name}`
            );

        if (field) {

            field.value = value;

            break;
        }
    }
}


/* =========================================================
   UPDATE PROFILE
   ========================================================= */

function setupProfileUpdate(form) {

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const currentUser =
                Auth.getUser();


            if (!currentUser) return;


            const users =
                Storage.get(
                    STORAGE_KEYS.USERS,
                    []
                );


            const user =
                users.find(
                    item =>
                        item.id ===
                        currentUser.id
                );


            if (!user) return;


            const getValue =
                names => {

                    for (const name of names) {

                        const field =
                            form.querySelector(
                                `[name="${name}"], #${name}`
                            );

                        if (field) {
                            return field.value.trim();
                        }
                    }

                    return "";
                };


            const name =
                getValue([
                    "name",
                    "fullName"
                ]);


            const phone =
                getValue(["phone"]);


            const university =
                getValue(["university"]);


            const department =
                getValue(["department"]);


            const bio =
                getValue(["bio"]);


            const skills =
                getValue(["skills"]);


            if (!name) {

                Utils.showMessage(
                    form.querySelector(
                        ".form-message"
                    ),
                    "Name is required."
                );

                return;
            }


            user.name = name;


            user.profile = {

                phone,

                university,

                department,

                bio,

                skills
            };


            Storage.set(
                STORAGE_KEYS.USERS,
                users
            );


            Auth.setUser({

                ...currentUser,

                name

            });


            updateUserInterface();


            Utils.showMessage(
                form.querySelector(
                    ".form-message"
                ),
                "Profile updated successfully.",
                "success"
            );
        }
    );
}