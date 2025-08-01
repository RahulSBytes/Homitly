import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import htmlPdf from 'html-pdf-node';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function emailSender(data, user) {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/bookings/middle.ejs"),
      { data }
    );

   
    const options = { format: 'A4' };
    const file = { content: html };
    const pdfBuffer = await htmlPdf.generatePdf(file, options);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COZY_EMAIL,
        pass: process.env.COZY_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.COZY_EMAIL,
      to: user.email,
      subject: "Your Booking Confirmation",
      html: `
        <p>Dear ${user.username},</p>
        <p>Thank you for choosing Cozy Stay for your upcoming visit.</p>
        <p>We're excited to welcome you! Please find your booking confirmation attached as a PDF for your reference.</p>
        
        <h4>Booking Summary:</h4>
        <ul>
          <li><strong>Hotel:</strong> ${data.title || data._doc?.title || 'Your accommodation'}</li>
          <li><strong>Amount:</strong> ${data.payableAmount}</li>
        </ul>
        
        <p>If you have any questions or special requests, feel free to reply to this email.</p>
        
        <p>Warm regards,<br>
        The Cozy Stay Team</p>
      `,
      attachments: [
        {
          filename: "booking-confirmation.pdf",
          content: pdfBuffer,
        },
      ],
    });
  } catch (err) {
    console.error(`Email sending error: ${err.message}`);
    throw new Error(`Something Broke: ${err.message}`);
  }
}