import axios from 'axios';


/**
 * 获取服务器图片的名称
 * @param {String} fileUrl
 * @returns
 */
export const getFileName = (fileUrl: string) => {
	return fileUrl.substring(fileUrl.lastIndexOf('\\') + 1);
};

/**
 * 将网络图片转为本地图片
 * @param {*} url
 * @param {*} fileName
 * @returns
 */
export const imageUrlToFile = async (url: string, fileName: string) => {
	const name = getFileName(fileName);
	const res = await axios.get(url, { responseType: 'arraybuffer' });
	const blob = new Blob([res.data], { type: res.headers['content-type'] });
	return new File([blob], name, { type: blob.type });
};

