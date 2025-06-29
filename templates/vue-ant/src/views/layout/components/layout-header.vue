<script setup lang="ts">
import { UserOutlined, SettingOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/modules/user';
const showSetting = ref(false);
const userStore = useUserStore();
const router = useRouter();

const handerSetting = () => {
	showSetting.value = !showSetting.value;
};
const logout = () => {
	sessionStorage.removeItem('userInfo');
	router.push('/login');
};
</script>

<template>
	<div class="header">
		<div class="flex items-center font-bold text-xl">管理系统</div>
		<div class="flex-grow"></div>
		<div class="flex-center flex items-center">
			<UserOutlined />
			<div>
				{{ userStore.username }}
			</div>
		</div>
		<div class="setting" @click="handerSetting">
			<SettingOutlined />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.header {
	display: flex;
	padding: 0 15px;
	width: 100%;
	height: 60px;
	box-shadow: 0 0 20px rgb(195 223 252 / 40%);

	.setting {
		@apply flex justify-center items-center cursor-pointer ml-2;
	}
}

.setting-header {
	@apply flex items-center justify-between;
}

.logout {
	@apply flex justify-center pt-4;
}
</style>
