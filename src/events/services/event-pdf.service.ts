import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { EventView } from '../entities/event.view.entity';
import { getDate, getDateStatus } from '@/helpers/util.helper';
import { ListResponsePaginationDto } from '@/common/common.dto';

@Injectable()
export class EventsPdfService {
	async generateEventsPdf(events: ListResponsePaginationDto<EventView>): Promise<Buffer> {
		const eventList = events.items.map((event) => ({
			name: event.user_lastname + ', ' + event.user_firstname,
			personnel: event.doctor_lastname + ', ' + event.doctor_firstname,
			service: event.service_name,
			appointment_date: getDate(event.event_date),
			status: getDateStatus(event),
		}));

		return new Promise((resolve) => {
			const doc = new PDFDocument({ margin: 30, size: 'A4' });

			const buffers: Uint8Array[] = [];

			doc.on('data', buffers.push.bind(buffers));
			doc.on('end', () => {
				const pdfData = Buffer.concat(buffers);
				resolve(pdfData);
			});

			// ✅ Title
			doc.fontSize(18).text('Appointments Report', {
				align: 'center',
			});

			doc.moveDown();

			// ✅ Table Header
			const startY = doc.y; // current y position

			doc.fontSize(10).text('Requested By', 50, startY);
			doc.text('Medical Personnel', 150, startY);
			doc.text('Service', 250, startY);
			doc.text('Appointment Date', 350, startY);
			doc.text('Status', 450, startY);

			doc.moveDown();
			doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
			doc.moveDown();

			// ✅ Table Rows
			const rowHeight = 15;
			eventList.forEach((event) => {
				const currentY = doc.y;

				doc.text(event.name, 50, currentY, { width: 100 });
				doc.text(event.personnel, 150, currentY, { width: 100 });
				doc.text(event.service, 250, currentY, { width: 100 });
				doc.text(event.appointment_date, 350, currentY, { width: 100 });
				doc.text(event.status, 450, currentY, { width: 100 });

				doc.moveDown();
				doc.y += rowHeight;
			});

			doc.end();
		});
	}
}
