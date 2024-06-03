import nodemailer from "nodemailer";

// Function to send email containing the doctorId

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "kaifqureshi.dev@gmail.com",
    pass: "lhgw ewrl qvvl wyju",
  },
});

export const sendDoctorIdByEmail = async (email: string, doctorId: string) => {
  try {
    // Define email options
    const mailOptions = {
      from: "kaifqureshi.dev@gmail.com", // Sender address (your Gmail address)
      to: email, // Receiver address
      subject: "Congratulations User 🎉🎉", // Email subject
      text: `You can now create an account using your Doctor ID mentioned below: ${doctorId}`, // Plain text body
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("NODE MAILER RESPONSE", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendTeacherIdByEmail = async (
  email: string,
  teacherId: string
) => {
  try {
    // Define email options
    const mailOptions = {
      from: "kaifqureshi.dev@gmail.com", // Sender address (your Gmail address)
      to: email, // Receiver address
      subject: "Congratulations User 🎉🎉", // Email subject
      text: `You can now create an account using your Doctor ID mentioned below: ${teacherId}`, // Plain text body
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("NODE MAILER RESPONSE", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendOTP = async (email: string, otp: string) => {
  try {
    const mailOptions = {
      from: "kaifqureshi.dev@gmail.com", // Sender address (your Gmail address)
      to: email, // Receiver address
      subject: "Account Recovery", // Email subject
      text: `Your Email verification code is: ${otp}`, // Plain text body
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("NODE MAILER RESPONSE", result);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
