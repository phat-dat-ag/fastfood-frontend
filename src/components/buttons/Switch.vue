<script setup lang="ts">
import { ElSwitch } from 'element-plus';
import { ref } from 'vue';
import type { SwitchResponse } from '../../types/switch-button.types';

const props = defineProps<{
    isActive: boolean;
    targetId: number;
}>();
const emit = defineEmits(["status-change"]);

const isActiveValue = ref<boolean>(props.isActive);

function onActiveChange() {
    const payload: SwitchResponse = {
        isActive: isActiveValue.value,
        targetId: props.targetId
    }
    emit("status-change", payload);
}
</script>

<template>
    <ElSwitch v-model="isActiveValue" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
        active-text="Kích hoạt" @change="onActiveChange" />
</template>