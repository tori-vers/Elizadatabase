document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (data.success) {
        // Redirect user to another page or perform any other action upon successful login
        window.location.href = '/chat.html';
    } else {
        // Display error message to the user
        document.getElementById('message').innerText = data.message;
    }
});
