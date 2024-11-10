const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the public directory (where your frontend files are located)
app.use(express.static('public'));

// Endpoint to validate API keys
app.post('/validate-keys', async (req, res) => {
    const { openaiKey, githubKey } = req.body;

    try {
        // Validate OpenAI API Key
        const openaiResponse = await axios.get('https://api.openai.com/v1/models', {
            headers: {
                'Authorization': `Bearer ${openaiKey}`
            }
        });

        // Validate GitHub API Key
        const githubResponse = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `token ${githubKey}`
            }
        });

        // If both keys are valid, return success
        if (openaiResponse.status === 200 && githubResponse.status === 200) {
            return res.status(200).json({ message: 'Keys are valid' });
        }
    } catch (error) {
        return res.status(400).json({ message: 'Invalid API keys' });
    }
});

// Endpoint to handle chat messages
app.post('/chat', async (req, res) => {
    const { message, repoData } = req.body;

    if (!message) {
        return res.status(400).send('Message is required');
    }

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `You are a helpful assistant for the repository ${repoData.full_name}.` },
                { role: 'user', content: message }
            ],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.message);
        const status = error.response ? error.response.status : 500;
        const message = error.response ? error.response.data : 'Error communicating with OpenAI API';
        res.status(status).send(message);
    }
});

// Endpoint to fetch user repositories
app.get('/repositories', async (req, res) => {
    const githubKey = req.headers['authorization'].split(' ')[1]; // Extract token from header

    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                'Authorization': `token ${githubKey}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching repositories:', error.message);
        res.status(500).send('Error fetching repositories');
    }
});

        // Send the response back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.message);
        res.status(500).send('Error communicating with OpenAI API');
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}/`);
});