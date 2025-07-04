/// <reference types="vite/client" />
declare module '*.vue' {
	import { DefineComponent } from 'vue';
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
	const component: DefineComponent<{}, {}, any>;
	export default component;
}

interface ImportMetaEnv {
	readonly VITE_SERVER_BASEURL: string;
	readonly VITE_APP_PROXY_PREFIX: string;
	readonly VITE_DELETE_CONSOLE: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
