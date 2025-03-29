const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());

const FLASK_API_URL = 'http://127.0.0.1:5000/predict'; // Flask API URL

// Debugging Middleware
app.use((req, res, next) => {
    console.log("Received Body:", JSON.stringify(req.body));
    next();
});

// API Endpoint for Prediction
app.post('/', async (req, res) => {
    try {
        if (!req.body || !req.body.sensorData) {
            console.error("Invalid request: Missing sensorData object");
            return res.status(400).json({ error: "Missing sensorData object" });
        }

        const { flex1, flex2, flex3, flex4 } = req.body.sensorData;

        // Convert sensor data to match the Flask API input
        const flaskData = {
            Thumb: flex1,
            Index: flex2,
            Middle: flex3,
            Ring: flex4,
            Little: 0 // Assuming a default value for Little (modify if needed)
        };

        try {
            // Send data to Flask API for prediction
            const response = await axios.post(FLASK_API_URL, flaskData, {
                headers: { 'Content-Type': 'application/json' }
            });

            console.log('Flask Prediction:', response.data);

            // Return the Flask API response to the ESP32
            res.json({ gesture: response.data.gesture });
        } catch (flaskError) {
            console.error("Error communicating with Flask API:", flaskError.message);
            res.status(500).json({ error: "Failed to get prediction from Flask API" });
        }

    } catch (error) {
        console.error("Server Error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Start the Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
