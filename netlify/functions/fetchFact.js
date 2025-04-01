const fetch = require('node-fetch');

// Main handler function
exports.handler = async (event) => {
    try {
        // Check if the request body exists
        if (!event.body) {
            console.log("Request body is missing.");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No query provided in the request body." })
            };
        }

        // Extract the query from the request body
        const { query } = JSON.parse(event.body);
        if (!query || query.trim() === "") {
            console.log("Received an empty query.");
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Query is empty. Please provide a valid input." })
            };
        }

        // Replace this with your real API key
        const apiKey = "AIzaSyAryFXVyFl7KdJPPfCFg1wTNzUHIEWG4LA"; // Вставьте ваш API-ключ сюда
        if (!apiKey) {
            console.error("API key is missing. Check your environment variables.");
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API key is missing. Ensure it is set in environment variables." })
            };
        }

        // Construct the URL and request body
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const requestBody = {
            contents: [{ parts: [{ text: query }] }]
        };

        // Log the request before sending
        console.log("Sending request:", requestBody);

        // Make the API request
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        // Check the response status
        if (!response.ok) {
            console.error(`API error. Status: ${response.status}`);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `API request failed with status: ${response.status}` })
            };
        }

        // Log the raw API response
        const result = await response.json();
        console.log("API response:", result);

        // Validate the API response
        if (!result || !result.contents || !Array.isArray(result.contents)) {
            console.log("Received an empty or invalid response from the API.");
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "No relevant facts found. Please try another query." })
            };
        }

        // Successful response
        console.log("Request completed successfully.");
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };

    } catch (error) {
        // Log any errors
        console.error("Execution error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
