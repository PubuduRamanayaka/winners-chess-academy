/* =========================================================
   WINNERS CHESS ACADEMY
   MAIN JAVASCRIPT
   ========================================================= */


/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

// Get saved user
function getSavedUser() {

    const savedUser = localStorage.getItem("winnersChessUser");

    if (!savedUser) {
        return null;
    }

    try {

        return JSON.parse(savedUser);

    } catch (error) {

        console.log("Saved user data is corrupted.");

        localStorage.removeItem("winnersChessUser");

        return null;
    }
}


// Check whether user is logged in
function isLoggedIn() {

    return localStorage.getItem("winnersChessLoggedIn") === "true";
}


// Protect pages that require login
function protectPage() {

    if (!isLoggedIn() || !getSavedUser()) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


/* =========================================================
   REGISTER
   ========================================================= */

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();


        // Get form values

        const name = document.getElementById("registerName").value.trim();

        const email = document.getElementById("registerEmail").value.trim().toLowerCase();

        const phone = document.getElementById("registerPhone").value.trim();

        const password = document.getElementById("registerPassword").value;

        const confirmPassword = document.getElementById("confirmPassword").value;

        const message = document.getElementById("registerMessage");


        // Check required fields

        if (!name || !email || !phone || !password || !confirmPassword) {

            message.textContent = "Please fill in all fields.";

            return;
        }


        // Check password length

        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            return;
        }


        // Check passwords

        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;
        }


        // Check whether an account already exists

        const existingUser = getSavedUser();

        if (existingUser && existingUser.email === email) {

            message.textContent =
                "An account with this email already exists.";

            return;
        }


        // Create user object

        const user = {

            name: name,

            email: email,

            phone: phone,

            password: password

        };


        // Save user

        localStorage.setItem(
            "winnersChessUser",
            JSON.stringify(user)
        );


        // Make sure user is not automatically logged in

        localStorage.removeItem("winnersChessLoggedIn");


        // Show success message

        message.textContent =
            "Account created successfully!";


        // Go to login page

        setTimeout(function() {

            window.location.href = "login.html";

        }, 1500);

    });

}


/* =========================================================
   LOGIN
   ========================================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();


        // Get form values

        const email =
            document.getElementById("loginEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");


        // Check empty fields

        if (!email || !password) {

            message.textContent =
                "Please enter your email and password.";

            return;
        }


        // Get saved user

        const user = getSavedUser();


        // Check account

        if (!user) {

            message.textContent =
                "No account found. Please register first.";

            return;
        }


        // Check email and password

        if (
            email === user.email &&
            password === user.password
        ) {

            message.textContent =
                "Login successful!";


            // Save login status

            localStorage.setItem(
                "winnersChessLoggedIn",
                "true"
            );


            // Go to dashboard

            setTimeout(function() {

                window.location.href =
                    "dashboard.html";

            }, 1000);

        }

        else {

            message.textContent =
                "Incorrect email or password.";

        }

    });

}


/* =========================================================
   DASHBOARD
   ========================================================= */

const dashboardName =
    document.getElementById("dashboardName");

const accountName =
    document.getElementById("accountName");

const accountEmail =
    document.getElementById("accountEmail");

const accountPhone =
    document.getElementById("accountPhone");


if (dashboardName) {

    if (!protectPage()) {

        // Stop dashboard code

    }

    else {

        const user = getSavedUser();


        if (user) {

            // Dashboard name

            dashboardName.textContent =
                user.name;


            // Account information

            if (accountName) {

                accountName.textContent =
                    user.name;
            }


            if (accountEmail) {

                accountEmail.textContent =
                    user.email;
            }


            if (accountPhone) {

                accountPhone.textContent =
                    user.phone;
            }

        }

    }

}


/* =========================================================
   LOGOUT
   ========================================================= */

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


/* =========================================================
   PROFILE PAGE
   ========================================================= */

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

    if (!protectPage()) {

        // Stop profile code

    }

    else {

        const user = getSavedUser();


        if (user) {

            // Header

            profileName.textContent =
                user.name;


            profileEmail.textContent =
                user.email;


            // Profile information

            if (profileFullName) {

                profileFullName.textContent =
                    user.name;
            }


            if (profileEmailAddress) {

                profileEmailAddress.textContent =
                    user.email;
            }


            if (profilePhone) {

                profilePhone.textContent =
                    user.phone;
            }


            // Avatar

            if (profileAvatar) {

                profileAvatar.textContent =
                    user.name.charAt(0).toUpperCase();
            }

        }

    }

}


/* =========================================================
   EDIT PROFILE
   ========================================================= */

