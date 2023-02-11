import { MailerModule } from "@nestjs-modules/mailer";
import { EjsAdapter } from "@nestjs-modules/mailer/dist/adapters/ejs.adapter";

const connectMail = MailerModule.forRoot({
  transport: {
    host:'smtp.sendgrid.net',
    auth: {
      user: 'apikey',
      pass: process.env.YOUR_API_KEY
    },
  },
  template: {
    dir: __dirname + '/templates/verify',
    adapter: new EjsAdapter(),
    options: {
      strict: false,
    },
  }
})

export default connectMail