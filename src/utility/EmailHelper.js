const nodemailer = require('nodemailer')


const EmailSend = async (EmailTo, EmailText, EmailSubject) => {
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      service: "gmail",

      auth: {
        user: "dev.alrasels@gmail.com",
        pass: "avmqygwvmbbeveqs",
      },
    });
    const mailOption = {
      from: "MERN E-Commerce Solutions <dev.alrasels@gmail.com>",
      to: EmailTo,
      subject: EmailSubject,
      text: EmailText,
    };
    return await transport.sendMail(mailOption)
}

module.exports = EmailSend