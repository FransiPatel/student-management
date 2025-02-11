const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const sendConfirmationEmail = async ({ email, name }) => {
    try {
        // Configure Nodemailer Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.AUTH_USER,
                pass: process.env.AUTH_PASS,
            },
        });

        // Render the EJS Email Template
        const emailTemplate = await ejs.renderFile(
            path.join(__dirname, "../views/confirmationEmail.ejs"), 
            { email, name: name }
        );

        // Set up email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to Our Platform",
            html: emailTemplate,
        };

        // Send email and return result
        const info = await transporter.sendMail(mailOptions);
        return { success: true, message: "Email sent successfully", response: info.response };
    } catch (error) {
        return { success: false, message: "Failed to send email" };
    }
};

module.exports = { sendConfirmationEmail };
