<template>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>File Encryption & Decryption</h1>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'encrypt' }"
          @click="activeTab = 'encrypt'"
        >
          🔒 Encrypt
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'decrypt' }"
          @click="activeTab = 'decrypt'"
        >
          🔓 Decrypt
        </button>
      </div>

      <!-- ENCRYPTION TAB -->
      <div v-show="activeTab === 'encrypt'" class="tab-content">
        <form @submit.prevent="handleEncrypt" class="form">
        <!-- File Upload Section -->
        <div class="form-group">
          <label for="file-input" class="file-label">
            <div class="file-upload-area" :class="{ 'drag-over': isDragOver }">
              <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p class="upload-text">{{ selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : 'Click or drag files here' }}</p>
              <p class="upload-hint">Upload single or multiple files</p>
            </div>
            <input
              id="file-input"
              type="file"
              multiple
              ref="fileInput"
              @change="handleFileSelect"
              @dragover.prevent="isDragOver = true"
              @dragleave.prevent="isDragOver = false"
              @drop.prevent="handleFileDrop"
              style="display: none"
            />
          </label>
        </div>

        <!-- Selected Files List -->
        <div v-if="selectedFiles.length > 0" class="files-list">
          <h3>Selected Files:</h3>
          <ul>
            <li v-for="(file, index) in selectedFiles" :key="index" class="file-item">
              <span class="file-icon">📄</span>
              <span class="file-name">{{ file.name }}</span>
              <span class="file-size">({{ formatFileSize(file.size) }})</span>
              <button type="button" @click="removeFile(index)" class="remove-btn">✕</button>
            </li>
          </ul>
        </div>

        <!-- Password Section -->
        <div class="password-section">
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password (min 6 characters)"
                required
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="toggle-password"
              >
                {{ showPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password">Confirm Password</label>
            <div class="password-input-wrapper">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="toggle-password"
              >
                {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
              </button>
            </div>
          </div>

          <div v-if="passwordError" class="error-message">
            {{ passwordError }}
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="selectedFiles.length === 0 || isLoading"
          class="submit-btn"
        >
          <span v-if="!isLoading">🔒 Encrypt & Download</span>
          <span v-else>
            <span class="spinner"></span>
            Encrypting...
          </span>
        </button>
      </form>
      </div>

      <!-- DECRYPTION TAB -->
      <div v-show="activeTab === 'decrypt'" class="tab-content">
        <form @submit.prevent="handleDecrypt" class="form">
          <!-- Encrypted File Upload Section -->
          <div class="form-group">
            <label for="encrypted-file-input" class="file-label">
              <div class="file-upload-area" :class="{ 'drag-over': isDecryptDragOver }">
                <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p class="upload-text">{{ decryptFile ? decryptFile.name : 'Click or drag encrypted file here' }}</p>
                <p class="upload-hint">Upload encrypted .zip.enc file</p>
              </div>
              <input
                id="encrypted-file-input"
                type="file"
                ref="encryptedFileInput"
                @change="handleEncryptedFileSelect"
                @dragover.prevent="isDecryptDragOver = true"
                @dragleave.prevent="isDecryptDragOver = false"
                @drop.prevent="handleEncryptedFileDrop"
                style="display: none"
              />
            </label>
          </div>

          <!-- Decryption Password Section -->
          <div class="password-section">
            <div class="form-group">
              <label for="decrypt-password">Password</label>
              <div class="password-input-wrapper">
                <input
                  id="decrypt-password"
                  v-model="decryptPassword"
                  :type="showDecryptPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  @click="showDecryptPassword = !showDecryptPassword"
                  class="toggle-password"
                >
                  {{ showDecryptPassword ? '👁️' : '👁️‍🗨️' }}
                </button>
              </div>
            </div>

            <div v-if="decryptPasswordError" class="error-message">
              {{ decryptPasswordError }}
            </div>
          </div>

          <!-- Decrypt Button -->
          <button
            type="submit"
            :disabled="!decryptFile || isDecryptLoading"
            class="submit-btn"
          >
            <span v-if="!isDecryptLoading">🔓 Decrypt & Download</span>
            <span v-else>
              <span class="spinner"></span>
              Decrypting...
            </span>
          </button>
        </form>
      </div>

      <!-- Status Messages -->
      <div v-if="successMessage" class="success-message">
        ☮️ {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="error-message">
        ☠️ {{ errorMessage }}
      </div>

      <!-- Info Section -->
      <div class="info-section">
        <h4>Security Info:</h4>
        <ul>
          <li>simple AES-256 encryption</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

// Tab management
const activeTab = ref('encrypt')

// Encryption variables
const selectedFiles = ref([])
const fileInput = ref(null)
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isDragOver = ref(false)
const isLoading = ref(false)
const passwordError = ref('')

// Decryption variables
const decryptFile = ref(null)
const encryptedFileInput = ref(null)
const decryptPassword = ref('')
const showDecryptPassword = ref(false)
const isDecryptDragOver = ref(false)
const isDecryptLoading = ref(false)
const decryptPasswordError = ref('')

// Status messages
const successMessage = ref('')
const errorMessage = ref('')

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes, k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// Encryption functions
const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files
}

const handleFileDrop = (event) => {
  isDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  selectedFiles.value = files
}

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const validatePasswords = () => {
  passwordError.value = ''
  
  if (!password.value || !confirmPassword.value) {
    passwordError.value = 'Both password fields are required'
    return false
  }
  
  if (password.value.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }
  
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Passwords do not match'
    return false
  }
  
  return true
}

const handleEncrypt = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  
  if (!validatePasswords()) {
    return
  }

  if (selectedFiles.value.length === 0) {
    errorMessage.value = 'Please select at least one file'
    return
  }

  try {
    isLoading.value = true
    const formData = new FormData()
    
    selectedFiles.value.forEach(file => {
      formData.append('files', file)
    })
    
    formData.append('password', password.value)
    formData.append('confirmPassword', confirmPassword.value)

    const response = await axios.post('/api/encrypt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'encrypted_files.zip.enc')
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

    successMessage.value = 'Files encrypted successfully! Download started.'
    selectedFiles.value = []
    password.value = ''
    confirmPassword.value = ''
    passwordError.value = ''
    if (fileInput.value) {
      fileInput.value.value = ''
    }

  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.response?.data?.error || 'Encryption failed. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Decryption functions
const handleEncryptedFileSelect = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 0) {
    decryptFile.value = files[0]
  }
}

const handleEncryptedFileDrop = (event) => {
  isDecryptDragOver.value = false
  const files = Array.from(event.dataTransfer.files)
  if (files.length > 0) {
    decryptFile.value = files[0]
  }
}

const getDecryptedDownloadName = (fileName) => {
  const baseName = fileName.endsWith('.enc') ? fileName.slice(0, -4) : fileName
  return baseName.endsWith('.zip') ? `decrypted_${baseName}` : `decrypted_${baseName}.zip`
}

const handleDecrypt = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  decryptPasswordError.value = ''
  
  if (!decryptPassword.value) {
    decryptPasswordError.value = 'Password is required'
    return
  }

  if (!decryptFile.value) {
    errorMessage.value = 'Please select an encrypted file'
    return
  }

  try {
    isDecryptLoading.value = true
    const formData = new FormData()
    formData.append('file', decryptFile.value)
    formData.append('password', decryptPassword.value)

    const response = await axios.post('/api/decrypt', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', getDecryptedDownloadName(decryptFile.value.name))
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

    successMessage.value = 'File decrypted successfully! Download started.'
    decryptFile.value = null
    decryptPassword.value = ''
    decryptPasswordError.value = ''
    if (encryptedFileInput.value) {
      encryptedFileInput.value.value = ''
    }

  } catch (error) {
    console.error('Error:', error)
    errorMessage.value = error.response?.data?.error || 'Decryption failed. Wrong password or corrupted file.'
  } finally {
    isDecryptLoading.value = false
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  max-width: 600px;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  padding: 40px;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: #333;
  margin-bottom: 8px;
}

.header p {
  color: #666;
  font-size: 14px;
}

.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  border-bottom: 2px solid #eee;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: none;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 15px;
  font-weight: 600;
  color: #999;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  color: #667eea;
}

.tab-btn.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.file-label {
  cursor: pointer;
}

.file-upload-area {
  border: 2px dashed #ddd;
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.3s ease;
  background: #fafafa;
}

.file-upload-area:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.file-upload-area.drag-over {
  border-color: #667eea;
  background: #f0f4ff;
  transform: scale(1.02);
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: #667eea;
  margin-bottom: 12px;
}

.upload-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.files-list {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 16px;
  margin-top: 10px;
}

.files-list h3 {
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
}

.files-list ul {
  list-style: none;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 13px;
  border-left: 3px solid #667eea;
}

.file-icon {
  font-size: 16px;
}

.file-name {
  flex: 1;
  color: #333;
  font-weight: 500;
  word-break: break-all;
}

.file-size {
  color: #999;
  font-size: 12px;
}

.remove-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  transition: color 0.2s;
}

.remove-btn:hover {
  color: #ff6b6b;
}

.password-section {
  margin-top: 10px;
}

.password-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 12px;
  padding-right: 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  color: #999;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #667eea;
}

.error-message {
  color: #ff6b6b;
  font-size: 13px;
  padding: 10px;
  background: #ffe0e0;
  border-radius: 6px;
  border-left: 3px solid #ff6b6b;
}

.success-message {
  color: #51cf66;
  font-size: 13px;
  padding: 10px;
  background: #e6ffed;
  border-radius: 6px;
  border-left: 3px solid #51cf66;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.submit-btn {
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.info-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.info-section h4 {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
  font-weight: 600;
}

.info-section ul {
  list-style: none;
  font-size: 12px;
  color: #999;
}

.info-section li {
  padding: 4px 0;
  padding-left: 20px;
  position: relative;
}

.info-section li:before {
  content: "✓";
  position: absolute;
  left: 0;
  color: #667eea;
  font-weight: bold;
}

@media (max-width: 600px) {
  .card {
    padding: 24px;
  }

  .header h1 {
    font-size: 24px;
  }

  .file-upload-area {
    padding: 30px 15px;
  }
}
</style>
