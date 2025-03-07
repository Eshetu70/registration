const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// ✅ Correct the path to the "registration" folder
const publicDir = path.join(__dirname, );

// ✅ Serve the `index.html` file when visiting `/`
app.get("/", (req, res) => {
    res.sendFile(path.resolve(publicDir, "index.html"));
});

// ✅ Serve static files (like CSS, JS)
app.use(express.static(publicDir));

// Multer Setup (for file uploads)
const upload = multer({ dest: "uploads/" });

// Email Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Handle file upload & registration
app.post("/upload", upload.single("file"), async (req, res) => {
    const { name, email } = req.body;
    if (!req.file || !name || !email) {
        return res.status(400).send("All fields are required.");
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    try {
        // Send email notification
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: "eshetuwek1@gmail.com",
            subject: "New User Registration & File Upload",
            text: `New Registration:\n\nName: ${name}\nEmail: ${email}\nUploaded File: ${fileName}`,
        };

        await transporter.sendMail(mailOptions);

        // Clean up temp file
        fs.unlinkSync(filePath);

        res.send(`Thank you, ${name}. Your file has been uploaded.`);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error uploading file.");
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
