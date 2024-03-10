import nodemailer from 'nodemailer';
import { getAppSettings } from '../app.settings/app.settings.service';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: getAppSettings().EMAIL_USER_NAME,
    pass: getAppSettings().EMAIL_PASSWORD
  }
});

export const sendVerificationEmail = async (to: string, userKey: string) => {
  const html = `
    <h1>Hello, Are You Ready To Start Your Journey</h1>
    <h2>WIP</h2>
    <p class="child-element"> please verify your account by clicking the button bellow</p>
        <a href="http://localhost:3000/user/verify/${userKey}" style="            
          background-color: #4caf50; /* Green color */
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;">Verify Email</a>
`;
  sendEmail(html, to, 'Welcome To Our Service');
};

export const sendResetEmail = async (to: string) => {
  const html = `
    <h1>Password Reset</h1>
    <h2>WIP</h2>
    <p class="child-element"> please reset password by clicking the button bellow</p>
        <a href="http://localhost:3000/resetpassword" style="            
          background-color: #4caf50; /* Green color */
            border: none;
            color: white;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 5px;">Reset Password</a>
`;
  sendEmail(html, to, 'Reset Password');
};

const sendEmail = async (html: string, to: string, subject: string) => {
  try {
    const info = await transporter.sendMail({
      from: {
        name: 'registerTwin',
        address: getAppSettings().EMAIL_USER_NAME
      },
      to: to,
      subject: subject ?? 'Welcome To Our Service',
      html
    });
    console.log(`Messgae Sent:${info.messageId}`);
  } catch (error) {
    console.log(error);
    throw error;
  }
};
