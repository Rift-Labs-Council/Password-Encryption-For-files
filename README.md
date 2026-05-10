# File Encryption Application

Vue 3 frontend with a Node.js backend for password-protected file encryption and decryption.

## Features

**Frontend:**

- Drag-and-drop upload
- Encrypt and decrypt tabs
- Single or multiple file upload
- Basic password validation

**Backend:**

- Zips uploaded files before encryption
- AES-256-CBC encryption and decryption
- Temporary file cleanup after downloads

## Quick Start

- [Windows Installation](#windows)
- [Mac/Linux Installation](#maclinux)
- [Manual Setup](#if-above-fails-manual-setup)

## Prerequisites

- Node.js 14 or newer
- npm

## Windows

### Setup

```bash
.\setup.bat
```

### Running the Application

```bash
npm run dev
```

Open: `http://localhost:5173`

## Mac/Linux

### Setup

```bash
chmod +x setup.sh
./setup.sh
```

### Running the Application

```bash
npm run dev
```

Open: `http://localhost:5173`

## If Above Fails: Manual Setup

```bash
npm install
cd backend; npm install
cd ..
cd frontend; npm install
cd ..
```

Then run:

```bash
npm run dev
```

You can also start them separately with `npm run backend` and `npm run frontend`.

## Usage

**Encrypt:** Open Encrypt, add one or more files, enter and confirm a password, then click Encrypt & Download.

**Decrypt:** Open Decrypt, upload the `.enc` file, enter the password, then click Decrypt & Download.

## Security

- Uses AES-256-CBC with a PBKDF2-derived key
- Encrypts the uploaded files as a zip archive

## Configuration

**Backend port:** `backend/server.js` uses port `5000`.

**Upload limit:** `backend/server.js` allows files up to `500MB`.

## API Endpoints

- `POST /api/encrypt` - accepts `files`, `password`, and `confirmPassword`, returns `.zip.enc`
- `POST /api/decrypt` - accepts `file` and `password`, returns the decrypted zip
- `GET /api/health` - health check

## Troubleshooting

- If the port is busy, change the backend port in `backend/server.js`.
- If uploads fail, check the 500MB limit and file permissions.
- The frontend proxies `/api` to `http://localhost:5000` in `frontend/vite.config.js`.

## Production Build

```bash
cd frontend
npm run build
```

Preview it with:

```bash
npm run preview
```

## File Structure

```
Password-Encryption-For-files/
├── frontend/
│   ├── src/App.vue
│   ├── main.js
│   └── vite.config.js
├── backend/
│   └── server.js
└── README.md
```

## Author

[Rift Labs](https://github.com/Rift-Labs-Council)

## Sources

- [Encrypt and Decrypt Files in Node.js: A Step-by-Step Guide Using AES-256-CBC](https://mohammedshamseerpv.medium.com/encrypt-and-decrypt-files-in-node-js-a-step-by-step-guide-using-aes-256-cbc-c25b3ef687c3)
- [AES-256 Encryption : JavaScript in Browser](https://mojoauth.com/encryption-decryption/aes-256-encryption--javascript-in-browser)
- [How to create aes-256 encryption in javascript](https://stackoverflow.com/questions/44234137/how-to-create-aes-256-encryption-in-javascript)
- Obviously, some help from lil bro(aka Claude👾)

## License

MIT

---

**Important**: Store passwords securely. Lost passwords cannot be recovered.
