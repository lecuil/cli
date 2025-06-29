<script setup lang="ts">
import { useSettingStore } from '@/store/modules/setting';
import LayoutTabs from '@/views/layout/components/layout-tabs.vue';

const settingStore = useSettingStore();
const route = useRoute();
</script>

<template>
	<a-layout-content class="p-2 flex flex-col">
		<a-breadcrumb class="mb-2" separator=">">
			<a-breadcrumb-item v-for="(item, index) in settingStore.titles" :key="index">
				<router-link v-if="index !== settingStore.titles.length - 1" :to="{ name: item }">
					{{ item }}
				</router-link>
				<span v-else>{{ item }}</span>
			</a-breadcrumb-item>
		</a-breadcrumb>
		<layout-tabs />

		<div class="view-main">
			<router-view v-slot="{ Component }">
				<transition name="fade">
					<keep-alive :max="10">
						<component :is="Component" :key="route.fullPath" />
					</keep-alive>
				</transition>
			</router-view>
		</div>
	</a-layout-content>
</template>

<style scoped lang="scss">
.view-main {
	@apply overflow-y-auto h-full;
}
</style>