if (editProfileButton) {

    editProfileButton.addEventListener("click", function() {

        const user = getSavedUser();


        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        const editName =
            document.getElementById("editName");

        const editPhone =
            document.getElementById("editPhone");


        if (editName) {

            editName.value =
                user.name;
        }


        if (editPhone) {

            editPhone.value =
                user.phone;
        }


        if (editProfileSection) {

            editProfileSection.style.display =
                "block";


            editProfileSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

}


/* =========================================================
   CANCEL EDIT PROFILE
   ========================================================= */

if (cancelEditButton) {

    cancelEditButton.addEventListener("click", function() {

        if (editProfileSection) {

            editProfileSection.style.display =
                "none";

        }

    });

}


/* =========================================================
   SAVE PROFILE CHANGES
   ========================================================= */

if (profileForm) {

    profileForm.addEventListener("submit", function(event) {

        event.preventDefault();


        const user = getSavedUser();


        if (!user) {

            window.location.href =
                "login.html";

            return;
        }


        const editName =
            document.getElementById("editName");

        const editPhone =
            document.getElementById("editPhone");


        if (!editName || !editPhone) {

            return;
        }


        const newName =
            editName.value.trim();

        const newPhone =
            editPhone.value.trim();


        // Check name

        if (!newName) {

            const profileMessage =
                document.getElementById("profileMessage");

            if (profileMessage) {

                profileMessage.textContent =
                    "Please enter your name.";
            }

            return;
        }


        // Check phone

        if (!newPhone) {

            const profileMessage =
                document.getElementById("profileMessage");

            if (profileMessage) {

                profileMessage.textContent =
                    "Please enter your phone number.";
            }

            return;
        }


        // Update user

        user.name =
            newName;

        user.phone =
            newPhone;


        // Save updated user

        localStorage.setItem(
            "winnersChessUser",
            JSON.stringify(user)
        );


        // Success message

        const profileMessage =
            document.getElementById("profileMessage");

        if (profileMessage) {

            profileMessage.textContent =
                "Profile updated successfully!";
        }


        // Update page immediately

        if (profileName) {

            profileName.textContent =
                user.name;
        }


        if (profileFullName) {

            profileFullName.textContent =
                user.name;
        }


        if (profilePhone) {

            profilePhone.textContent =
                user.phone;
        }


        if (profileAvatar) {

            profileAvatar.textContent =
                user.name.charAt(0).toUpperCase();
        }


        // Hide edit section after saving

        if (editProfileSection) {

            setTimeout(function() {

                editProfileSection.style.display =
                    "none";

            }, 1000);

        }

    });

}


/* =========================================================
   SETTINGS PAGE
   ========================================================= */

const settingsPage =
    document.querySelector(".settings-page");


if (settingsPage) {

    protectPage();

}


/* =========================================================
   DARK MODE / LIGHT MODE
   ========================================================= */

const darkModeToggle =
    document.getElementById("darkModeToggle");


function applyTheme() {

    const darkMode =
        localStorage.getItem("winnersDarkMode");


    if (darkMode === "false") {

        document.body.classList.add("light-mode");

    }

    else {

        document.body.classList.remove("light-mode");

    }


    if (darkModeToggle) {

        darkModeToggle.checked =
            darkMode !== "false";

    }

}


applyTheme();


if (darkModeToggle) {

    darkModeToggle.addEventListener(
        "change",
        function() {

            localStorage.setItem(
                "winnersDarkMode",
                darkModeToggle.checked
            );


            applyTheme();

        }
    );

}


/* =========================================================
   TOURNAMENT NOTIFICATIONS
   ========================================================= */

const tournamentNotifications =
    document.getElementById(
        "tournamentNotifications"
    );


if (tournamentNotifications) {

    const savedSetting =
        localStorage.getItem(
            "tournamentNotifications"
        );


    // Default is ON

    if (savedSetting === null) {

        tournamentNotifications.checked =
            true;

    }

    else {

        tournamentNotifications.checked =
            savedSetting !== "false";

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


/* =========================================================
   CLASS NOTIFICATIONS
   ========================================================= */

const classNotifications =
    document.getElementById(
        "classNotifications"
    );


if (classNotifications) {

    const savedSetting =
        localStorage.getItem(
            "classNotifications"
        );


    // Default is ON

    if (savedSetting === null) {

        classNotifications.checked =
            true;

    }

    else {

        classNotifications.checked =
            savedSetting !== "false";

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


/* =========================================================
   SETTINGS LOGOUT
   ========================================================= */

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


/* =========================================================
   DELETE ACCOUNT
   ========================================================= */

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


                // Delete user

                localStorage.removeItem(
                    "winnersChessUser"
                );


                // Delete login status

                localStorage.removeItem(
                    "winnersChessLoggedIn"
                );


                // Delete personal settings

                localStorage.removeItem(
                    "tournamentNotifications"
                );

                localStorage.removeItem(
                    "classNotifications"
                );


                // Go to registration

                window.location.href =
                    "register.html";

            }

        }
    );

}




/* =========================================================
   CHANGE PASSWORD
   ========================================================= */

const changePasswordButton =
    document.getElementById("changePasswordButton");

const changePasswordSection =
    document.getElementById("changePasswordSection");

const cancelPasswordButton =
    document.getElementById("cancelPasswordButton");

const savePasswordButton =
    document.getElementById("savePasswordButton");

const passwordMessage =
    document.getElementById("passwordMessage");


// Open change password section

if (changePasswordButton) {

    changePasswordButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            if (changePasswordSection) {

                changePasswordSection.style.display =
                    "block";

                changePasswordSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });

            }

        }
    );

}


