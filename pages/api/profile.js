// pages/api/profile.js
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store'); // Disable caching

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  // Expecting the header to be in the format "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    // Convert userId to ObjectId before querying
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.userId) });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user data (excluding password)
    return res.status(200).json({
      username: user.username,
      fullName: user.fullName,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}