const useOpenDialog = <T extends object>() => {
	const dialogRef = ref();

	const openDialog = (row: T = {} as T) => {
		dialogRef.value.open(row);
	};

	return {
		dialogRef,
		openDialog,
	};
};

export default useOpenDialog;
