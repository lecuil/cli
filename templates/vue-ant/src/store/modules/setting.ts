import { defineStore } from 'pinia';
import pinia from '@/store';
import type { LocationQueryRaw, RouteParamsGeneric } from 'vue-router';

type BreadcrumbItem = {
	title: string;
	params?: RouteParamsGeneric;
	query?: LocationQueryRaw;
	path?: string;
};

export const useSettingStoreHook = defineStore('settingStore', () => {
	const titles = ref<string[]>([]);
	const visitedView = ref<{ title: string }[]>([]);
	const breadcrumbList = ref<BreadcrumbItem[]>([]);

	const setTitles = (title: string[]) => {
		titles.value = title;
	};

	return {
		titles,
		setTitles,
		visitedView,
	};
});

export const useSettingStore = () => useSettingStoreHook(pinia);
