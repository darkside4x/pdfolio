"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.storeFileInGridFS = storeFileInGridFS;
exports.retrieveFileFromGridFS = retrieveFileFromGridFS;
exports.connectToDatabase = connectToDatabase;

var _mongodb = require("mongodb");

var _stream = require("stream");

// utils/mongodb.js
// Your MongoDB connection string from MongoDB Atlas
var MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

var client;
var clientPromise;
var bucket;

function connectToDatabase() {
  var db;
  return regeneratorRuntime.async(function connectToDatabase$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!(client && bucket)) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", {
            client: client,
            bucket: bucket
          });

        case 2:
          if (!clientPromise) {
            client = new _mongodb.MongoClient(MONGODB_URI);
            clientPromise = client.connect();
          }

          _context.next = 5;
          return regeneratorRuntime.awrap(clientPromise);

        case 5:
          client = _context.sent;
          db = client.db();
          bucket = new _mongodb.GridFSBucket(db, {
            bucketName: 'pdfs'
          });
          return _context.abrupt("return", {
            client: client,
            bucket: bucket
          });

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
} // Helper function to store a buffer in GridFS


function storeFileInGridFS(filename, buffer) {
  var _ref, bucket, readableStream, uploadStream;

  return regeneratorRuntime.async(function storeFileInGridFS$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(connectToDatabase());

        case 2:
          _ref = _context2.sent;
          bucket = _ref.bucket;
          // Convert buffer to readable stream
          readableStream = new _stream.Readable();
          readableStream.push(buffer);
          readableStream.push(null); // Upload to GridFS

          uploadStream = bucket.openUploadStream(filename, {
            contentType: 'application/pdf'
          });
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            readableStream.pipe(uploadStream).on('error', reject).on('finish', function () {
              resolve({
                id: this.id.toString(),
                filename: this.filename
              });
            });
          }));

        case 9:
        case "end":
          return _context2.stop();
      }
    }
  });
} // Helper function to retrieve a file from GridFS


function retrieveFileFromGridFS(fileId) {
  var _ref2, bucket;

  return regeneratorRuntime.async(function retrieveFileFromGridFS$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(connectToDatabase());

        case 2:
          _ref2 = _context3.sent;
          bucket = _ref2.bucket;
          return _context3.abrupt("return", bucket.openDownloadStream(fileId));

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
}