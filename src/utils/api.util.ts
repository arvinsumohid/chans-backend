import { ApiResponseDto } from '../app.dto';

export const ApiResponse = (data: any, message: string, status: number): ApiResponseDto => {
	return {
		data: data || null,
		message,
		status,
	};
};
