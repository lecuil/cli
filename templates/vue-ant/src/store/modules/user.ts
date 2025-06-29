import { userLogin } from '@/api/user';
import type { LoginBody } from '@/api/user/type';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore(
	'userInfo',
	() => {
		const username = ref('');
		const token = ref('');
		const roles = ref(['']);

		const storeUserLogin = async (loginData: LoginBody) => {
			const { data } = await userLogin(loginData);
			token.value = data;
		};

		const setToken = (value: string) => {
			token.value = value;
		};

		const isLogin = computed(() => !!token.value);

		return {
			username,
			roles,
			token,
			storeUserLogin,
			isLogin,
			setToken,
		};
	},
	{
		persist: {
			key: 'userInfo',
			storage: sessionStorage,
			paths: ['token'],
		},
	},
);
