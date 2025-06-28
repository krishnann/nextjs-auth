import User from '@/model/userModel';
import bcryptjs from 'bcryptjs';
import nodemailer from 'nodemailer';

export const sendEmail = async({email, emailType, userId}:any) => {
    try {
        //TODO:: Configure mail for usage
        console.log("email: "+ email + ", emailType: "+ emailType +", userId: "+ userId);
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        let code = 0;

        // Verification email will be sent when user signs up it will be valid for 1 hour
        if(emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {$set:{verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 120000}});//60,000
        }
        else if (emailType === "RESET_PASSWORD") {
            // Generate a 6 digit code
            code = Math.floor(100000 + Math.random() * 900000);
            //Reset email will be sent when user requests to reset the password
           const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { forgotPasswordCode: code } },
        { new: true }
    );
    console.log('Updated user:', updatedUser);
        }

        var transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",//Put it in .env
            port: 2525,//Put it in .env
            auth: {
            user: "a96f9ad299ab36",//Put it in .env
            pass: "4d24c80074ec2f"//Put it in .env
            }
        });

        let htmlContent = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify your registered account</p>`;
        if (emailType === "RESET_PASSWORD") {
            htmlContent = `<p>Your password reset code is: <strong>${code}</strong></p>`;
        }

          const mailOptions = {
            from: 'knaik0901@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            html: htmlContent
          }

          const mailResponse = await transport.sendMail(mailOptions)
          return mailResponse
    } catch (error:any) {
        throw new Error("ERROR:: "+ error.message)
    }
}