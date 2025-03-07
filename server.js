const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000; // You can change this if needed

// ✅ Ensure "uploads" directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Setup (for file uploads)
const upload = multer({ dest: uploadDir });

// ✅ Serve static files (like index.html)
const publicDir = path.join(__dirname, ); // Ensure 'public' folder exists
app.use(express.static(publicDir));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

// ✅ Email Configuration (Directly Setting Credentials)
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Use Outlook/Yahoo host if needed
    port: 465,
    secure: true,
    auth: {
        user: "eshetuwek1@gmail.com", // Replace with your email
        pass: "nxit sich jbfm kkyd", // Replace with your generated App Password
    },
});

// ✅ Handle file upload & registration
app.post("/upload", upload.single("file"), async (req, res) => {
    const { name, email, message } = req.body;
    if (!req.file || !name || !email || !message) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    try {
        // ✅ Send email notification with file attachment
        const mailOptions = {
            from: "your-email@gmail.com", // Must match the email in transporter.auth
            to: "eshetuwek1@gmail.com", // Change recipient email if needed
            subject: "New User Registration & File Upload",
            text: `New Registration:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}\nUploaded File: ${fileName}`,
            attachments: [
                {
                    filename: fileName,
                    path: filePath,
                },
            ],
        };

        await transporter.sendMail(mailOptions);

        // ✅ Clean up temp file after email is sent
        fs.unlinkSync(filePath);

       
        res.send(`Thank you, ${name}. your file has been uploaded and email sent.`);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Error uploading file or sending email." });
    }
});

// ✅ Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
