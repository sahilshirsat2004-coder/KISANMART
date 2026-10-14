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

// Allow local frontend, production domain, or mobile apps via CORS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL // Live Vercel/Netlify URL when deployed
].filter(Boolean);

// Initialize Socket.IO with permissive CORS for web & mobile
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or Capacitor)
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for quick deployment
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH']
  }
});

// Make `io` accessible inside route controllers via req.app.get('io')
app.set('io', io);

// Global Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Health check endpoint for Render / monitoring
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'KisanMart Server & Sockets Live' });
});

// Socket.IO Room & Real-Time Tracking Logic
io.on('connection', (socket) => {
  console.log(`⚡ Client connected to socket: ${socket.id}`);

  // Join dedicated tracking room for an order
  socket.on('join_delivery_room', (orderId) => {
    socket.join(`order:${orderId}`);
    socket.join(`order_${orderId}`);
    console.log(`Socket ${socket.id} joined tracking room for order ${orderId}`);
  });

  // Driver broadcasts real-time GPS position
  socket.on('send_location_update', ({ orderId, lat, lng }) => {
    const payload = {
      orderId,
      lat,
      lng,
      timestamp: new Date().toLocaleTimeString()
    };
    
    // Broadcast to both room naming patterns
    io.to(`order:${orderId}`).emit('receive_location_update', payload);
    io.to(`order_${orderId}`).emit('receive_location_update', payload);
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
    server.listen(PORT, () => console.log(`🚀 Server & Sockets running on port ${PORT}`));
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
    server.listen(PORT, () => console.log(`⚠️ Server running (without DB) on port ${PORT}`));
  });