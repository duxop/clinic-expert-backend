// sendEmail.js
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

const client = new SESClient({
  region: process.env.AWS_SES_REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  },
});

const sendEmail = async (recipientEmail, otp) => {
    console.log("Sending email to:", recipientEmail);

  const params = {
    Source: process.env.AWS_SES_SOURCE_EMAIL, // Must be a verified email in SES
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Message: {
      Subject: {
        Data: "Your OTP Code",
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: `Your One Time Password (OTP) is: ${otp}\n\nThis OTP is valid for 10 minutes.`,
          Charset: "UTF-8",
        },
        Html: {
          Data: `<p>Your One Time Password (OTP) is:</p><h2>${otp}</h2><p>This OTP is valid for 5 minutes.</p>`,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    const result = await client.send(new SendEmailCommand(params));
    console.log("Email sent successfully:", result.MessageId);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

module.exports = sendEmail;
