import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectToDatabase } from './storage';
import router from './routes';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// connectDB();

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api', router); // Use a prefix to distinguish API routes from frontend routes

// Serve static files from the 'client/dist' directory
// This is the key step to serve your frontend
app.use(express.static(path.join(__dirname, '../client/dist')));

// A catch-all route to serve the frontend's index.html
// This is essential for client-side routing (e.g., React Router)
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


// //
// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Serve static files from React build
// app.use(express.static(path.join(__dirname, '../../client/dist')));

// // API routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/credits', require('./routes/credits'));
// app.use('/api/marketplace', require('./routes/marketplace'));
// // ... other API routes

// // Catch all handler - send React app for any non-API route
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
// //

// // Start server
// async function startServer() {
//   try {
//     console.log('🔄 Connecting to MongoDB...');
//     await connectToDatabase();
//     console.log('✅ MongoDB connected successfully');

//     app.listen(PORT, () => {
//       console.log(`✅ Server running on port ${PORT}`);
//       console.log(`📍 Local: http://localhost:${PORT}`);
//       console.log(`📍 Health: http://localhost:${PORT}/health`);
//     });
//   } catch (error) {
//     console.error('❌ Failed to start server:', error);
//     process.exit(1);
//   }
// }

// startServer();

// export default app;