import type { RouteRecordRaw } from 'vue-router';

export default {
	path: '/',
	name: 'Layout',
	redirect: '/',
	component: () => import('@/views/layout/index.vue'),
	meta: {},
	children: [],
} as RouteRecordRaw;
