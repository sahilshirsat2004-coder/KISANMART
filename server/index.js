import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS for Vite client
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT']
  }
});

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'KisanMart Server & Sockets Live' });
});

// Socket.IO Room & Tracking Logic
io.on('connection', (socket) => {
  console.log(`⚡ Client connected to socket: ${socket.id}`);

  // Join dedicated room for an order
  socket.on('join_delivery_room', (orderId) => {
    socket.join(`order:${orderId}`);
  });

  // Driver broadcasts real-time GPS position
  socket.on('send_location_update', ({ orderId, lat, lng }) => {
    io.to(`order:${orderId}`).emit('receive_location_update', {
      orderId,
      lat,
      lng,
      timestamp: new Date().toLocaleTimeString()
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kisanmart';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log(' Connected to MongoDB');
    server.listen(PORT, () => console.log(`🚀 Server & Sockets running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
    server.listen(PORT, () => console.log(`⚠️ Server running (without DB) on http://localhost:${PORT}`));
  });