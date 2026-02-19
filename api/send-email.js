const nodemailer = require("nodemailer");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const {
    empresa,
    nombre,
    phone,
    email,
    diarecogida,
    horarecogida,
    direccionrecogida,
    ciudadrecogida,
    destino,
    ciudaddestino,
    observaciones,
  } = req.body || {};

  if (!nombre || !phone || !email) {
    return res
      .status(400)
      .json({ error: "Faltan campos obligatorios (Nombre, Teléfono, Email)." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Email no válido." });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 465,
    secure: (Number(process.env.SMTP_PORT) || 465) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const textBody = [
    `Empresa: ${empresa || "—"}`,
    `Nombre: ${nombre}`,
    `Teléfono: ${phone}`,
    `Email: ${email}`,
    `Día de recogida: ${diarecogida || "—"}`,
    `Hora de recogida: ${horarecogida || "—"}`,
    `Dirección de recogida: ${direccionrecogida || "—"}`,
    `Ciudad de recogida: ${ciudadrecogida || "—"}`,
    `Destino: ${destino || "—"}`,
    `Ciudad de destino: ${ciudaddestino || "—"}`,
    "",
    `Observaciones:`,
    observaciones || "Ninguna",
  ].join("\n");

  const htmlBody = `
    <h2 style="color:#333;">Nueva solicitud desde la web</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;font-family:Arial,sans-serif;">
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Empresa</td><td style="padding:8px;border:1px solid #ddd;">${empresa || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Nombre</td><td style="padding:8px;border:1px solid #ddd;">${nombre}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Teléfono</td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Email</td><td style="padding:8px;border:1px solid #ddd;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Día de recogida</td><td style="padding:8px;border:1px solid #ddd;">${diarecogida || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Hora de recogida</td><td style="padding:8px;border:1px solid #ddd;">${horarecogida || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Dirección de recogida</td><td style="padding:8px;border:1px solid #ddd;">${direccionrecogida || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Ciudad de recogida</td><td style="padding:8px;border:1px solid #ddd;">${ciudadrecogida || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Destino</td><td style="padding:8px;border:1px solid #ddd;">${destino || "—"}</td></tr>
      <tr><td style="padding:8px;border:1px solid #ddd;font-weight:bold;">Ciudad de destino</td><td style="padding:8px;border:1px solid #ddd;">${ciudaddestino || "—"}</td></tr>
    </table>
    <h3 style="color:#333;margin-top:20px;">Observaciones</h3>
    <p style="font-family:Arial,sans-serif;color:#555;">${(observaciones || "Ninguna").replace(/\n/g, "<br>")}</p>
  `;

  try {
    await transporter.sendMail({
      from: `"LogroTaxi Web" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: "Nueva solicitud desde la web (Reserva/Consulta)",
      text: textBody,
      html: htmlBody,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("SMTP error:", err);
    return res
      .status(500)
      .json({ error: "No se pudo enviar el correo. Inténtelo más tarde." });
  }
};
