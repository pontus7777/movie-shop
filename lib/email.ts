import nodemailer from 'nodemailer'

// const nodemailer = require("nodemailer");

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail(email: string, subject: string, text: string, html?: string) {
  return await transporter.sendMail({
    from: process.env.SMTP_FROM, // sender address
    to: email, // list of recipients
    subject, // subject line
    text, // plain text body
    html, // HTML body
  })
}