// Cancel change password

if (cancelPasswordButton) {

    cancelPasswordButton.addEventListener(
        "click",
        function() {

            if (changePasswordSection) {

                changePasswordSection.style.display =
                    "none";

            }


            // Clear fields

            document.getElementById(
                "currentPassword"
            ).value = "";

            document.getElementById(
                "newPassword"
            ).value = "";

            document.getElementById(
                "confirmNewPassword"
            ).value = "";


            if (passwordMessage) {

                passwordMessage.textContent = "";

            }

        }
    );

}


// Update password

if (savePasswordButton) {

    savePasswordButton.addEventListener(
        "click",
        function() {


            const user =
                getSavedUser();


            // Check user

            if (!user) {

                window.location.href =
                    "login.html";

                return;

            }


            const currentPassword =
                document.getElementById(
                    "currentPassword"
                ).value;

            const newPassword =
                document.getElementById(
                    "newPassword"
                ).value;

            const confirmNewPassword =
                document.getElementById(
                    "confirmNewPassword"
                ).value;


            // Check empty fields

            if (
                !currentPassword ||
                !newPassword ||
                !confirmNewPassword
            ) {

                passwordMessage.textContent =
                    "Please fill in all password fields.";

                return;

            }


            // Check current password

            if (currentPassword !== user.password) {

                passwordMessage.textContent =
                    "Current password is incorrect.";

                return;

            }


            // Check new password length

            if (newPassword.length < 6) {

                passwordMessage.textContent =
                    "New password must contain at least 6 characters.";

                return;

            }


            // Check new password confirmation

            if (newPassword !== confirmNewPassword) {

                passwordMessage.textContent =
                    "New passwords do not match.";

                return;

            }


            // Check whether new password is same
            // as current password

            if (newPassword === currentPassword) {

                passwordMessage.textContent =
                    "New password must be different from your current password.";

                return;

            }


            // Update password

            user.password =
                newPassword;


            // Save updated user

            localStorage.setItem(
                "winnersChessUser",
                JSON.stringify(user)
            );


            // Success message

            passwordMessage.textContent =
                "Password updated successfully!";


            // Clear fields

            document.getElementById(
                "currentPassword"
            ).value = "";

            document.getElementById(
                "newPassword"
            ).value = "";

            document.getElementById(
                "confirmNewPassword"
            ).value = "";


            // Hide section after a short delay

            setTimeout(function() {

                if (changePasswordSection) {

                    changePasswordSection.style.display =
                        "none";

                }

                if (passwordMessage) {

                    passwordMessage.textContent = "";

                }

            }, 1500);

        }
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.getElementById("navLinks");


if (menuButton && navLinks) {


    // Open / close menu

    menuButton.addEventListener(
        "click",
        function() {

            navLinks.classList.toggle("active");

        }
    );


    // Close menu after clicking a link

    const navItems =
        navLinks.querySelectorAll("a");


    navItems.forEach(function(link) {

        link.addEventListener(
            "click",
            function() {

                navLinks.classList.remove("active");

            }
        );

    });

}


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        if (!menuButton || !navLinks) {

            return;
        }


        const clickedInsideMenu =
            navLinks.contains(event.target);

        const clickedButton =
            menuButton.contains(event.target);


        if (
            !clickedInsideMenu &&
            !clickedButton
        ) {

            navLinks.classList.remove("active");

        }

    }
);


/* =========================================================
   PREVENT LOGGED-IN USER FROM GOING TO LOGIN/REGISTER
   ========================================================= */

const loginPageForm =
    document.getElementById("loginForm");

const registerPageForm =
    document.getElementById("registerForm");


if (
    (loginPageForm || registerPageForm) &&
    isLoggedIn() &&
    getSavedUser()
) {

    // User is already logged in.
    // We don't automatically redirect here because
    // the user may still want to register another account.

}


/* =========================================================
   END OF SCRIPT
   ========================================================= */