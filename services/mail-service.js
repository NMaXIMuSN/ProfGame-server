const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  async sendAcrivationMail(to) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на ProfGAME",
      text: "",
      html: `
                <div>
                    <h1>Дождитесь, когда председатель активирует ваш акаунт</h1>
                </div>
          `,
    });
  }
  async sendAdminMail(to) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на ProfGAME",
      text: "",
      html: `
                <div>
                    <h1>Активируйте аккаунт пользователя</h1>
                </div>
          `,
    });
  }
}

module.exports = new MailService();
