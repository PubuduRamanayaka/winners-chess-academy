/* =========================================================
   WINNERS CHESS ACADEMY
   MAIN JAVASCRIPT (FRONTEND VISUALS ONLY)
   ========================================================= */


/* =========================================================
   DARK MODE / LIGHT MODE
   ========================================================= */

const darkModeToggle = document.getElementById("darkModeToggle");

function applyTheme() {
    const darkMode = localStorage.getItem("winnersDarkMode");

    if (darkMode === "false") {
        document.body.classList.add("light-mode");
    } else {
        document.body.classList.remove("light-mode");
    }

    if (darkModeToggle) {
        darkModeToggle.checked = darkMode !== "false";
    }
}

applyTheme();

if (darkModeToggle) {
    darkModeToggle.addEventListener("change", function() {
        localStorage.setItem("winnersDarkMode", darkModeToggle.checked);
        applyTheme();
    });
}


/* =========================================================
   TOURNAMENT NOTIFICATIONS (UI TOGGLE)
   ========================================================= */

const tournamentNotifications = document.getElementById("tournamentNotifications");

if (tournamentNotifications) {
    const savedSetting = localStorage.getItem("tournamentNotifications");

    // Default is ON
    if (savedSetting === null) {
        tournamentNotifications.checked = true;
    } else {
        tournamentNotifications.checked = savedSetting !== "false";
    }

    tournamentNotifications.addEventListener("change", function() {
        localStorage.setItem("tournamentNotifications", tournamentNotifications.checked);
    });
}


/* =========================================================
   CLASS NOTIFICATIONS (UI TOGGLE)
   ========================================================= */

const classNotifications = document.getElementById("classNotifications");

if (classNotifications) {
    const savedSetting = localStorage.getItem("classNotifications");

    // Default is ON
    if (savedSetting === null) {
        classNotifications.checked = true;
    } else {
        classNotifications.checked = savedSetting !== "false";
    }

    classNotifications.addEventListener("change", function() {
        localStorage.setItem("classNotifications", classNotifications.checked);
    });
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {
    // Open / close menu
    menuButton.addEventListener("click", function() {
        navLinks.classList.toggle("active");
    });

    // Close menu after clicking a link
    const navItems = navLinks.querySelectorAll("a");
    navItems.forEach(function(link) {
        link.addEventListener("click", function() {
            navLinks.classList.remove("active");
        });
    });
}


/* =========================================================
   CLOSE MOBILE MENU WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener("click", function(event) {
    if (!menuButton || !navLinks) {
        return;
    }

    const clickedInsideMenu = navLinks.contains(event.target);
    const clickedButton = menuButton.contains(event.target);

    if (!clickedInsideMenu && !clickedButton) {
        navLinks.classList.remove("active");
    }
});