<script setup lang="ts">
// @ts-nocheck

import { emitter } from '@/utils/bus';
import type { RouteMeta } from '@/router';

type RouteItem = {
	fullPath: string;
	hash: string;
	matched: any[];
	meta: RouteMeta;
	name: string;
	params: Record<string, string>;
	path: string;
	query: Record<string, string>;
};

type TabItem = Pick<RouteItem, 'name' | 'meta' | 'query' | 'params'>;

const route = useRoute();
const router = useRouter();

const getFmtString = (item: TabItem) => {
	return item.name + JSON.stringify(item.query) + JSON.stringify(item.params);
};

const histories = ref<TabItem[]>([]);
const activeValue = ref('');
const contextMenuVisible = ref(false);

const left = ref(0);
const top = ref(0);
const isCollapse = ref(false);
const isMobile = ref(false);
const rightActive = ref('');
const openContextMenu = (e: MouseEvent) => {
	if (histories.value.length === 1) return false;
	let id = '';
	if (e.target!.nodeName === 'SPAN') id = e.target!.offsetParent.id;
	else id = e.target.id;

	if (id) {
		contextMenuVisible.value = true;
		left.value = e.clientX;
		top.value = e.clientY + 10;
		rightActive.value = id.substring(14);
	}
};

const closeLeft = () => {
	let right: TabItem;
	const rightIndex = histories.value.findIndex((item) => {
		if (getFmtString(item) === rightActive.value) {
			right = item;
		}
		return getFmtString(item) === rightActive.value;
	});
	const activeIndex = histories.value.findIndex((item) => getFmtString(item) === activeValue.value);
	histories.value.splice(0, rightIndex);
	if (rightIndex > activeIndex) {
		router.push(right!);
	}
	sessionStorage.setItem('histories', JSON.stringify(histories.value));
};
const closeRight = () => {
	let right: TabItem;
	const leftIndex = histories.value.findIndex((item) => {
		if (getFmtString(item) === rightActive.value) {
			right = item;
		}
		return getFmtString(item) === rightActive.value;
	});
	const activeIndex = histories.value.findIndex((item) => getFmtString(item) === activeValue.value);
	histories.value.splice(leftIndex + 1, histories.value.length);
	if (leftIndex < activeIndex) {
		router.push(right!);
	}
	sessionStorage.setItem('histories', JSON.stringify(histories.value));
};

const closeOther = () => {
	let right: TabItem;
	histories.value = histories.value.filter((item) => {
		if (getFmtString(item) === rightActive.value) {
			right = item;
		}
		return getFmtString(item) === rightActive.value;
	});

	router.push(right!);
	sessionStorage.setItem('histories', JSON.stringify(histories.value));
};
const isSame = (route1: TabItem, route2: TabItem) => {
	if (route1.name !== route2.name) {
		return false;
	}
	if (
		Object.keys(route1.query).length !== Object.keys(route2.query).length ||
		Object.keys(route1.params).length !== Object.keys(route2.params).length
	) {
		return false;
	}
	for (const key in route1.query) {
		if (route1.query[key] !== route2.query[key]) {
			return false;
		}
	}
	for (const key in route1.params) {
		if (route1.params[key] !== route2.params[key]) {
			return false;
		}
	}
	return true;
};

const setTab = (route: RouteItem) => {
	if (!histories.value.some((item) => isSame(item, route))) {
		const obj = {
			name: route.name,
			meta: { ...route.meta },
			query: route.query,
			params: route.params,
		};
		histories.value.push(obj);
	}
	window.sessionStorage.setItem('activeValue', getFmtString(route));
};

const historyMap = ref<Record<string, TabItem>>({});

const removeTab = (tab) => {
	const index = histories.value.findIndex((item) => getFmtString(item) === tab);
	if (getFmtString(route) === tab) {
		if (histories.value.length === 1) return;
		if (index < histories.value.length - 1) {
			router.push({
				name: histories.value[index + 1].name,
				query: histories.value[index + 1].query,
				params: histories.value[index + 1].params,
			});
		} else {
			router.push({
				name: histories.value[index - 1].name,
				query: histories.value[index - 1].query,
				params: histories.value[index - 1].params,
			});
		}
	}
	histories.value.splice(index, 1);
};

