import puppeteer from "puppeteer";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function emailSender(data, user) {
// console.log(data)

  try {
    // Render EJS to HTML
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/bookings/middle.ejs"),
      { data }
    );

    // Launch Puppeteer to convert HTML → PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Load the HTML content
    await page.setContent(html, { waitUntil: "networkidle0" });

    // Generate PDF
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    await browser.close();
    // console.log("PDF generated for booking:", data._id);

    // Send email with PDF attached
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

      // ------------------------------

      attachments: [
        {
          filename: "booking-confirmation.pdf",
          content: pdfBuffer,
        },
      ],
    });
  } catch (err) {
    console.error("EmailSender failed:", err.message);
    // Rethrow so the controller's `catch` can catch it
    throw new Error("Something Broke: ", err.message);
  }
}
