import 'server-only';
import nodemailer from 'nodemailer';

function getTransporter() {
 const host=process.env.SMTP_HOST||'smtp.gmail.com';
 const port=Number(process.env.SMTP_PORT||587);
 const secure=process.env.SMTP_SECURE==='true';
 const user=process.env.SMTP_USER;
 const pass=process.env.SMTP_PASSWORD;
 if(!user||!pass) throw new Error('SMTP chưa được cấu hình.');
 return nodemailer.createTransport({host,port,secure,auth:{user,pass},requireTLS:!secure});
}

export async function sendLoginOtp(to:string,code:string) {
 const user=process.env.SMTP_USER||'';
 const from=process.env.SMTP_FROM||`Phân hiệu 1 <${user}>`;
 await getTransporter().sendMail({
  from,
  to,
  subject:'Mã xác thực đăng nhập CMS Phân hiệu 1',
  text:`Mã xác thực đăng nhập CMS của bạn là ${code}. Mã có hiệu lực trong ${process.env.OTP_EXPIRES_MINUTES||10} phút. Nếu bạn không thực hiện đăng nhập, hãy bỏ qua email này.`,
  html:`<div style="font-family:Arial,sans-serif;line-height:1.6;color:#173e30"><p>Xin chào,</p><p>Mã xác thực đăng nhập CMS Phân hiệu 1:</p><p style="font-size:30px;font-weight:700;letter-spacing:8px;color:#9c3033">${code}</p><p>Mã có hiệu lực trong ${process.env.OTP_EXPIRES_MINUTES||10} phút.</p><p>Nếu bạn không thực hiện đăng nhập, hãy bỏ qua email này.</p></div>`
 });
}
