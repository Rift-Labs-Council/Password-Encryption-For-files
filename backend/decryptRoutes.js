const express = require('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { decryptFile } = require('./decrypt');

const router = express.Router();

// Setup multer for file uploads
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 500 * 1024 * 1024 }
});

/**
 * POST /api/decrypt
 * Decrypts an encrypted file
 */
router.post('/decrypt', upload.single('file'), async (req, res) => {
  try {
    const { password } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Get original filename from the encrypted file
    const originalFileName = file.originalname.replace('.enc', '') || 'decrypted_file';
    const decryptedPath = path.join(__dirname, 'temp', `${Date.now()}_${originalFileName}`);

    // Create temp directory if it doesn't exist
    const tempDir = path.dirname(decryptedPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Decrypt the file
    await decryptFile(file.path, decryptedPath, password);

    // Send the decrypted file
    res.download(decryptedPath, originalFileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Cleanup files
      setTimeout(() => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        if (fs.existsSync(decryptedPath)) {
          fs.unlinkSync(decryptedPath);
        }
      }, 5000);
    });
  } catch (error) {
    console.error('Decryption error:', error);

    // Cleanup uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: error.message || 'Decryption failed' });
  }
});

module.exports = router;
