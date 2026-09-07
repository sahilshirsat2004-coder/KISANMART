import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from './models/User.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kisanmart';

const seedAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(' Connected to MongoDB');

    const adminEmail = 'admin@kisanmart.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists with email:', adminEmail);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Platform Administrator',
      email: adminEmail,
      phone: '9999999999',
      password: hashedPassword,
      role: 'ADMIN',
      address: {
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      }
    });

    console.log(' Admin user created successfully!');
    console.log(' Email: admin@kisanmart.com');
    console.log(' Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error.message);
    process.exit(1);
  }
};

seedAdmin();