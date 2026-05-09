# File Encryption Application

Vue 3 frontend with Node.js backend for encrypting and decrypting files with password protection using AES-256 encryption.

## Features

**Frontend:**
- Drag-and-drop file upload
- Real-time password validation
- Single or multiple file support
- Tab-based encryption and decryption interface

**Backend:**
- AES-256-CBC encryption and decryption for .zip of file(s) uploaded 

## Quick Start

- [Windows Installation](#windows)
- [Mac/Linux Installation](#maclinux)
- [Manual Setup](#if-above-fails-manual-setup)

## Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)

## Windows

### Setup

```bash
.\setup.bat
```

This automatically installs all dependencies for backend, frontend, and root.

### Running the Application

From the root directory:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`  
Open browser to: `http://localhost:5173`

## Mac/Linux

### Setup

```bash
chmod +x setup.sh
./setup.sh
```

This automatically installs all dependencies for backend, frontend, and root.

### Running the Application

From the root directory:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:5173`  
Open browser to: `http://localhost:5173`

## If Above Fails: Manual Setup

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

Then start the application:

```bash
npm run dev
```

Or start servers separately:

**Backend:**
```bash
npm run backend
```

**Frontend:**
```bash
npm run frontend
```

## Usage

**Encrypt Files:**
1. Go to Encrypt tab
2. Upload files (drag-and-drop or click)
3. Enter password (minimum 6 characters)
4. Confirm password
5. Click "Encrypt & Download"

**Decrypt Files:**
1. Go to Decrypt tab
2. Upload encrypted .zip.enc file
3. Enter password
4. Click "Decrypt & Download"

## Security

- uses simple AES-256-CBC encryption for system simplicity since its compatible basically in all forums, and easy to use

## Configuration

**Backend file size limit** (default 500MB, hopefully you guys won't need this much😅):

Edit `backend/server.js` line 18:
```javascript
limits: { fileSize: 500 * 1024 * 1024 }
```

**Backend port** (default 5000):

Edit `backend/server.js` line 11:
```javascript
const PORT = 5000;
```

## API Endpoints

**POST /api/encrypt**
- Accepts: multipart/form-data with files, password, confirmPassword
- Returns: Encrypted .zip.enc file

**POST /api/decrypt**
- Accepts: multipart/form-data with encrypted file and password
- Returns: Decrypted .zip file

**GET /api/health**
- Returns: Server status

## Troubleshooting

**Port already in use:**
- Backend (5000): Close other applications or change PORT in server.js
- Frontend (5173): Vite will use next available port

**Dependencies not installing:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**CORS errors:**
Ensure backend is running at `http://localhost:5000`

## Production Build

Build frontend:
```bash
cd frontend
npm run build
```

Output: `frontend/dist` folder

Preview build:
```bash
npm run preview
```

## File Structure

```
Password-Encryption-For-files/
├── frontend/               # Vue 3 application
│   ├── src/App.vue        # Main component
│   ├── main.js            # Entry point
│   ├── index.html         # HTML template
│   └── package.json
├── backend/               # Express server
│   ├── server.js          # Main file
│   ├── uploads/           # Temp file storage
│   └── package.json
└── README.md
```

## Author

[Rift Labs](https://github.com/Rift-Labs-Council)

## Sources

- [Encrypt and Decrypt Files in Node.js - AES-256-CBC](https://mohammedshamseerpv.medium.com/encrypt-and-decrypt-files-in-node-js-a-step-by-step-guide-using-aes-256-cbc-c25b3ef687c3)
- [Encryption-Decryption: AES-256 Encryption in JavaScript](https://mojoauth.com/encryption-decryption/aes-256-encryption--javascript-in-browser)
- [Create AES-256 Encryption in JavaScript](https://stackoverflow.com/questions/44234137/how-to-create-aes-256-encryption-in-javascript)

## License

MIT

---

**Important**: Store passwords securely. Lost passwords cannot be recovered.
