const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
const dotenv = require('dotenv');



dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');
const bookingRoutes = require('./routes/booking');


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/booking', bookingRoutes);


// connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventora')
.then(() => { console.log('MongoDB connected'); })
.catch((err) => { console.error('MongoDB connection error:', err); });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
