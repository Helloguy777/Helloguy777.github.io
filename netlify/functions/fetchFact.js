const fetch = require('node-fetch'); 

exports.handler = async (event) => {
    
    if (!event.body) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No query provided in the request body." })
        };
    }

    const { query } = JSON.parse(event.body); 
    const apiKey = "AIzaSyC3bOwKivcJoKWX-3Fn0AMsIHUz9cMt3J0"; 
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const requestBody = {
        contents: [{
            parts: [{ text: query }]
        }]
    };

    try {
        
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
