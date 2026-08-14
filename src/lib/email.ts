import nodemailer from "nodemailer";

/* ─── Lazy transporter ─────────────────────────────────────── */
let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const user = process.env.RESERVATION_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error(
      "RESERVATION_EMAIL and GMAIL_APP_PASSWORD must be set in .env to send emails."
    );
  }

  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return _transporter;
}

/* ─── Types ────────────────────────────────────────────────── */
interface ReservationEmailData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequest?: string;
}

/* ─── Shared brand tokens ──────────────────────────────────── */
const brand = {
  maroon: "#9E2336",
  gold: "#DF9F7E",
  dark: "#120204",
  bg: "#1A0407",
};

/* ─── Customer confirmation email ──────────────────────────── */
function buildCustomerHtml(data: ReservationEmailData): string {
  const formattedDate = new Date(data.date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reservation Request Received — RIKO</title>
</head>
<body style="margin:0;padding:0;background:#0D0103;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0103;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${brand.bg};border-radius:16px;border:1px solid ${brand.maroon}33;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2A060C 0%,#3E0E16 100%);padding:48px 40px 36px;text-align:center;border-bottom:1px solid ${brand.maroon}44;">
              <p style="margin:0 0 12px;font-size:11px;letter-spacing:0.4em;text-transform:uppercase;color:${brand.gold};font-family:Arial,sans-serif;font-weight:600;">
                ★ &nbsp; R I K O &nbsp; ★
              </p>
              <h1 style="margin:0 0 8px;font-size:36px;font-weight:400;color:#fff;letter-spacing:0.06em;text-transform:uppercase;">
                We've Got Your Table
              </h1>
              <p style="margin:0;font-size:13px;color:#ffffff99;letter-spacing:0.1em;font-family:Arial,sans-serif;">
                Your reservation request has been received
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">

              <p style="margin:0 0 24px;font-size:16px;color:#ffffffcc;line-height:1.7;">
                Hi <strong style="color:#fff;">${data.name.split(" ")[0]}</strong>,
              </p>

              <p style="margin:0 0 28px;font-size:15px;color:#ffffff99;line-height:1.8;font-family:Arial,sans-serif;">
                Thank you for choosing <strong style="color:${brand.gold};">RIKO</strong>. We've received your reservation request and our team will confirm your table <strong style="color:#fff;">within the next few hours</strong>. You'll hear from us shortly!
              </p>

              <!-- Booking details card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0103;border-radius:12px;border:1px solid ${brand.maroon}44;margin-bottom:28px;">
                <tr>
                  <td style="padding:6px 24px 4px;border-bottom:1px solid ${brand.maroon}22;">
                    <p style="margin:0;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:${brand.gold};font-family:Arial,sans-serif;font-weight:600;">
                      Booking Summary
                    </p>
                  </td>
                </tr>
                ${detailRow("Date", formattedDate)}
                ${detailRow("Time", data.time)}
                ${detailRow("Guests", `${data.guests} ${data.guests === 1 ? "Guest" : "Guests"}`)}
                ${data.specialRequest ? detailRow("Special Request", data.specialRequest) : ""}
              </table>

              <p style="margin:0 0 32px;font-size:13px;color:#ffffff55;line-height:1.7;font-family:Arial,sans-serif;">
                Need to make changes or have a question? Call us directly at
                <a href="tel:+919972540238" style="color:${brand.gold};text-decoration:none;font-weight:600;">+91 99725 40238</a>
                &mdash; we're here Tue&ndash;Sun, 6:30&nbsp;PM onwards.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="tel:+919972540238"
                       style="display:inline-block;padding:14px 36px;background:${brand.maroon};color:#fff;text-decoration:none;border-radius:8px;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;font-family:Arial,sans-serif;font-weight:700;">
                      📞 &nbsp; Call Us
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;border-top:1px solid ${brand.maroon}33;text-align:center;">
              <p style="margin:0 0 4px;font-size:11px;color:#ffffff33;font-family:Arial,sans-serif;letter-spacing:0.15em;text-transform:uppercase;">
                RIKO &nbsp;·&nbsp; UB City, Bengaluru
              </p>
              <p style="margin:0;font-size:11px;color:#ffffff22;font-family:Arial,sans-serif;">
                Tue – Sun &nbsp;·&nbsp; 6:30 PM – Late
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

function detailRow(label: string, value: string) {
  return `
  <tr>
    <td style="padding:14px 24px;border-bottom:1px solid #9E233618;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#ffffff44;font-family:Arial,sans-serif;width:120px;">${label}</td>
          <td style="font-size:14px;color:#fff;font-family:Arial,sans-serif;text-align:right;">${value}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/* ─── Restaurant notification email ────────────────────────── */
function buildRestaurantHtml(data: ReservationEmailData): string {
  const formattedDate = new Date(data.date + "T00:00:00").toLocaleDateString(
    "en-IN",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  );

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>New Reservation — RIKO</title></head>
<body style="margin:0;padding:0;background:#0D0103;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0103;padding:32px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#1A0407;border-radius:12px;border:1px solid ${brand.maroon}44;overflow:hidden;">

        <tr>
          <td style="background:#2A060C;padding:28px 32px;border-bottom:1px solid ${brand.maroon}44;">
            <p style="margin:0 0 6px;font-size:10px;letter-spacing:0.35em;text-transform:uppercase;color:${brand.gold};">★ RIKO · New Booking</p>
            <h2 style="margin:0;font-size:22px;color:#fff;font-weight:400;letter-spacing:0.04em;">New Reservation Request</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:28px 32px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D0103;border-radius:10px;border:1px solid ${brand.maroon}33;margin-bottom:20px;">
              ${detailRow("Guest Name", data.name)}
              ${detailRow("Email", data.email)}
              ${detailRow("Phone", data.phone)}
              ${detailRow("Date", formattedDate)}
              ${detailRow("Time", data.time)}
              ${detailRow("Guests", `${data.guests}`)}
              ${data.specialRequest ? detailRow("Special Request", data.specialRequest) : detailRow("Special Request", "None")}
            </table>
            <p style="margin:0;font-size:12px;color:#ffffff44;line-height:1.6;">
              This is an automated notification. Log in to the RIKO admin panel to manage this reservation.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/* ─── Main export ──────────────────────────────────────────── */
export async function sendReservationEmails(
  data: ReservationEmailData
): Promise<void> {
  const restaurantEmail = process.env.RESERVATION_EMAIL;
  if (!restaurantEmail) {
    console.warn("[email] RESERVATION_EMAIL not set — skipping email.");
    return;
  }

  const transporter = getTransporter();

  // Send both emails concurrently
  await Promise.allSettled([
    // 1. Customer confirmation
    transporter.sendMail({
      from: `"RIKO Restaurant" <${restaurantEmail}>`,
      to: data.email,
      subject: "✦ We've Received Your Reservation — RIKO",
      html: buildCustomerHtml(data),
    }),

    // 2. Restaurant notification
    transporter.sendMail({
      from: `"RIKO Reservations" <${restaurantEmail}>`,
      to: restaurantEmail,
      subject: `📋 New Reservation: ${data.name} — ${data.date} at ${data.time}`,
      html: buildRestaurantHtml(data),
    }),
  ]);
}
