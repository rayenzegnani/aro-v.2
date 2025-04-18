const {
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    VERIFICATION_EMAIL_TEMPLATE,
} = require("./emailTemplates.js");
const { transport, sender } = require("./mailtrap.config.js"); // Use transport for sending emails

const sendVerificationEmail = async (email, verificationToken) => {
    try {
        const mailOptions = {
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        };

        const response = await transport.sendMail(mailOptions);
        console.log("Verification email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: "Welcome to Our App!",
            html: `<h1>Welcome, ${name}!</h1><p>Thank you for joining us.</p>`,
        };

        const response = await transport.sendMail(mailOptions);
        console.log("Welcome email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Error sending welcome email:", error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const mailOptions = {
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
        };

        const response = await transport.sendMail(mailOptions);
        console.log("Password reset email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
};

const sendResetSuccessEmail = async (email) => {
    try {
        const mailOptions = {
            from: `${sender.name} <${sender.email}>`,
            to: email,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        };

        const response = await transport.sendMail(mailOptions);
        console.log("Password reset success email sent successfully:", response.messageId);
    } catch (error) {
        console.error("Error sending password reset success email:", error);
        throw new Error(`Error sending password reset success email: ${error.message}`);
    }
};

module.exports = {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
};