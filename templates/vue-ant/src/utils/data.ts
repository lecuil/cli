/**
 * 判断一个数据是否空 (null, undefined, '', 0, false)
 * @param item
 * @returns {boolean}
 */
export const isEmpty = (item: any): boolean => {
	return item === '' || item === null || item === undefined || item.length === 2;
};

/**
 * 获取当前传递给服务器的query搜索信息
 * @param {*} data
 * @returns
 */
export const getSearchInfo = <T extends { [s: string]: unknown }>(data: T): Partial<T> => {
	const search = {};
	for (const [k, v] of Object.entries(data)) {
		v !== '' && v !== null && Object.assign(search, { [k]: v });
	}
	return search;
};

/**
 * 将对象转换为FormData
 * @param data
 * @returns
 */
export const getUploadFormData = (data: Record<string, any>) => {
	const fd = new FormData();
	for (const key of Object.keys(data)) {
		fd.append(key, data[key]);
	}
	return fd;
};

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export const objIsEmpty = (obj: Record<string, any>) => Reflect.ownKeys(obj).length === 0;

/**
 * 对数组对象指定key去重
 * @param arr1
 * @param arr2
 * @param key
 * @returns
 */
export const onlyKeyArrConcat = <T extends object, U extends keyof T>(arr1: T[], arr2: T[], key: U) => {
	const map = new Map();
	[...arr1, ...arr2].forEach((item) => {
		map.set(item[key], item);
	});
	return Array.from(map.values());
};
