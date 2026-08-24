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