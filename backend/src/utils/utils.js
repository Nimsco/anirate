function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOTPHtml(otp) {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OTP Verification</title>
    </head>
    <body style="margin: 0; padding: 0; background: #f4f7fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 30px 15px;">
                    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 20px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08); overflow: hidden;">
                        <tr>
                            <td style="background: linear-gradient(135deg, #3b82f6, #06b6d4); padding: 40px 30px; text-align: center; color: #ffffff;">
                                <h1 style="margin: 0; font-size: 28px; letter-spacing: 1px;">OTP Verification</h1>
                                <p style="margin: 8px 0 0; font-size: 16px; opacity: 0.9;">Secure sign-in made simple</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 40px 30px 30px; text-align: center; color: #333333;">
                                <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6;">Use the one-time password below to complete your verification. This code is valid for the next 10 minutes.</p>
                                <div style="display: inline-block; padding: 24px 32px; border-radius: 18px; background: #eef6ff; border: 1px solid #dbeafe; font-size: 36px; letter-spacing: 6px; font-weight: 700; color: #1d4ed8; margin: 0 0 24px;">
                                    ${otp}
                                </div>
                                <p style="margin: 0; font-size: 14px; color: #6b7280;">If you did not request this code, please ignore this email or contact support.</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="background: #f8fafc; padding: 20px 30px; text-align: center; color: #6b7280; font-size: 13px;">
                                <p style="margin: 0;">Need help? Reply to this email or visit our support center.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
}

module.exports = { generateOTP, getOTPHtml };