const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

// Load .env file from the parent directory
const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });

if (result.error) {
  console.error("Error loading .env file:", result.error);
  throw new Error("Failed to load environment variables. Ensure .env file exists and is properly configured.");
}

// Debugging: Check if environment variables are loaded
console.log("MAILTRAP_USER:", process.env.MAILTRAP_USER ? "Loaded" : "Missing");
console.log("MAILTRAP_PASS:", process.env.MAILTRAP_PASS ? "Loaded" : "Missing");

const USER = process.env.MAILTRAP_USER;
const PASS = process.env.MAILTRAP_PASS;

if (!USER || !PASS) {
  console.error("Missing Mailtrap SMTP credentials.");
  console.error("MAILTRAP_USER:", USER || "Not provided");
  console.error("MAILTRAP_PASS:", PASS || "Not provided");
  throw new Error("Mailtrap SMTP credentials are missing. Check your .env file.");
}

// Configure Nodemailer transport for production use
const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io", // Use Mailtrap's SMTP host
  port: 587, // Use port 587 for secure connections
  auth: {
    user: USER,
    pass: PASS,
  },
});

// Define sender details
const sender = {
  email: "your-email@example.com", // Replace with your sender email
  name: "Your App Name", // Replace with your app or company name
};

// Export the transport and sender
module.exports = { transport, sender };