watch(
	() => contextMenuVisible.value,
	() => {
		if (contextMenuVisible.value) {
			document.body.addEventListener('click', () => {
				contextMenuVisible.value = false;
			});
		} else {
			document.body.removeEventListener('click', () => {
				contextMenuVisible.value = false;
			});
		}
	},
);

watch(
	() => route,
	(to, now) => {
		if (to.name === 'Login' || to.name === 'Reload') return;
		histories.value = histories.value.filter((item) => !item.meta.closeTab);
		setTab(to);
		sessionStorage.setItem('histories', JSON.stringify(histories.value));
		activeValue.value = window.sessionStorage.getItem('activeValue');
	},
	{ deep: true },
);

watch(
	() => histories.value,
	() => {
		sessionStorage.setItem('histories', JSON.stringify(histories.value));
		historyMap.value = {};
		histories.value.forEach((item) => {
			historyMap.value[getFmtString(item)] = item;
		});
		emitter.emit('setKeepAlive', histories.value);
	},
	{
		deep: true,
	},
);

const initPage = () => {
	// 全局监听 关闭当前页面函数
	emitter.on('closeThisPage', () => {
		removeTab(getFmtString(route));
	});
	emitter.on('mobile', (data) => {
		isMobile.value = data;
	});
	emitter.on('collapse', (data) => {
		isCollapse.value = data;
	});

	emitter.on('setQuery', (data) => {
		const index = histories.value.findIndex((item) => getFmtString(item) === activeValue.value);
		histories.value[index].query = data;
		activeValue.value = getFmtString(histories.value[index]);
		const currentUrl = window.location.href.split('?')[0];
		const currentSearchParams = new URLSearchParams(data).toString();
		window.history.replaceState({}, '', `${currentUrl}?${currentSearchParams}`);
		sessionStorage.setItem('histories', JSON.stringify(histories.value));
	});

	emitter.on('switchTab', async (data) => {
		const index = histories.value.findIndex((item) => item.name === data.name);
		if (index < 0) {
			return;
		}
		for (const key in data.query) {
			data.query[key] = String(data.query[key]);
		}
		for (const key in data.params) {
			data.params[key] = String(data.params[key]);
		}

		histories.value[index].query = data.query || {};
		histories.value[index].params = data.params || {};
		await nextTick();
		router.push(histories.value[index]);
	});
	const inithistories = [];
	setTab(route);
	histories.value = JSON.parse(sessionStorage.getItem('histories')) || inithistories;
	if (!window.sessionStorage.getItem('activeValue')) {
		activeValue.value = getFmtString(route);
	} else {
		activeValue.value = window.sessionStorage.getItem('activeValue');
	}
};
initPage();

onUnmounted(() => {
	emitter.off('collapse');
	emitter.off('mobile');
});
const testClick = (targetKey: string) => {
	const tab = historyMap.value[targetKey];
	router.push({
		name: tab.name,
		query: tab.query,
		params: tab.params,
	});
};
const onEdit = (targetKey: string | MouseEvent, action: string) => {
	if (action !== 'remove') return;
	removeTab(targetKey);
};
</script>

<template>
	<div class="layout-tabs">
		<a-tabs
			type="editable-card"
			@tabClick="testClick"
			hide-add
			@contextmenu.prevent="openContextMenu($event)"
			v-model:activeKey="activeValue"
			@edit="onEdit">
			<a-tab-pane
				v-for="item in histories"
				:key="getFmtString(item)"
				:tab="item.meta.title"
				:closable="histories.length !== 1">
			</a-tab-pane>
		</a-tabs>

		<!--自定义右键菜单html代码-->
		<a-menu v-show="contextMenuVisible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
			<a-menu-item key="1" @click="closeLeft">关闭左侧</a-menu-item>
			<a-menu-item key="2" @click="closeRight">关闭右侧</a-menu-item>
			<a-menu-item key="3" @click="closeOther">关闭其他</a-menu-item>
		</a-menu>
	</div>
</template>
<style lang="scss" scoped>
.contextmenu {
	@apply bg-white dark:bg-slate-900 m-0 px-0 border border-gray-200 w-fit text-xs shadow-md rounded absolute z-50 border-solid dark:border-slate-800;
	::v-deep(.ant-menu-item) {
		@apply px-2 w-fit;
	}
}

$base-tag-item-height: 4rem;
</style>
