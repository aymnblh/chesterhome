require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize Firebase before routes
require('./firebase');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const wilayaRoutes = require('./routes/wilayas');
const orderRoutes = require('./routes/orders');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://chesterhome-1d94e.web.app',
  'https://chesterhome-1d94e.firebaseapp.com',
  'https://chesterhome.dz'
];

app.use(cors({ 
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}
app.use('/uploads', express.static(uploadsDir));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/wilayas', wilayaRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
