import User from '@/model/userModel';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        //TODO:: Configure mail for usage
        console.log("email: "+ email + ", emailType: "+ emailType +", userId: "+ userId);
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {$set:{verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000}});
        }else if (emailType === "RESET"){
            await User.findByIdAndUpdate(userId, 
                {$set:{forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000}});
        }

      // Looking to send emails in production? Check out our Email API/SMTP product!
        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",//Put it in .env
            port: 2525,//Put it in .env
            auth: {
            user: "a96f9ad299ab36",//Put it in .env
            pass: "4d24c80074ec2f"//Put it in .env
            }
        });

          const mailOptions = {
            from: 'knaik0901@gmail.com', // sender address
            to: email, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password", // Subject line
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>`
          }

          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error("ERROR:: "+ error.message)
    }
}