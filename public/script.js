document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('sendBtn');
    const userInput = document.getElementById('userInput');
    const messages = document.querySelector('.messages');
    const apiKeyModal = document.getElementById('apiKeyModal');
    const closeModal = document.getElementById('closeModal');
    const checkKeysBtn = document.getElementById('checkKeysBtn');
    const modalMessage = document.getElementById('modalMessage');

    // Show modal on page load
    apiKeyModal.style.display = 'block';

    // Close modal
    closeModal.onclick = () => {
        apiKeyModal.style.display = 'none';
    };

    // Check API keys
    checkKeysBtn.onclick = async () => {
        const openaiKey = document.getElementById('openaiKey').value;
        const githubKey = document.getElementById('githubKey').value;

        const response = await fetch('/validate-keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ openaiKey, githubKey }),
        });

        const data = await response.json();
        if (response.ok) {
            modalMessage.textContent = 'Keys are valid!';
            modalMessage.style.color = 'green';
            apiKeyModal.style.display = 'none';
        } else {
            modalMessage.textContent = data.message;
            modalMessage.style.color = 'red';
        }
    };

// Add timestamp to messages
function formatMessage(sender, content) {
    const timestamp = new Date().toLocaleTimeString();
    return `<div>${sender} [${timestamp}]: ${content}</div>`;
}

    // Send message
    sendBtn.onclick = async () => {
        const message = userInput.value;
        if (!message) return;

        // Display user message
        messages.innerHTML += `<div>User: ${message}</div>`;
        userInput.value = '';

        // Send message to server
        const repoData = { full_name: 'octocat/Spoon-Knife' }; // Example repo data
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message : message, repoData }),
        });

        const data = await response.json();
        if (response.ok) {
            // Display AI response
            messages.innerHTML += `<div>AI: ${data.choices[0].message.content}</div>`;
        } else {
            messages.innerHTML += `<div>AI: Error communicating with OpenAI API</div>`;
        }

        // Scroll to the bottom of the messages
        messages.scrollTop = messages.scrollHeight;
// Fetch repositories after validating API keys
checkKeysBtn.onclick = async () => {
    const openaiKey = document.getElementById('openaiKey').value;
    const githubKey = document.getElementById('githubKey').value;

    const response = await fetch('/validate-keys', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ openaiKey, githubKey }),
    });

    const data = await response.json();
    if (response.ok) {
        modalMessage.textContent = 'Keys are valid!';
        modalMessage.style.color = 'green';
        apiKeyModal.style.display = 'none';

        // Fetch repositories
        fetchRepositories(githubKey);
    } else {
        modalMessage.textContent = data.message;
        modalMessage.style.color = 'red';
    }
};

// Function to fetch repositories
async function fetchRepositories(githubKey) {
    const response = await fetch('/repositories', {
        method: 'GET',
        headers: {
            'Authorization': `token ${githubKey}`
        }
    });

    const repos = await response.json();
    const repoSelect = document.getElementById('repoSelect');
    repos.forEach(repo => {
        const option = document.createElement('option');
        option.value = repo.full_name;
        option.textContent = repo.full_name;
        repoSelect.appendChild(option);
    });
}

// Update send message function to include loading indicator
sendBtn.onclick = async () => {
    const message = userInput.value;
    const repoSelect = document.getElementById('repoSelect');


// Add timestamp to messages
function formatMessage(sender, content) {
    const timestamp = new Date().toLocaleTimeString();
    return `<div>${sender} [${timestamp}]: ${content}</div>`;
}

// Update send message function
sendBtn.onclick = async () => {
    const message = userInput.value;
    const repoSelect = document.getElementById('repoSelect');

    if (!message || !repoSelect.value) return;

    messages.innerHTML += formatMessage('User ', message);
    userInput.value = '';
    document.getElementById('loading').style.display = 'block';

    const repoData = { full_name: repoSelect.value };
    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message, repoData }),
    });

    const data = await response.json();
    document.getElementById('loading').style.display = 'none';

    if (response.ok) {
        messages.innerHTML += formatMessage('AI', data.choices[0].message.content);
    } else {
        messages.innerHTML += formatMessage('AI', 'Error communicating with OpenAI API');
    }

    messages.scrollTop = messages.scrollHeight;
}; 
    if (!message || !repoSelect.value) return;

    // Display user message
    messages.innerHTML += `<div>User: ${message}</div>`;
    userInput.value = '';

    // Show loading indicator
    document.getElementById('loading').style.display = 'block';

    // Send message to server
    const repoData = { full_name: repoSelect.value };
    const response = await fetch('/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, repoData }),
    });

    const data = await response.json();
    // Hide loading indicator
    document.getElementById('loading').style.display = 'none';

    if (response.ok) {
        // Display AI response
        messages.innerHTML += `<div>AI: ${data.choices[0].message.content}</div>`;
    } else {
        messages.innerHTML += `<div>AI: Error communicating with OpenAI API</div>`;
    }

    // Scroll to the bottom of the messages
    messages.scrollTop = messages.scrollHeight;
};

// Add event listener to populate repository dropdown on modal open
document.addEventListener('DOMContentLoaded', () => {
    // Existing code...
    apiKeyModal.style.display = 'block';
});
