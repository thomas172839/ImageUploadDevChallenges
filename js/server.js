const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files from the project root
app.use(express.static(path.join(__dirname, '..')));

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter: function (req, file, cb) {
        const allowed = /jpeg|jpg|png|gif|svg/;
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.test(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded or file too large.' });
    }
    // Build the URL to access the uploaded file
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ 
        message: 'Upload successful!', 
        filename: req.file.filename,
        url: fileUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});