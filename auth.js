initializeAuthForm();

function initializeAuthForm() {
    //document.getElementById("hybrid").type = "password";
    document.getElementById("password").addEventListener("submit", handleFormSubmit);
    addEyeMovement()
}

function addEyeMovement() {
    document.addEventListener("mousemove", (event) => {
        const emoji = document.getElementsByClassName("emoji")[0];
        const rect = emoji.getBoundingClientRect();
        const centerX = rect.left + rect.width;
        const centerY = rect.top + rect.height;

        const deltaX = event.clientX - centerX;
        const deltaY = event.clientY - centerY;

        emoji.classList.remove("right", "down", "left");

        if (deltaX > 0) {
            emoji.classList.add("right");
        } else if (deltaX < 0) {
            emoji.classList.add("left");
        } 
        if (deltaY > 0) {
            emoji.classList.add("down");
        }
    });
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
