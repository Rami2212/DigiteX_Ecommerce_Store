const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./config/passport');

// Routes
const userRoutes = require('./routes/auth.routes');


const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

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
