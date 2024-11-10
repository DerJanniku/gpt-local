document.addEventListener('DOMContentLoaded', () => {
    const apiKeyModal = document.getElementById('apiKeyModal');
    const closeModal = document.getElementById('closeModal');
    const checkKeysBtn = document.getElementById('checkKeysBtn');
    const modalMessage = document.getElementById('modalMessage');

    // Function to check if API keys are valid
    async function validateApiKeys(openaiKey, githubKey) {
        try {
            // Validate OpenAI API Key
            const openaiResponse = await fetch('https://api.openai.com/v1/models', {
                headers: {
                    'Authorization': `Bearer ${openaiKey}`
                }
            });

            if (!openaiResponse.ok) throw new Error('Invalid OpenAI API Key');

            // Validate GitHub API Key (example endpoint)
            const githubResponse = await fetch('https://api.github.com/user', {
                headers: {
                    'Authorization': `token ${githubKey}`
                }
            });

            if (!githubResponse.ok) throw new Error('Invalid GitHub API Key');

            // If both keys are valid, close the modal
            apiKeyModal.style.display = 'none';
            localStorage.setItem('OPENAI_API_KEY', openaiKey);
            localStorage.setItem('GITHUB_API_KEY', githubKey);
        } catch (error) {
            modalMessage.textContent = error.message;
        }
    }

    // Check for stored API keys on page load
    const storedOpenaiKey = localStorage.getItem('OPENAI_API_KEY');
    const storedGithubKey = localStorage.getItem('GITHUB_API_KEY');

    if (!storedOpenaiKey || !storedGithubKey) {
        apiKeyModal.style.display = 'block'; // Show modal if keys are missing
    }

    // Event listeners
    closeModal.onclick = () => {
        apiKeyModal.style.display = 'none';
    };

    checkKeysBtn.onclick = () => {
        const openaiKey = document.getElementById('openaiKey').value;
        const githubKey = document.getElementById('githubKey').value;
        validateApiKeys(openaiKey, githubKey);
    };

    // Close modal if user clicks outside of it
    window.onclick = (event) => {
        if (event.target === apiKeyModal) {
            apiKeyModal.style.display = 'none';
        }
    };
});