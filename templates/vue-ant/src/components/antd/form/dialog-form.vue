<script setup lang="ts">
import type { DialogFormProps } from '#/components/form';

const visible = ref(false);
const formRef = ref();

const props = withDefaults(defineProps<DialogFormProps>(), {});
const model = ref<Record<string, any>>({});

const emit = defineEmits(['onSubmit', 'onCancel', 'changeImg']); // 父组件事件
const onSubmit = () => {
	console.log(model.value);
	formRef.value
		.validate()
		.then(() => {
			emit('onSubmit', model.value);
		})
		.catch((error: string) => {
			console.log('error', error);
		});
};
const onCancel = () => {
	visible.value = false;
	emit('onCancel');
	formRef.value.resetFields();
};

const open = (data: any) => {
	model.value = data;
	visible.value = true;
};

const close = () => {
	visible.value = false;
	formRef.value.resetFields();
};

defineExpose({ open, close });
</script>

<template>
	<a-modal
		v-model:open="visible"
		:title="`${model.id ? '编辑' : '新增'}${title}`"
		cancel-text="取消"
		ok-text="确认"
		:closable="!formProps?.disabled"
		:cancelButtonProps="{ disabled: formProps?.disabled }"
		:mask-closable="false"
		:confirm-loading="formProps?.disabled"
		v-bind="dialogProps"
		@ok="onSubmit"
		@cancel="onCancel"
		wrapClassName="dialog-form">
		<a-form ref="formRef" v-bind="formProps" :model="model" @submit="onSubmit">
			<a-form-item
				v-for="item in formConfig"
				:key="item.props?.label"
				v-bind="item.props"
				:label="item.props!.label + '：'">
				<!-- 输入框 -->
				<a-input
					v-if="item.type === 'input'"
					v-model:value="model[item.props?.name as string]"
					:placeholder="`请输入${item.props!.label}`"></a-input>
				<!-- 密码框 -->
				<a-input
					v-if="item.type === 'password'"
					v-model:value="model[item.props?.name as string]"
					:placeholder="`请输入${item.props!.label}`"></a-input>
				<a-input-number
					class="!w-full"
					v-if="item.type === 'number'"
					v-model:value="model[item.props?.name as string]"
					:placeholder="`请输入${item.props!.label}`" />
				<!-- 选择框 -->
				<a-select
					v-if="item.type === 'select'"
					v-model:value="model[item.props?.name as string]"
					:placeholder="`请选择${item.props!.label}`">
					<a-select-option v-for="option in item.options" :key="option.value" :value="option.value">
						{{ option.label }}
					</a-select-option>
				</a-select>
				<!--      &lt;!&ndash; 上传图片 &ndash;&gt;-->
				<!--      <a-upload-->
				<!--        v-if="item.type === 'upload'"-->
				<!--        :show-upload-list="false"-->
				<!--        :before-upload="() => false"-->
				<!--        :on-change="file => handleChangeImg(file, item.model)"-->
				<!--      >-->
				<!--        <a-button>-->
				<!--          <a-icon type="upload" /> 上传图片-->
				<!--        </a-button>-->
				<!--      </a-upload>-->
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<style lang="scss">
.dialog-form {
	.ant-modal-title {
		@apply text-center;
	}
}
</style>
