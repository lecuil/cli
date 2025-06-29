import { Modal } from 'ant-design-vue';
import { createVNode } from 'vue';
import { ExclamationOutlined } from '@ant-design/icons-vue';

/**
 *  确认弹框
 * @param onConfirm
 * @param callback
 * @param title
 * @param message
 * @param type
 * @param cancel
 */
export const myConfirm = (
	{
		onConfirm,
		title = '提示',
		message,
	}: { message: string; title?: string; type?: string; onConfirm: (...args: any[]) => any },
	cancel = () => {},
) => {
	Modal.confirm({
		title,
		content: message,
		okText: '确认',
		cancelText: '取消',
		onOk: onConfirm,
		onCancel: cancel,
		icon: createVNode(ExclamationOutlined),
	});
};
