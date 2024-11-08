import axios from 'axios';

export const sendOtpSMS = async (phone, otp, content=null) => {
    const apiKey = '1zgB8GtvL6nCGfZxJJgQ';
    const url = `https://restapi.smscountry.com/v0.1/Accounts/${apiKey}/SMSes`;
    const senderId = 'EUCTOS';
    const message = content || `Dear User, your one-time password (OTP) for secure login to your account is ${otp}. Please use this OTP to authenticate your access. The OTP will expire in 10 minutes. Regards, \n EUCTO Tech.`;
    const data = {
        Text: message,
        Number: "91" + phone.toString(),
        SenderId: senderId
    };

    try {
        const response = await axios.post(url, data, {
            headers: {
                'Authorization': 'Basic MXpnQjhHdHZMNm5DR2ZaeEpKZ1E6Q1o4ZDVBNWNta2k1R0dZaWZlcE5tSG02ZGh1Z0Rwb3haT29TRWRMMQ=='
            }
        });
        console.log('SMS sent successfully:', response.data);
    } catch (error) {
        console.error('Error sending SMS:', error);
    }
};
export const sendResetSMS = async (phone, otp) => {
    sendOtpSMS(phone, otp, `Dear User, your one-time password (OTP) for secure login to your account is ${otp}. Please use this OTP to authenticate your access. The OTP will expire in 10 minutes. Regards, \n EUCTO Tech.`);
}