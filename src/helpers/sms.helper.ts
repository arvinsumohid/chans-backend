import axios from 'axios';

export const sendSms = async (phoneNumber: string, message: string): Promise<any> => {
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
