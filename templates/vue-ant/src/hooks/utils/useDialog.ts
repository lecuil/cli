/**
 * 弹框hook
 * @returns
 */
export const useDialog = <T extends object>(defaultData: T) => {
	const visible = ref(false);
	const formData = ref<T>({} as T);
	const loading = ref(false);

	const cancel = () => {
		visible.value = false;
	};

	const open = (row: T) => {
		visible.value = true;
	};

	return {
		cancel,
		visible,
		formData,
		open,
		loading,
	};
};
