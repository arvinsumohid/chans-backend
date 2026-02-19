export const getDate = (date: string | number | Date) => {
	const dateFormated = new Date(date);
	const year = dateFormated.getFullYear();
	const month = String(dateFormated.getMonth() + 1).padStart(2, '0');
	const day = String(dateFormated.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
};

export const getDateStatus = (row: any) => {
	const currentDate = new Date();

	if (row.event_deleted_at) {
		return 'CANCELED';
	}

	if (currentDate > new Date(row.event_date)) {
		return 'DONE';
	}
	return 'UPCOMING';
};
