// import moment from 'moment';
// import _ from 'lodash';
//
// export const getTodayDate = (format = 'DD.MM.YYYY') => {
// 	return moment().format(format);
// };
//
// export const getYesterdayDate = () => {
// 	return moment().subtract(1, 'day').format('DD.MM.YYYY');
// };
//
// export const timeFromNow = (date) => {
// 	const timestamp = moment(date).format('X');
// 	const newDate = moment.unix(timestamp);
// 	return moment(newDate).fromNow();
// };
//
// export const isToday = (date) => {
// 	return moment().isSame(date, 'day');
// };
//
// export const getNewDate = (noOfDays, format = 'DD MMM, YYYY') => {
// 	return moment().add(noOfDays, 'days').format(format);
// };
//
// export const getDateElements = (date) => {
// 	const dateString = moment(date).format('dddd, MMMM DD YYYY, hh:mm A');
// 	const dateSections = dateString.split(',');
// 	const day = dateSections[0];
// 	const time = dateSections[2];
// 	const datePart = dateSections[1].trim().split(' ');
// 	return {
// 		day,
// 		time,
// 		date: {
// 			dateString: dateSections[1],
// 			month: datePart[0],
// 			date: datePart[1],
// 			year: datePart[2],
// 		},
// 	};
// };
//
// export const getTime = (date) => {
// 	const dateObj = moment(date, 'dddd, MMMM DD YYYY, hh:mm a');
// 	return moment(dateObj).format('LT');
// };
//
// export const isDatesSame = (dateA, dateB) => {
// 	return moment(dateA).isSame(dateB, 'day');
// };
//
// export const isDateAfter = (date) => {
// 	const todayDate = getTodayDate('dddd, MMMM DD YYYY, hh:mm a');
// 	return moment(todayDate).isAfter(date);
// };
//
// export const getDateinDesiredFormat = (date, format) => {
// 	return moment(date).format(format);
// };
//
// export const makeJSDateObject = (date) => {
// 	if (date) {
// 		return new Date(date.getTime());
// 	}
// 	return date;
// };
//
// /**
//  * Get Formatted Date
//  * @param date
//  * @param format
//  * @returns {string}
//  */
// export const getFormattedDate = (date, format = 'YYYY-MM-DD') => {
// 	if (moment(date, 'YYYY-MM-DD').isValid()) {
// 		return moment(date).format(format);
// 	}
//
// 	return '';
// };
//
// /**
//  * Check Is dateTime of Tomorrow
//  * @param inputDateTime
//  * @returns {boolean}
//  */
// export const isTomorrow = (inputDateTime) => {
// 	const tomorrow = moment().add(1, 'days').format('YYYY-MM-DD');
//
// 	return moment(inputDateTime).isSame(tomorrow, 'day');
// };
//
// /**
//  * Check Is dateTime of Yesterday
//  * @param inputDateTime
//  * @returns {boolean}
//  */
// export const isYesterday = (inputDateTime) => {
// 	const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');
//
// 	return moment(inputDateTime).isSame(yesterday, 'day');
// };
//
// /**
//  * Get Custom Date Time
//  * @param value
//  * @param unit
//  * @param format
//  * @returns {string}
//  */
// export const getCustomDateTime = (value = 0, unit = 'days', format = 'YYYY-MM-DD') => {
// 	if (value === 0) {
// 		return moment().format(format);
// 	} else {
// 		return moment().add(value, unit).format(format);
// 	}
// };
//
// export const getDateText = (date) => {
// 	if (isToday(date)) {
// 		return 'Today';
// 	} else if (isYesterday(date)) {
// 		return 'Yesterday';
// 	} else if (isTomorrow(date)) {
// 		return 'Tomorrow';
// 	} else {
// 		return date;
// 	}
// };
//
// export const getTimeDiffString = (date) => {
// 	const postDate = moment(date, 'ddd MMM DD YYYY kk:mm:ss Z');
// 	const currentDate = moment(new Date());
// 	const duration = moment.duration(currentDate.diff(postDate));
// 	const minutes = duration.asMinutes() | 0;
// 	const hours = duration.asHours() | 0;
//
// 	switch (true) {
// 		case minutes === 0:
// 			return 'Just now';
// 		case minutes < 60:
// 			return `${minutes} min`;
// 		case hours < 24:
// 			return `${hours} hours`;
// 		default:
// 			return postDate.format('DD MMM, YYYY');
// 	}
// };
//
// export const getDaysList = () => {
// 	let daysList = [];
// 	let dayFrom = 1;
// 	let dayTo = 31;
// 	for (let i = dayFrom; i <= dayTo; i++) {
// 		if (i >= 10) {
// 			daysList[i] = i;
// 		} else {
// 			daysList[i] = '0' + i;
// 		}
// 	}
// 	return daysList;
// };
//
// export const getMonthsList = () => {
// 	return [
// 		{ value: '01', text: 'January' },
// 		{ value: '02', text: 'February' },
// 		{ value: '03', text: 'March' },
// 		{ value: '04', text: 'April' },
// 		{ value: '05', text: 'May' },
// 		{ value: '06', text: 'June' },
// 		{ value: '07', text: 'July' },
// 		{ value: '08', text: 'August' },
// 		{ value: '09', text: 'September' },
// 		{ value: '10', text: 'October' },
// 		{ value: '11', text: 'November' },
// 		{ value: '12', text: 'December' },
// 	];
// };
//
// export const getYearsList = () => {
// 	const year = new Date().getFullYear();
// 	const endYear = year - 100;
// 	const startYear = year - 17;
// 	return _.range(startYear, endYear);
// };
