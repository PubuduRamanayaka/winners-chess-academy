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


        if (password !== confirmPassword) {

            message.textContent =
                "Passwords do not match.";

            return;

        }


        if (password.length < 6) {

            message.textContent =
                "Password must contain at least 6 characters.";

            return;

        }


        message.textContent =
            "Registration information looks good!";

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


        if (email === "" || password === "") {

            message.textContent =
                "Please enter your email and password.";

            return;

        }


        message.textContent =
            "Login information looks good!";

    });

}