import dayjs from 'dayjs';
// import { DateTime } from 'luxon';
/**
 * parse value to date
 * a wrapper of luxon date parsers to allow taking multiple formats
 * @param {any} val
 * @param {string | string[]} format
 * @return {Date}
 */
export const toDate = (val, format?: string | string[]): Date => {
	const formats = Array.isArray(format) ? format : [format];
	let dt: Date;
	for (const format of formats) {
		const dayjsDt = format ? dayjs(val, format, true) : dayjs(val);
		if (dayjsDt.isValid()) {
			dt = dayjsDt.toDate();
			break;
		}
	}
	return dt;
};
