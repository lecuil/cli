import { createRouter, createWebHashHistory, type RouteRecordNormalized, type RouteRecordRaw } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { useSettingStore } from '@/store/modules/setting';

const modules: Record<string, any> = import.meta.glob('./modules/*.ts', { eager: true });
const defaultRoutes: Array<RouteRecordRaw> = [];

const routes = [
	{
		path: '/test',
		name: 'test',
		component: () => import('@/views/test/index.vue'),
	},
] as RouteRecordRaw[];

Object.keys(modules).forEach((key) => {
	const route = modules[key].default;
	if (Array.isArray(route)) routes.push(...route);
	else routes.push(route);
});

defaultRoutes.forEach((item) => {
	if (Array.isArray(item)) routes.push(...item);
	else routes.push(item);
});

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

const settingStore = useSettingStore();

export const getTitle = (name: string, routes: RouteRecordNormalized[]) => {
	const names: string[] = [];

	while (true) {
		names.push(name);
		const currentRouteObj = routes.find((item) => item.name === name);
		const parentRouterObj = routes.find((item) => item.name === currentRouteObj?.meta?.parentRouter);
		if (parentRouterObj) {
			name = parentRouterObj.name as string;
		} else {
			break;
		}
	}
	return names.reverse();
};

const handlerRouters = (currentRoute: string) => {
	const titles = getTitle(currentRoute, router.getRoutes());
	console.log(titles, 'titles');
	settingStore.setTitles(titles);
};

const noStatusPage = ['/login'];

router.beforeEach(async (to, from, next) => {
	NProgress.start();
	// const token = sessionStorage.getItem('userInfo');
	// const userIsLogin = !!token;
	// if (userIsLogin || noStatusPage.includes(to.path)) {
	//   next();
	// } else {
	//   next('/login');
	// }
	next();
	handlerRouters(to.name as string);
});

router.afterEach((to) => {
	NProgress.done();
});

export default router;

export type RouteMeta = {
	isShow: boolean;
	parentRouter?: string;
	title: string;
};
