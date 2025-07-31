import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function emailSender(data, user) {

  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/bookings/middle.ejs"),
      { data }
    );

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COZY_EMAIL,
        pass: process.env.COZY_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.COZY_EMAIL,
      to: "non.personal786@gmail.com",
      subject: "Your Booking Confirmation",

      // ---------------

      html: `
    <p>Dear ${user.username},</p>
    <p>Thank you for choosing Cozy Stay for your upcoming visit.</p>
    <p>We’re excited to welcome you! Please find your booking confirmation attached as a PDF for your reference.</p>

    <h4>Booking Summary:</h4>
    <ul>
      <li><strong>Hotel:</strong> ${data._doc.title}</li>
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
    console.error("EmailSender failed:", err.message);
    throw new Error("Something Broke: ", err.message);
  }
}
