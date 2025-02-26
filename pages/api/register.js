// pages/api/register.js
import bcrypt from 'bcrypt';
import clientPromise from '../../lib/mongodb';
import { rateLimit } from '../../lib/rate-limit'; // You'll need to create this file

// Create a rate limiter - stricter for registration
const limiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  max: 3 // 3 registrations per hour per IP
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Apply rate limiting
  try {
    await limiter.check(res, 3, req.socket.remoteAddress);
  } catch {
    return res.status(429).json({ message: 'Too many registration attempts, please try again later.' });
  }

  const { username, password, fullName } = req.body;

  // Basic validation
  if (!username || !password || !fullName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Enhanced validation
  if (username.length < 4) {
    return res.status(400).json({ message: 'Username must be at least 4 characters' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' });
  }

  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
    return res.status(400).json({ 
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' 
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ 
      $or: [
        { username: username },
        { username: username.toLowerCase() } // Check case-insensitive
      ]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password with a stronger work factor
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert the new user with additional fields
    const result = await usersCollection.insertOne({
      username,
      password: hashedPassword,
      fullName,
      email: req.body.email || null,
      createdAt: new Date(),
      lastLogin: null,
      loginCount: 0,
      settings: {
        theme: 'light',
        notifications: true
      }
    });

    if (!result.insertedId) {
      throw new Error('Failed to create user');
    }

    return res.status(201).json({ 
      message: 'User created successfully',
      success: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error', details: error.message });
  }
}