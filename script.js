const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const phone =
            document.getElementById("registerPhone").value;

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");


        // Check passwords

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        // Check password length

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            return;
        }


        // Create user object

        const user = {

            name: name,

            email: email,

            phone: phone,

            password: password

        };


        // Save user in browser

        localStorage.setItem(
            "winnersChessUser",
            JSON.stringify(user)
        );


        message.textContent =
            "Account created successfully!";


        // Go to login page after 1.5 seconds

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1500);

    });

}

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        // Get saved user

        const savedUser =
            localStorage.getItem("winnersChessUser");


        // Check if an account exists

        if (!savedUser) {

            message.textContent =
                "No account found. Please register first.";

            return;
        }


        // Convert saved data back into an object

        const user =
            JSON.parse(savedUser);


        // Check email and password

        if (
            email === user.email &&
            password === user.password
        ) {

            message.textContent =
                "Login successful!";


            // Remember that the user is logged in

            localStorage.setItem(
                "winnersChessLoggedIn",
                "true"
            );


            // Go to dashboard

            setTimeout(function() {

                window.location.href = "dashboard.html";

            }, 1000);

        }

        else {

            message.textContent =
                "Incorrect email or password.";

        }

    });

}

const dashboardName =
    document.getElementById("dashboardName");

const accountName =
    document.getElementById("accountName");

const accountEmail =
    document.getElementById("accountEmail");

const accountPhone =
    document.getElementById("accountPhone");


if (dashboardName) {

    const loggedIn =
        localStorage.getItem("winnersChessLoggedIn");

    const savedUser =
        localStorage.getItem("winnersChessUser");


    // If user isn't logged in, return to login

    if (loggedIn !== "true" || !savedUser) {

        window.location.href = "login.html";

    }

    else {

        const user =
            JSON.parse(savedUser);


        dashboardName.textContent =
            user.name;

        accountName.textContent =
            user.name;

        accountEmail.textContent =
            user.email;

        accountPhone.textContent =
            user.phone;

    }

}

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener("click", function() {

        localStorage.removeItem(
            "winnersChessLoggedIn"
        );


        window.location.href =
            "login.html";

    });

}

const profileName =
    document.getElementById("profileName");

const profileEmail =
    document.getElementById("profileEmail");

const profileFullName =
    document.getElementById("profileFullName");

const profileEmailAddress =
    document.getElementById("profileEmailAddress");

const profilePhone =
    document.getElementById("profilePhone");

const profileAvatar =
    document.getElementById("profileAvatar");

const editProfileButton =
    document.getElementById("editProfileButton");

const editProfileSection =
    document.getElementById("editProfileSection");

const cancelEditButton =
    document.getElementById("cancelEditButton");

const profileForm =
    document.getElementById("profileForm");


if (profileName) {

    const loggedIn =
        localStorage.getItem("winnersChessLoggedIn");

    const savedUser =
        localStorage.getItem("winnersChessUser");


    if (loggedIn !== "true" || !savedUser) {

        window.location.href = "login.html";

    }

    else {

        const user =
            JSON.parse(savedUser);


        profileName.textContent =
            user.name;

        profileEmail.textContent =
            user.email;

        profileFullName.textContent =
            user.name;

        profileEmailAddress.textContent =
            user.email;

        profilePhone.textContent =
            user.phone;


        // First letter of the user's name

        profileAvatar.textContent =
            user.name.charAt(0).toUpperCase();

    }

}

if (editProfileButton) {

    editProfileButton.addEventListener("click", function() {

        const savedUser =
            localStorage.getItem("winnersChessUser");

        const user =
            JSON.parse(savedUser);


        document.getElementById("editName").value =
            user.name;

        document.getElementById("editPhone").value =
            user.phone;


        editProfileSection.style.display =
            "block";


        editProfileSection.scrollIntoView({
            behavior: "smooth"
        });

    });

}

if (cancelEditButton) {

    cancelEditButton.addEventListener("click", function() {

        editProfileSection.style.display =
            "none";

    });

}

if (profileForm) {

    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const savedUser =
            localStorage.getItem("winnersChessUser");

        const user =
            JSON.parse(savedUser);


        const newName =
            document.getElementById("editName").value;

        const newPhone =
            document.getElementById("editPhone").value;


        user.name = newName;

        user.phone = newPhone;


        localStorage.setItem(
            "winnersChessUser",
            JSON.stringify(user)
        );


        document.getElementById("profileMessage")
            .textContent =
            "Profile updated successfully!";


        // Update page immediately

        profileName.textContent =
            user.name;

        profileFullName.textContent =
            user.name;

        profilePhone.textContent =
            user.phone;

        profileAvatar.textContent =
            user.name.charAt(0).toUpperCase();

    });

}

const settingsPage =
    document.querySelector(".settings-page");

if (settingsPage) {

    const loggedIn =
        localStorage.getItem("winnersChessLoggedIn");

    const savedUser =
        localStorage.getItem("winnersChessUser");


    if (loggedIn !== "true" || !savedUser) {

        window.location.href = "login.html";

    }

}

const darkModeToggle =
    document.getElementById("darkModeToggle");

if (darkModeToggle) {

    const darkMode =
        localStorage.getItem("winnersDarkMode");


    if (darkMode === "false") {

        darkModeToggle.checked = false;

    }


    darkModeToggle.addEventListener(
        "change",
        function() {

            localStorage.setItem(
                "winnersDarkMode",
                darkModeToggle.checked
            );

        }
    );

}

const tournamentNotifications =
    document.getElementById(
        "tournamentNotifications"
    );

const classNotifications =
    document.getElementById(
        "classNotifications"
    );


if (tournamentNotifications) {

    const tournamentSetting =
        localStorage.getItem(
            "tournamentNotifications"
        );


    if (tournamentSetting === "false") {

        tournamentNotifications.checked = false;

    }


    tournamentNotifications.addEventListener(
        "change",
        function() {

            localStorage.setItem(
                "tournamentNotifications",
                tournamentNotifications.checked
            );

        }
    );

}


if (classNotifications) {

    const classSetting =
        localStorage.getItem(
            "classNotifications"
        );


    if (classSetting === "false") {

        classNotifications.checked = false;

    }


    classNotifications.addEventListener(
        "change",
        function() {

            localStorage.setItem(
                "classNotifications",
                classNotifications.checked
            );

        }
    );

}

const settingsLogoutButton =
    document.getElementById(
        "settingsLogoutButton"
    );


if (settingsLogoutButton) {

    settingsLogoutButton.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "winnersChessLoggedIn"
            );

            window.location.href =
                "login.html";

        }
    );

}

const deleteAccountButton =
    document.getElementById(
        "deleteAccountButton"
    );


if (deleteAccountButton) {

    deleteAccountButton.addEventListener(
        "click",
        function() {

            const confirmDelete =
                confirm(
                    "Are you sure you want to delete your account?"
                );


            if (confirmDelete) {

                localStorage.removeItem(
                    "winnersChessUser"
                );

                localStorage.removeItem(
                    "winnersChessLoggedIn"
                );


                window.location.href =
                    "register.html";

            }

        }
    );

}