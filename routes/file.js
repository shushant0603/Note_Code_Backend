import express from 'express';
import File from '../models/file.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Apply authentication to all routes
router.use(protect);

// Test endpoint to verify route is working
router.get('/test', (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: 'File routes are working', user: req.user._id });
});

// POST /files
router.post('/files', async (req, res) => {
    console.log("=== POST /files route hit ===");
    console.log("Request method:", req.method);
    console.log("Request path:", req.path);
    console.log("Request URL:", req.url);
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("User from token:", req.user);
    
    try {
      const { name, language, code, algo, input, output } = req.body;
      
      console.log("Extracted fields:", { name, language, code, algo, input, output });
      console.log("Field types:", { 
        name: typeof name, 
        language: typeof language, 
        code: typeof code, 
        algo: typeof algo 
      });
  
      if (!name || !language || !code) {
        console.log("Missing required fields:", { name, language, code });
        return res.status(400).json({ error: 'Required fields missing: name, language, and code are required' });
      }
  
      const newFile = new File({
        name,
        user: req.user._id, // Use authenticated user's ID
        language,
        code,
        algo: algo || '', // Allow empty string
        input: input || '',
        output: output || '',
      });
  
      console.log("Creating new file:", newFile);
      const savedFile = await newFile.save();
      console.log("File saved successfully:", savedFile);
      res.status(201).json(savedFile);
    } catch (err) {
      console.error("Error saving file:", err);
      res.status(500).json({ error: err.message });
    }
  });

// GET /files/user/:userId
router.get('/files/user/:userId', async (req, res) => {
    try {
      // Ensure user can only access their own files
      if (req.params.userId !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to access these files' });
      }
      
      const files = await File.find({ user: req.params.userId }).sort({ updatedAt: -1 });
      res.json(files);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// GET /files/:id - Get individual file by ID
router.get('/files/:id', async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ error: 'File not found' });
      
      // Ensure user can only access their own files
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to access this file' });
      }
      
      res.json(file);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// General PATCH endpoint for updating any field
router.patch('/files/:id', async (req, res) => {
    try {
      const updates = req.body;
      if (!updates || Object.keys(updates).length === 0) {
        return res.status(400).json({ error: 'No updates provided' });
      }
  
      // Ensure user can only update their own files
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ error: 'File not found' });
      
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this file' });
      }
  
      const updatedFile = await File.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      );
  
      res.json(updatedFile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// PATCH /files/:id/code
router.patch('/files/:id/code', async (req, res) => {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ error: 'Code is required' });
  
      // Ensure user can only update their own files
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ error: 'File not found' });
      
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this file' });
      }
  
      const updatedFile = await File.findByIdAndUpdate(
        req.params.id,
        { code },
        { new: true }
      );
  
      res.json(updatedFile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// PATCH /files/:id/algo
router.patch('/files/:id/algo', async (req, res) => {
    try {
      const { algo } = req.body;
      if (!algo) return res.status(400).json({ error: 'Algo is required' });
  
      // Ensure user can only update their own files
      const file = await File.findById(req.params.id);
      if (!file) return res.status(404).json({ error: 'File not found' });
      
      if (file.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to update this file' });
      }
  
      const updatedFile = await File.findByIdAndUpdate(
        req.params.id,
        { algo },
        { new: true }
      );
  
      res.json(updatedFile);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// DELETE /files/:id - Delete a file
router.delete('/files/:id', async (req, res) => {
    try {
      console.log("=== DELETE /files/:id route hit ===");
      console.log("Deleting file with ID:", req.params.id);
      console.log("User from token:", req.user._id);
      
      // Ensure user can only delete their own files
      const file = await File.findById(req.params.id);
      if (!file) {
        console.log("File not found");
        return res.status(404).json({ error: 'File not found' });
      }
      
      if (file.user.toString() !== req.user._id.toString()) {
        console.log("User not authorized to delete this file");
        return res.status(403).json({ error: 'Not authorized to delete this file' });
      }
      
      console.log("File found, deleting...");
      await File.findByIdAndDelete(req.params.id);
      console.log("File deleted successfully");
      
      res.json({ message: 'File deleted successfully' });
    } catch (err) {
      console.error("Error deleting file:", err);
      res.status(500).json({ error: err.message });
    }
  });
    
export default router; 