<script setup lang="ts">
import type { VueElement } from "vue";

const router = useRouter()
const route = useRoute()
import type { MenuProps, ItemType } from 'ant-design-vue';

function getItem(
  label: VueElement | string,
  key: string,
  icon?: any,
  children?: ItemType[],
  type?: 'group',
): ItemType {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}

const menuList = router.options.routes[1].children!.filter((route) => route.meta?.isShow)


const items = computed(() => menuList.map((item) => {
  if (!item.children) return getItem(item.meta!.title as string, item.path, item.meta?.icon)
  return getItem(item.meta!.title as  string, item.path, item.meta?.icon, item.children.map((child) => {
    return getItem(child.meta!.title as  string, child.path, child.meta?.icon)
  }), 'group')
}))

const handleClick: MenuProps['onClick'] = e => {
  router.push(e.key as string);
};
const openKeys = ref<string[]>(['']);
const selectedKeys = computed(() => [route.path])
</script>

<template>
  <a-layout-sider width="200px" class="!bg-white">
    <a-menu
      id="dddddd"
      v-model:openKeys="openKeys"
      :selectedKeys="selectedKeys"
      style="width: 200px"
      mode="inline"
      :items="items"
      @click="handleClick"
    ></a-menu>
  </a-layout-sider>
</template>

<style scoped lang="scss"></style>
