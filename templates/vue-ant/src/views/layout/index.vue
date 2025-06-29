<script setup lang="ts">
import LayoutHeader from './components/layout-header.vue';
import LayoutAside from '@/views/layout/components/layout-aside.vue';
import LayoutMain from '@/views/layout/components/layout-main.vue';
</script>

<template>
	<a-layout class="h-screen">
		<a-layout-header class="!bg-white !px-0">
			<layout-header></layout-header>
		</a-layout-header>
		<a-layout class="h-full flex-1">
			<layout-aside />
			<layout-main />
		</a-layout>
	</a-layout>
</template>

<style lang="scss" scoped></style>
