document.getElementById('register-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Send a POST request to register the new user
    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        // Redirect user to the login page
        window.location.href = 'login.html';
    } else {
        // Display error message to the user
        document.getElementById('message').innerText = data.message;
    }
});
