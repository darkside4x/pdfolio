// pages/api/login.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import clientPromise from '../../lib/mongodb';
import { rateLimit } from '../../lib/rate-limit'; // You'll need to create this file

// Create a rate limiter
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  max: 5 // 5 attempts per minute
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Apply rate limiting based on IP
  try {
    await limiter.check(res, 10, req.socket.remoteAddress);
  } catch {
    return res.status(429).json({ message: 'Too many requests, please try again later.' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Missing username or password' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Find user by username
    const user = await usersCollection.findOne({ username });
    if (!user) {
      // Use a consistent error message for security
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Use a consistent error message for security
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Record login attempt
    await usersCollection.updateOne(
      { _id: user._id },
      { 
        $set: { lastLogin: new Date() },
        $inc: { loginCount: 1 }
      }
    );

    // Generate a JWT token with more data and a refresh token
    const token = jwt.sign(
      { 
        userId: user._id.toString(),
        username: user.username,
        fullName: user.fullName
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    const refreshToken = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET + user.password.substring(0, 10), // Mix in part of hashed password as added security
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie with the refresh token
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure' : ''}`);

    return res.status(200).json({ 
      token,
      user: {
        username: user.username,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}