const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No query provided in the request body." })
            };
        }

        const { query } = JSON.parse(event.body);

        if (!query || query.trim() === "") {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Query is empty. Please provide a valid input." })
            };
        }

        const apiKey = "AIzaSyAryFXVyFl7KdJPPfCFg1wTNzUHIEWG4LA";
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${AIzaSyAryFXVyFl7KdJPPfCFg1wTNzUHIEWG4LA}`;

        const requestBody = {
            contents: [{
                parts: [{ text: query }]
            }]
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `API request failed with status: ${response.status}` })
            };
        }

        const result = await response.json();

        if (!result || !Array.isArray(result.contents) || result.contents.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "No relevant facts found. Please try another query." })
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
