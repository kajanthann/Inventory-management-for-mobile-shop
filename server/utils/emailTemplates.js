export const getOtpEmailTemplate = (otp) => {
  const digits = otp.toString().split("");
  const timestamp = new Date().toLocaleString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    year: "numeric", hour: "2-digit", minute: "2-digit",
  });
 return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>SmartSpider OTP</title>
  </head>

  <body style=" padding:0; display: flex; justify-content: center; items:center; margin:auto; font-family:Arial, sans-serif;">

    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">

          <!-- Card -->
          <table width="420" cellpadding="0" cellspacing="0" style="background:#111111; border-radius:12px; overflow:hidden; border:1px solid #1f1f1f;">
            
            <!-- Top Bar -->
            <tr>
              <td style="height:4px; background:#b00000;"></td>
            </tr>

            <!-- Header -->
            <tr>
              <td style="padding:20px; text-align:left;">
                <h2 style="margin:0; font-size:20px;">
                  <span style="color:#ffffff;">SMART</span>
                  <span style="color:#b00000;">SPIDER</span>
                </h2>
                <p style="margin:4px 0 0; font-size:11px; color:#777;">
                  Inventory System
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:20px; text-align:center;">
                
                <div style="font-size:14px; color:#ccc;">
                  Your One-Time Password (OTP)
                </div>

                <!-- OTP Box -->
                <div style="
                  margin:20px auto;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:bold;
                  color:#ffffff;
                  background:#1a1a1a;
                  padding:14px 20px;
                  border-radius:8px;
                  display:inline-block;
                  border:1px solid #2a2a2a;
                ">
                  ${otp}
                </div>

                <p style="font-size:12px; color:#888; margin-top:10px;">
                  This code will expire in <b style="color:#b00000;">1 minute</b>.
                </p>

              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="border-top:1px solid #1f1f1f;"></td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:14px; text-align:center; font-size:11px; color:#666;">
                © ${new Date().getFullYear()} SmartSpider. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};