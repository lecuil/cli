/**
 * 校验中文
 * @param rule
 * @param value
 */
export const validateNoChinese = (rule: any, value: string) => {
	const hasChinese = /[\u4e00-\u9fa5]/.test(value);
	if (hasChinese) {
		return Promise.reject('输入不能包含中文字符');
	} else {
		return Promise.resolve();
	}
};

/**
 * 校验正整数
 * @param _
 * @param value
 */
export const validatePositiveInteger = (_: any, value: string | number) => {
	value = Number(value);
	if (!Number.isInteger(value) || value < 0) return Promise.reject('请输入正整数');
	else return Promise.resolve();
};
