require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require('./routes/authRoutes')
const productRoutes = require('./routes/productRoutes')
const invoiceRoutes = require('./routes/invoiceRoutes')
const saleRoutes = require('./routes/saleRoutes')
const settingsRoutes = require('./routes/settingsRoutes')

const app = express();

// Middleware to handle CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

connectDB()

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/settings', settingsRoutes);
// app.use('/api/user', userRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))