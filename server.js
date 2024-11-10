const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from the public directory (where your frontend files are located)
app.use(express.static('public'));

// Endpoint to handle chat messages
app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Check if the message is empty
    if (!userMessage) {
        return res.status(400).send('Message is required');
    }

    try {
        // Make a request to the OpenAI API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: userMessage }],
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use your OpenAI API key
                'Content-Type': 'application/json',
            },
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
    console.log(`Server is running on http://192.168.178.142:${PORT}/`);
});