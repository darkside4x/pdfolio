// utils/mongodb.js
import { MongoClient, GridFSBucket } from 'mongodb';
import { Readable } from 'stream';

// Your MongoDB connection string from MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let client;
let clientPromise;
let bucket;

async function connectToDatabase() {
  if (client && bucket) {
    return { client, bucket };
  }

  if (!clientPromise) {
    client = new MongoClient(MONGODB_URI);
    clientPromise = client.connect();
  }

  client = await clientPromise;
  const db = client.db();
  bucket = new GridFSBucket(db, { bucketName: 'pdfs' });

  return { client, bucket };
}

// Helper function to store a buffer in GridFS
export async function storeFileInGridFS(filename, buffer) {
  const { bucket } = await connectToDatabase();
  
  // Convert buffer to readable stream
  const readableStream = new Readable();
  readableStream.push(buffer);
  readableStream.push(null);
  
  // Upload to GridFS
  const uploadStream = bucket.openUploadStream(filename, {
    contentType: 'application/pdf'
  });
  
  return new Promise((resolve, reject) => {
    readableStream
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', function() {
        resolve({
          id: this.id.toString(),
          filename: this.filename
        });
      });
  });
}

// Helper function to retrieve a file from GridFS
export async function retrieveFileFromGridFS(fileId) {
  const { bucket } = await connectToDatabase();
  return bucket.openDownloadStream(fileId);
}

export { connectToDatabase };