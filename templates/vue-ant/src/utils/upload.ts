/**
 * 是否允许上传文件类型
 * @param allowTypes
 * @param file
 * @returns
 */
export const allowFileType = (allowTypes: string[], file: File) => {
	return allowTypes.includes(file.type);
};

/**
 * @description 生成表单数据
 * @param data
 * @returns
 */
export const getFormData = (data: object) => {
	const fd = new FormData();
	for (const [k, v] of Object.entries(data)) {
		fd.append(k, v);
	}
	return fd;
};
