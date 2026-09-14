const BASE_URL = "http://localhost:8081";

/* ---------------------------
   Load Logged-in User
----------------------------*/

function loadUser() {

    const user = JSON.parse(localStorage.getItem("loggedInUser"));

    if (user && document.getElementById("loggedUser")) {

        document.getElementById("loggedUser").innerText =
            user.username;

    }

}

/* ---------------------------
   Dashboard
----------------------------*/

async function loadDashboard() {

    if (!document.getElementById("totalBuilds")) return;

    try {

        const response = await fetch(BASE_URL + "/api/dashboard");
        const result = await response.json();

        document.getElementById("totalBuilds").innerText =
            result.data.totalBuilds;

        document.getElementById("successfulBuilds").innerText =
            result.data.successfulBuilds;

        document.getElementById("failedBuilds").innerText =
            result.data.failedBuilds;

        document.getElementById("latestDeployment").innerText =
            result.data.latestDeploymentStatus;

    }

    catch (error) {

        console.error(error);

    }

}

/* ---------------------------
   Build History
----------------------------*/

async function loadBuilds() {

    const table = document.getElementById("buildTable");

    if (!table) return;

    try {

        const response =
            await fetch(BASE_URL + "/api/builds");

        const result =
            await response.json();

        table.innerHTML = "";

        result.data.forEach(build => {

            table.innerHTML += `

            <tr>

                <td>${build.buildNumber}</td>

                <td>

                    <span class="badge ${build.status === "SUCCESS" ? "bg-success" : "bg-danger"}">

                        ${build.status}

                    </span>

                </td>

                <td>${build.duration}</td>

                <td>${build.triggeredBy}</td>

            </tr>

            `;

        });

    }

    catch (error) {

        console.error(error);

    }

}

async function triggerBuild() {

    try {

        await fetch(BASE_URL + "/api/builds/trigger", {

            method: "POST"

        });

        loadBuilds();
        loadDashboard();

    }

    catch (error) {

        console.error(error);

    }

}

/* ---------------------------
   Deployment
----------------------------*/

async function loadDeployment() {

    if (!document.getElementById("deploymentStatus")) return;

    try {

        const response =
            await fetch(BASE_URL + "/api/deployments/latest");

        const result =
            await response.json();

        const deployment =
            result.data;

        document.getElementById("deploymentStatus").innerText =
            deployment.status;

        document.getElementById("deploymentEnvironment").innerText =
            deployment.environment;

        document.getElementById("deploymentVersion").innerText =
            deployment.version;

        document.getElementById("deploymentTime").innerText =
            deployment.deployedAt;

        if (deployment.status === "SUCCESS") {

            document.getElementById("deploymentStatus").className =
                "badge bg-success";

        }

        else {

            document.getElementById("deploymentStatus").className =
                "badge bg-danger";

        }

    }

    catch (error) {

        console.error(error);

    }

}

async function triggerDeployment() {

    try {

        await fetch(BASE_URL + "/api/deployments/trigger", {

            method: "POST"

        });

        loadDeployment();

    }

    catch (error) {

        console.error(error);

    }

}

/* ---------------------------
   Health
----------------------------*/

async function loadHealth() {

    if (!document.getElementById("backendStatus")) return;

    try {

        const response =
            await fetch(BASE_URL + "/api/health");

        const data =
            await response.json();

        document.getElementById("backendStatus").innerText =
            data.status;

        document.getElementById("applicationName").innerText =
            data.application;

        document.getElementById("backendMessage").innerText =
            data.message;

        if (data.status === "UP") {

            document.getElementById("backendStatus").className =
                "badge bg-success";

        }

        else {

            document.getElementById("backendStatus").className =
                "badge bg-danger";

        }

    }

    catch (error) {

        document.getElementById("backendStatus").innerText =
            "DOWN";

        document.getElementById("backendStatus").className =
            "badge bg-danger";

    }

}

/* ---------------------------
   Event Listeners
----------------------------*/

document.addEventListener("DOMContentLoaded", () => {

    loadUser();

    loadDashboard();

    loadBuilds();

    loadDeployment();

    loadHealth();

    const buildBtn =
        document.getElementById("triggerBuildBtn");

    if (buildBtn) {

        buildBtn.addEventListener("click", triggerBuild);

    }

    const deployBtn =
        document.getElementById("triggerDeploymentBtn");

    if (deployBtn) {

        deployBtn.addEventListener("click", triggerDeployment);

    }

});