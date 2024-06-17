initializeAuthForm();

function initializeAuthForm() {
        //document.getElementById("hybrid").type = "password";
    addSubmitListener();
    addEyeMovement()
}

function addSubmitListener() {
    document.getElementById("password").addEventListener("submit", handleFormSubmit);
}

function addEyeMovement() {
    document.addEventListener("mousemove", (event) => {
        const eye = document.getElementsByClassName("eye")[0];
        const rect = eye.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        const newXClass = getEyeXClass(deltaX);
        const newYClass = getEyeYClass(deltaY);
        eye.classList.add(newXClass, newYClass);

        const allClasses = ["x-left", "x-right", "y-up", "y-down", "x-center", "y-center"];

        const newClasses = [newXClass, newYClass];

        const classesToRemove = allClasses.filter((c) => !newClasses.includes(c));

        eye.classList.add(newXClass, newYClass);
        eye.classList.remove(...classesToRemove);

    });
}


function getEyeXClass(deltaX) {
    const width = document.getElementsByClassName("eye")[0].offsetWidth;
    if (deltaX > width) {
        return "x-right";
    } else if (deltaX < -width) {
        return "x-left";
    } else {
        return "x-center";
    }
}

function getEyeYClass(deltaY) {
    const height = document.getElementsByClassName("eye")[0].offsetHeight;
    if (deltaY > height) {
        return "y-down";
    } else if (deltaY < -height) {
        return "y-up";
    } else {
        return "y-center";
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const url = "https://your-api-endpoint.com/protected";
    const authHeader = createAuthHeader();

    await attemptToSendRequest(url, authHeader);
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("hybrid");
    const showPasswordButton = document.getElementById("show-password");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showPasswordButton.textContent = "Hide password";
    } else {
        passwordInput.type = "password";
        showPasswordButton.textContent = "Show password";
    }
}

function createAuthHeader() {
    const encodedCredentials = createEncodedCredentials();
    return `Basic ${encodedCredentials}`;
}

function createEncodedCredentials() {
    const username = getFormInputValue("username");
    const password = getFormInputValue("password");
    return encodeCredentials(username, password);
}

function getFormInputValue(elementId) {
    return document.getElementById(elementId).value;
}

function encodeCredentials(username, password) {
    return btoa(`${username}:${password}`);
}

async function attemptToSendRequest(url, authHeader) {
    try {
        const response = await sendAuthenticatedRequest(url, authHeader);
        handleResponse(response);
    } catch (error) {
        handleError(error);
    }
}

async function sendAuthenticatedRequest(url, authHeader) {
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": authHeader
        }
    });
    return response;
}

function handleResponse(response) {
    if (response.ok) {
        response.json().then(data => {
            console.log("Protected data:", data);
        });
    } else {
        console.error("Request failed:", response.status, response.statusText);
    }
}

function handleError(error) {
    console.error("Error making request:", error);
}
