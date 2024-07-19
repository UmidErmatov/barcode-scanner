import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.FROM_EMAIL,
        pass: process.env.FROM_EMAIL_PASS
    }
} as SMTPTransport.Options)

export const sendTwoFactorEmail = async (email: string, token: string) => {

    try {
        await transport.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "Ikki bosqichli himoya",
            html: `<p>Sizning IBH kodingiz: ${token}</p>`,
        });

    } catch (error) {
        console.log("send email error: ", error);
    }
}
export const sendResetPasswordEmail = async (email: string, token: string) => {
    const resetLink = `http://192.168.0.199:3000/new-password?token=${token}`;

    try {
        await transport.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "Parolni qayta o'rnatish",
            html: `<p>Parolni qayta o'rnatish uchun <a href="${resetLink}">bu yerga</a> bosing</p>`,
        });

    } catch (error) {
        console.log("send email error: ", error);
    }
}

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `http://192.168.0.199:3000/new-verification?token=${token}`;

    try {
        await transport.sendMail({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: 'Emailingizni tasdiqlang',
            html: `<p>Tasdiqlash uchun <a href="${confirmLink}">bu yerga</a> bosing</p>`,
        });

    } catch (error) {
        console.log("send email error: ", error);
    }
}