const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/', async (req, res) => {
    try {
        const { flex1, flex2, flex3, flex4 } = req.body;
        if ([flex1, flex2, flex3, flex4].some(value => value === undefined)) {
            return res.status(400).json({ error: "Missing flex sensor data" });
        }

        // Forward to Flask API
        const flaskURL = 'http://localhost:5001/predict';  // Update with your Flask API URL
        const response = await axios.post(flaskURL, { flex1, flex2, flex3, flex4 });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Server Error", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
