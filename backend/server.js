const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const archiver = require('archiver');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Setup multer for file uploads
const upload = multer({
  dest: path.join(__dirname, 'uploads'),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB limit
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Encryption utility functions
const encryptFile = (inputPath, outputPath, password) => {
  return new Promise((resolve, reject) => {
    try {
      const algorithm = 'aes-256-cbc';
      const salt = crypto.randomBytes(16);
      const iv = crypto.randomBytes(16);
      
      // Derive key from password
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
      
      const cipher = crypto.createCipheriv(algorithm, key, iv);
      const input = fs.createReadStream(inputPath);
      const output = fs.createWriteStream(outputPath);
      
      // Write salt and IV at the beginning of the file
      output.write(salt);
      output.write(iv);
      
      input.pipe(cipher).pipe(output);
      
      output.on('finish', () => resolve());
      output.on('error', reject);
      input.on('error', reject);
      cipher.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
};

// Decryption utility functions
const decryptFile = (inputPath, outputPath, password) => {
  return new Promise((resolve, reject) => {
    try {
      const algorithm = 'aes-256-cbc';
      
      // Read encrypted file
      const encryptedData = fs.readFileSync(inputPath);
      
      // Extract salt and IV from the beginning of the file
      const salt = encryptedData.slice(0, 16);
      const iv = encryptedData.slice(16, 32);
      const encrypted = encryptedData.slice(32);
      
      // Derive key using the same salt
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
      
      // Decrypt
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      // Write decrypted output
      fs.writeFileSync(outputPath, decrypted);
      resolve();
    } catch (error) {
      reject(new Error('Decryption failed. Password might be incorrect.'));
    }
  });
};

// Encryption endpoint - Encrypts entire ZIP file with AES-256
app.post('/api/encrypt', upload.array('files'), async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const files = req.files;

    // Validate inputs
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    if (!password || !confirmPassword) {
      return res.status(400).json({ error: 'Password required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Create temporary directory
    const tempDir = path.join(__dirname, 'temp', Date.now().toString());
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create downloads directory if it doesn't exist
    const downloadsDir = path.join(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // Step 1: Create a ZIP file with all uploaded files
    const zipFilename = `files_${Date.now()}.zip`;
    const zipPath = path.join(tempDir, zipFilename);
    
    const zipOutput = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
      zipOutput.on('close', async () => {
        try {
          // Step 2: Encrypt the ZIP file
          const encryptedFilename = `${zipFilename}.enc`;
          const encryptedPath = path.join(downloadsDir, encryptedFilename);
          
          await encryptFile(zipPath, encryptedPath, password);
          
          // Cleanup temp files and uploaded files
          fs.rmSync(tempDir, { recursive: true });
          files.forEach(file => {
            if (fs.existsSync(file.path)) {
              fs.unlinkSync(file.path);
            }
          });
          
          // Send the encrypted ZIP file
          res.download(encryptedPath, encryptedFilename, (err) => {
            if (err) {
              console.error('Download error:', err);
            }
            // Delete encrypted file after sending
            setTimeout(() => {
              if (fs.existsSync(encryptedPath)) {
                fs.unlinkSync(encryptedPath);
              }
            }, 5000);
          });
          resolve();
        } catch (error) {
          reject(error);
        }
      });

      zipOutput.on('error', (err) => {
        fs.rmSync(tempDir, { recursive: true });
        reject(err);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(zipOutput);
      
      // Add all uploaded files to the archive
      files.forEach(file => {
        archive.file(file.path, { name: file.originalname });
      });

      archive.finalize();
    });
  } catch (error) {
    console.error('Encryption error:', error);
    
    // Cleanup uploaded files
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    res.status(500).json({ error: 'Encryption failed: ' + error.message });
  }
});

// Decryption endpoint
app.post('/api/decrypt', upload.single('file'), async (req, res) => {
  try {
    const { password } = req.body;
    const file = req.file;

    // Validate inputs
    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password required' });
    }

    // Create temporary directory
    const tempDir = path.join(__dirname, 'temp', Date.now().toString());
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    try {
      // Decrypt the file
      const decryptedZipPath = path.join(tempDir, 'decrypted.zip');
      await decryptFile(file.path, decryptedZipPath, password);

      const encryptedBaseName = path.basename(file.originalname, path.extname(file.originalname));
      const decryptedDownloadName = encryptedBaseName.endsWith('.zip')
        ? `decrypted_${encryptedBaseName}`
        : `decrypted_${encryptedBaseName}.zip`;
      
      // Cleanup uploaded file
      fs.unlinkSync(file.path);
      
      // Send the decrypted ZIP file
      res.download(decryptedZipPath, decryptedDownloadName, (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Delete temp files after sending
        setTimeout(() => {
          if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true });
          }
        }, 5000);
      });
    } catch (error) {
      // Cleanup temp files
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true });
      }
      
      res.status(400).json({ error: error.message });
    }
  } catch (error) {
    console.error('Decryption error:', error);
    
    // Cleanup uploaded file
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ error: 'Decryption failed: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
