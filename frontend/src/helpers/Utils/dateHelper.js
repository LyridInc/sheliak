import _ from 'lodash';
import {
	addDays,
	endOfDay,
	startOfDay,
	startOfMonth,
	endOfMonth,
	addMonths,
	startOfWeek,
	endOfWeek,
	isSameDay,
	differenceInCalendarDays,
	parse,
	format,
} from 'date-fns';

const defineds = {
	startOfWeek: startOfWeek(new Date()),
	endOfWeek: endOfWeek(new Date()),
	startOfLastWeek: startOfWeek(addDays(new Date(), -7)),
	endOfLastWeek: endOfWeek(addDays(new Date(), -7)),
	startOfToday: startOfDay(new Date()),
	endOfToday: endOfDay(new Date()),
	startOfYesterday: startOfDay(addDays(new Date(), -1)),
	endOfYesterday: endOfDay(addDays(new Date(), -1)),
	startOfMonth: startOfMonth(new Date()),
	endOfMonth: endOfMonth(new Date()),
	startOfLastMonth: startOfMonth(addMonths(new Date(), -1)),
	endOfLastMonth: endOfMonth(addMonths(new Date(), -1)),
};

const staticRangeHandler = {
	range: {},
	isSelected(range) {
		const definedRange = this.range();
		return isSameDay(range.startDate, definedRange.startDate) && isSameDay(range.endDate, definedRange.endDate);
	},
};

export function createStaticRanges(ranges) {
	return ranges.map((range) => ({ ...staticRangeHandler, ...range }));
}

export const defaultStaticRanges = createStaticRanges([
	{
		label: 'Today',
		range: () => ({
			endDate: defineds.startOfToday,
			startDate: defineds.endOfToday,
		}),
	},
	{
		label: 'Yesterday',
		range: () => ({
			endDate: defineds.startOfYesterday,
			startDate: defineds.endOfYesterday,
		}),
	},

	{
		label: 'Last 7 Days',
		range: () => ({
			endDate: new Date(),
			startDate: addDays(new Date(), -6),
		}),
	},
	{
		label: 'Last 14 Days',
		range: () => ({
			endDate: new Date(),
			startDate: addDays(new Date(), -13),
		}),
	},
	{
		label: 'Last 30 Days',
		range: () => ({
			endDate: new Date(),
			startDate: addDays(new Date(), -29),
		}),
	},
	{
		label: 'Last 60 Days',
		range: () => ({
			endDate: new Date(),
			startDate: addDays(new Date(), -59),
		}),
	},
]);

export const defaultInputRanges = [
	{
		label: 'days up to today',
		range(value) {
			return {
				startDate: addDays(defineds.startOfToday, (Math.max(Number(value), 1) - 1) * -1),
				endDate: defineds.endOfToday,
			};
		},
		getCurrentValue(range) {
			if (!isSameDay(range.endDate, defineds.endOfToday)) return '-';
			if (!range.startDate) return '∞';
			return differenceInCalendarDays(defineds.endOfToday, range.startDate) + 1;
		},
	},
];

export const formatDateTime = (value) => {
	const reqFormat = 'dd-MMM-yyyy, h:mm a';
	if (!_.isNull(value)) {
		const date = parse(value, "yyyy-MM-dd'T'HH:mm:ss.SSSSSSxxx", new Date());
		return format(date, reqFormat);
	}
	return format(new Date(), reqFormat);
};
