import dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as duration from 'dayjs/plugin/duration';

dayjs.extend(relativeTime.default);
dayjs.extend(duration.default);
dayjs.locale('zh-cn', {
	relativeTime: {
		future: '%s内',
		past: '%s前',
		s: '几秒',
		m: '1分钟',
		mm: '%d分钟',
		h: '1小时',
		hh: '%d小时',
		d: '1天',
		dd: '%d天',
		M: '1个月',
		MM: '%d个月',
		y: '1年',
		yy: '%d年',
	},
});

type DateType = string | number | Date;

/**
 * 获取时间差
 * @param date
 * @returns {string}
 */
export const getAgo = (date: DateType) => dayjs(date).fromNow();

/**
 * 格式化时间
 * @param date
 * @param format
 */
export const formatDate = (date: DateType, format: string) => dayjs(date).format(format);

/**
 * 获取时间是否是当前时间之前
 * @param date
 * @param compare
 */
export const isAfter = (date: DateType, compare: DateType = Date.now()) => dayjs(date).isAfter(dayjs(compare));
