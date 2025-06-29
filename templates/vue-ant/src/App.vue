<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useUserStore } from '@/store/modules/user';

const userStore = useUserStore();
const router = useRouter();

const handleMessage = (event: MessageEvent) => {
	if (event.data.token) {
		userStore.setToken(event.data.token);
		window.removeEventListener('message', handleMessage);
		router.push('/');
	}
};

onMounted(() => {
	window.addEventListener('message', handleMessage);
});
</script>

<template>
	<router-view></router-view>
</template>

<style lang="scss"></style>
