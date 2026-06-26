const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {   
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingEmail = async (email, name, eventTitle) => {
    try {
const mailOptions = {
from: process.env.EMAIL_USER,
to: email,
subject: `Event Booking Confirmed: ${eventTitle}`,
html: ` <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px"> <h2 style="text-align:center;color:#16a34a;">✅ Booking Confirmed</h2>

  <p>Hello <b>${name}</b>,</p>

  <p>Your booking has been successfully confirmed for:</p>

  <div style="background:#f3f4f6;padding:15px;border-radius:8px;text-align:center;margin:20px 0;">
    <h3 style="margin:0;color:#2563eb;">${eventTitle}</h3>
  </div>

  <p>We look forward to seeing you at the event.</p>

  <hr>

  <p style="font-size:12px;color:gray;text-align:center;">
    Thank you for choosing Eventora 🎉
  </p>
</div>

`,
};

        await transporter.sendMail(mailOptions);
        console.log(`Booking confirmation email sent to ${email} for event: ${eventTitle}`);
    }
    catch (error) {
        console.error(`Error sending booking confirmation email to ${email}:`, error);
        
    }       
};

const sendOtpEmail = async (email, otp, type) => {
    try {
         
        const title = type === 'account_verification' ? 'Account Verification' : 'Event Booking';
        const msg = type === 'account_verification' ? 'Please use the following OTP to verify your account.' : 'Please use the following OTP to complete your event booking.';

const mailOptions = {
from: process.env.EMAIL_USER,
to: email,
subject: title,
html: ` <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:10px"> <h2 style="text-align:center;color:#2563eb;">🎉 Eventora</h2>


  <p>Hello,</p>
  <p>${msg}</p>

  <div style="text-align:center;margin:25px 0;">
    <span style="font-size:32px;font-weight:bold;color:#2563eb;letter-spacing:8px;">
      ${otp}
    </span>
  </div>

  <p><b>Note:</b> This OTP will expire in 5 minutes.</p>

  <hr>

  <p style="font-size:12px;color:gray;text-align:center;">
    If you didn't request this OTP, please ignore this email.
  </p>
</div>
`,
};

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent to ${email} for ${type}`);
    }   
    catch (error) {
        console.error(`Error sending OTP email to ${email}:`, error);
    }
};

module.exports = { sendBookingEmail, sendOtpEmail };