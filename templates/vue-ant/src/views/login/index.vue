<script setup lang="ts">
import { useUserStore } from '@/store/modules/user';
import type { FormRules } from '#/components/form';
import type { LoginBody } from '@/api/user/type';

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);


const userInfo = reactive({
	userName: 'admin',
	password: 'admin@123',
});

const rules: FormRules<LoginBody> = {
	userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
	password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
const userLogin = () => {
	loading.value = true;
	userStore
		.storeUserLogin(userInfo)
		.then(() => {
			router.push('/');
		})
		.catch((e) => {
			console.log('登录失败', e);
		})
		.finally(() => {
			loading.value = false;
		});
};

const layout = {
	labelCol: { span: 5 },
	wrapperCol: { span: 19 },
};
</script>

<template>
	<div class="login-box">
		<div class="login-form">
			<h2>登录</h2>
			<a-form :model="userInfo" v-bind="layout" :rules="rules" center @submit="userLogin">
				<a-form-item label="用户名" name="userName">
					<a-input
						v-model:value="userInfo.userName"
						placeholder="请输入用户名"
						:disabled="loading"
						autocomplete="off"></a-input>
				</a-form-item>
				<a-form-item label="密码" name="password">
					<a-input
						v-model:value="userInfo.password"
						type="password"
						:disabled="loading"
						placeholder="请输入密码"
						autocomplete="off"></a-input>
				</a-form-item>
				<a-form-item :wrapper-col="{ span: 14, offset: 5 }">
					<a-button type="primary" html-type="submit" :loading="loading">登录</a-button>
				</a-form-item>
			</a-form>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.login-box {
	@apply flex items-center justify-center h-screen bg-slate-50;
	.login-form {
		@apply p-5 w-[400px] bg-white rounded-xl;
		box-shadow: 0 0 10px 0 rgb(0 0 0 / 10%);
		h2 {
			@apply mb-5 text-center font-bold text-lg;
		}
	}
}
</style>
