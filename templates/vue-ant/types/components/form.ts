import type { ModalProps } from 'ant-design-vue';
import type { FormItemProps, FormProps, Rule } from 'ant-design-vue/es/form';

export type FormConfig = {
	type: 'input' | 'textarea' | 'upload' | 'radio' | 'select' | 'password' | 'number' | 'slot' | 'datetime';
	options?: { label: string | number; value: string | boolean | number }[];
	max?: number;
	rows?: number;
	imgUrl?: string;
	size?: 'default' | 'small' | 'large';
	props?: FormItemProps;
};

export type DialogFormProps = {
	formConfig: FormConfig[];
	title?: string;
	formProps?: FormProps;
	dialogProps?: ModalProps;
};

export type FormRules<T> = {
	[K in keyof Partial<T>]: Rule[];
};
