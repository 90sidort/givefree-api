import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST as string,
  port: process.env.EMAIL_PORT as unknown as number,
  auth: {
    user: process.env.EMAIL_USERNAME as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});

function makeEmail(text: string) {
  return `
        <div style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px;
        ">
            <h2>Hi!</h2>
            <p>${text}</p>
            <p>Givefree Admin</p>
        </div>
    `;
}

export async function sendResetEmail(token: string, to: string) {
  const body = await transport.sendMail({
    to,
    from: "test@test.com",
    subject: "Reset your password!",
    html: makeEmail(`
            Now you can safely reset your password.
            <a href="${process.env.FRONT_URL}/reset?token=${token}">
                Click here
            </a>
        `),
  });
  if (process.env.EMAIL_USERNAME?.includes("ethereal.email")) {
    console.log(
      `Message sent! Preview at: ${nodemailer.getTestMessageUrl(body)}`
    );
  }
}
