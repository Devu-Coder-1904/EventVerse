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
const sendBookingEmail = async (email, name, booking) => {
    try {
        const downloadLink = `${process.env.CLIENT_URL}/ticket?bookingId=${booking._id}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: `🎫 Your Event Ticket - ${booking.eventId.title}`,
            html: `
            <div style="font-family:Arial;max-width:520px;margin:auto;padding:20px;border:1px solid #ddd;border-radius:12px">

                <h2 style="color:#16a34a;text-align:center;">✅ Booking Confirmed</h2>

                <p>Hello <b>${name}</b>,</p>

                <p>Your ticket is ready 🎉</p>

                <div style="background:#f3f4f6;padding:15px;border-radius:10px;margin:20px 0">

                    <h3>${booking.eventId.title}</h3>
                    <p>📅 ${new Date(booking.eventId.date).toDateString()}</p>
                    <p>📍 ${booking.eventId.location}</p>
                    <p>🎟 Booking ID: ${booking._id}</p>

                </div>

                <div style="text-align:center;margin:25px 0;">
                    <a href="${downloadLink}" 
                       style="background:#2563eb;color:white;padding:12px 18px;
                       text-decoration:none;border-radius:8px;font-weight:bold;">
                       📥 Download / View Ticket
                    </a>
                </div>

                <p style="font-size:12px;color:gray;text-align:center;">
                    Show this ticket at entry gate (QR included)
                </p>

            </div>
            `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(error);
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