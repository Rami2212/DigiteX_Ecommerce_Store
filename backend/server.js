const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require('dotenv').config();

// Routes
const userRoutes = require('./routes/user.routes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Hello from backend!');
});
app.use('/api/users', userRoutes);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
