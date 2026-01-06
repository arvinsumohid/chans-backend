import axios from 'axios';

export const sendSmsITexMo = async (phoneNumber: string, message: string): Promise<any> => {
	try {
		const data = {
			Email: process.env.SMS_EMAIL,
			Password: process.env.SMS_PASSWORD,
			ApiCode: process.env.SMS_API_CODE,
			Recipients: `"${phoneNumber}"`,
			Message: message,
		};

		const response = await axios.post('https://api.itexmo.com/api/broadcast', new URLSearchParams(data).toString(), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(`${process.env.SMS_EMAIL}:${process.env.SMS_PASSWORD}`).toString('base64')}`,
			},
		});

		return response.data;
	} catch (error) {
		console.log(error);
	}
};

export const sendSmsIProg = async (phoneNumber: string, message: string, isBulk = false): Promise<any> => {
	try {
		const url = `https://www.iprogsms.com/api/v1/sms_messages${isBulk ? '/send_bulk' : ''}`;

		console.log('url', url);
		const response = await axios.post(url, {
			api_token: process.env.SMS_API_TOKEN,
			phone_number: phoneNumber,
			message,
		});
		return response.data;
	} catch (error) {
		console.log(error);
	}
}
