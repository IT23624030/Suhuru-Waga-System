// This file sets up the backend server with Node.js and Express. It exposes an API endpoint
// React frontend will call to get crop suggestions from the Gemini API.

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
require('dotenv').config(); // Load environment variables from a .env file

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allows your frontend to make requests to this server
app.use(express.json()); // Parses incoming JSON requests

// Set up the Google Generative AI client
// Access your API key as an environment variable
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error('API key is not set. Please set the GEMINI_API_KEY environment variable.');
    process.exit(1);
}
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// API endpoint to get crop suggestions
app.post('/api/suggest-crop', async (req, res) => {
    try {
        const { soilType, climate, rainfall, temperature, farmingGoal } = req.body;

        if (!soilType || !climate || !rainfall || !temperature || !farmingGoal) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Create a detailed prompt for the AI
        const prompt = `
        You are an expert agricultural advisor. Based on the following conditions, provide a list of 3 to 5 crops that would be most suitable to grow in Sri Lanka. For each crop, explain why it is a good choice for these conditions in a single, concise paragraph. The conditions are:
        - Soil Type: ${soilType}
        - Climate: ${climate}
        - Rainfall (mm/year): ${rainfall}
        - Temperature (degrees Celsius): ${temperature}
        - Farming Goal: ${farmingGoal}

        Provide the response in a structured markdown format with bolded crop names.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ suggestion: text });

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        res.status(500).json({ error: 'Failed to get crop suggestion from the AI.' });
    }
});

// Serve the static React build files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});