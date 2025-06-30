const express = require('express');
const connectDB = require("./config/db");
const cors = require('cors');
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
require('./config/passport');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const addonRoutes = require('./routes/addon.routes');
const productRoutes = require('./routes/product.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const wishlistRoutes = require('./routes/wishlist.routes');
const contactRoutes = require('./routes/contact.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/assets/uploads', express.static(path.join(__dirname, 'assets/uploads')));

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
app.use('/auth', authRoutes);
app.use('/categories', categoryRoutes);
app.use('/users', userRoutes);
app.use('/addons', addonRoutes);
app.use('/products', productRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/payments', paymentRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/contact', contactRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
