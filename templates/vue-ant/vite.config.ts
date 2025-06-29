import { fileURLToPath, URL } from 'node:url';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ConfigEnv, defineConfig, loadEnv, UserConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import IconsResolver from 'unplugin-icons/resolver';
import ElementPlus from 'unplugin-element-plus/vite';
import Icons from 'unplugin-icons/vite';
import checker from 'vite-plugin-checker';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const root = process.cwd();
	// 获取环境变量
	const env = loadEnv(mode, root);
	console.log(env, 'env');
	const { VITE_SERVER_BASEURL } = env;
	return {
		plugins: [
			tsconfigPaths(),
			vue(),
			ElementPlus({}),
			AutoImport({
				imports: ['vue', 'vue-router', 'pinia'],
				eslintrc: {
					enabled: true,
				},
				resolvers: [IconsResolver()],
				dts: fileURLToPath(new URL('./types/auto-imports.d.ts', import.meta.url)),
			}),
			checker({ typescript: false }),
			Components({
				resolvers: [IconsResolver(), AntDesignVueResolver({ importStyle: false })],
				dts: fileURLToPath(new URL('./types/components.d.ts', import.meta.url)),
				dirs: fileURLToPath(new URL('./src/components', import.meta.url)),
			}),
			Icons({
				autoInstall: true,
			}),
		],
		server: {
			host: true,
			hmr: true,
			port: 5173,
			cors: true,
			proxy: {
				'/api1': {
					target: VITE_SERVER_BASEURL,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api1/, ''),
				},
			},
		},
		// resolve: {
		// 	alias: {
		// 		'@': fileURLToPath(new URL('./src', import.meta.url)),
		// 		'#': fileURLToPath(new URL('./types', import.meta.url)),
		// 	},
		// },
	};
});
