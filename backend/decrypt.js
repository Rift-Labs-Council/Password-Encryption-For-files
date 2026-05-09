const crypto = require('crypto');
const fs = require('fs');

/**
 * Decrypt a file that was encrypted with the encryption backend
 * @param {string} encryptedFilePath - Path to the encrypted file
 * @param {string} outputPath - Where to save the decrypted file
 * @param {string} password - The password used for encryption
 * @returns {Promise<void>}
 */
const decryptFile = (encryptedFilePath, outputPath, password) => {
  return new Promise((resolve, reject) => {
    try {
      const algorithm = 'aes-256-cbc';
      
      // Read the encrypted file
      const encryptedData = fs.readFileSync(encryptedFilePath);
      
      // Extract salt and IV from the beginning of the file
      const salt = encryptedData.slice(0, 16);
      const iv = encryptedData.slice(16, 32);
      const encrypted = encryptedData.slice(32);
      
      // Derive the same key using the same salt
      const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
      
      // Create decipher
      const decipher = crypto.createDecipheriv(algorithm, key, iv);
      
      // Decrypt the file
      const input = fs.createReadStream(encryptedFilePath);
      const output = fs.createWriteStream(outputPath);
      
      // Skip the salt and IV in the input stream
      input.on('data', (chunk) => {
        // We need to handle this differently since we've already read the file
      });
      
      // Use a simpler approach with buffer
      try {
        let decrypted = decipher.update(encrypted);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        fs.writeFileSync(outputPath, decrypted);
        resolve();
      } catch (err) {
        reject(new Error('Decryption failed. Password might be incorrect.'));
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { decryptFile };
