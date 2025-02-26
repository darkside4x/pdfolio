// pages/api/update-profile.js
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const client = await clientPromise;
    const db = client.db();
    const usersCollection = db.collection('users');

    const { fullName, apiKey } = req.body;
    // Update the user's fullName and apiKey if provided (apiKey can be optional)
    const updateData = { fullName };
    if (apiKey) updateData.apiKey = apiKey;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(decoded.userId) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({ message: 'No changes made.' });
    }

    return res.status(200).json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
}
