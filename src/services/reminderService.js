import { schedule } from 'node-cron';
import { find } from './models/employee';
import nodemailer from 'nodemailer';

// Function to send reminder emails
async function sendReminderEmail(employee) {
    // Implement your email sending logic here
    console.log(`Reminder: ${employee.firstName} ${employee.lastName}'s license is about to expire!`);
}

// Schedule reminder task
schedule('* * * * *', async () => {
    // Fetch all employees
    const employees = await find();

    // Iterate through employees
    employees.forEach(employee => {
        const expiryDate = new Date(employee.licenseExpiryDate);
        const currentDate = new Date();

        // Calculate difference in days
        const daysUntilExpiry = Math.floor((expiryDate - currentDate) / (1000 * 60 * 60 * 24));

        // If license is expiring within 30 days, send reminder email
        if (daysUntilExpiry <= 30) {
            sendReminderEmail(employee);
        }
    });
});