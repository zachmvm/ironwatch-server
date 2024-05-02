const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const cron = require("node-cron");
const nodemailer = require("nodemailer");
const reminderIntervals = [30, 60, 90];
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static("../frontend/public"));

// Routes
app.use("/api/employees", require("./src/routes/employeeRoutes"));
app.use("/api/documents", require("./src/routes/documentRoutes"));

// Define Mongoose models based on the schemas
const Employee = require("./src/models/employee");
const Document = require("./src/models/document");

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const transporter = nodemailer.createTransport({
  service: "gmail", // e.g., 'gmail', 'hotmail', etc.
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

function sendReminder(email, expirationDate) {
  const mailOptions = {
    from: process.env.ADMIN_EMAIL,
    to: email,
    subject: "License Expiration Reminder",
    text: `Your license is expiring on ${expirationDate}. Please renew it as soon as possible.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

// Function to check for license expiration and send reminders
async function checkLicenseExpiration() {
  try {
    // Fetch all licenses with expiration dates
    const licenses = await Document.find({
      licenseExpiryDate: { $exists: true, $ne: null },
    });
    // Iterate through each license
    for (const license of licenses) {
      // Fetch the associated employee info
      const employee = await Employee.findById(license.owner);
      if (employee) {
        // Calculate reminder intervals and send reminders
        const expirationDate = license.licenseExpiryDate;
        const currentDate = new Date();
        const daysUntilExpiration = Math.ceil(
          (expirationDate - currentDate) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilExpiration > 0) {
          reminderIntervals.forEach((interval) => {
            if (daysUntilExpiration === interval) {
              sendReminder(employee.email, expirationDate.toDateString());
            }
          });
        }
      }
    }
  } catch (err) {
    console.error("Error fetching licenses:", err);
  }
}

cron.schedule("0 0 * * *", () => {
  console.log("Running license expiration check...");
  checkLicenseExpiration();
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});