<script setup lang="ts">
import { ElSwitch } from 'element-plus';
import { ref } from 'vue';
import type { SwitchResponse } from '../../types/switch-button.types';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const props = defineProps<{
    isActive: boolean;
    targetId: number;
}>();
const emit = defineEmits(["activate", "deactivate"]);

const isActiveValue = ref<boolean>(props.isActive);

async function onToggle() {
    const nextState = !isActiveValue.value;
    const payload: SwitchResponse = {
        isActive: nextState,
        targetId: props.targetId
    }

    const confirmMessage = nextState ? "Kích hoạt đối tượng này?" : "Hủy kích hoạt đối tượng này?";
    const confirmTitle = nextState ? "Xác nhận kích hoạt" : "Xác nhận hủy kích hoạt";

    const confirmed = await openConfirmDeleteMessage(confirmMessage, confirmTitle);
    if (!confirmed) return;

    isActiveValue.value = nextState;
    emit(nextState ? "activate" : "deactivate", payload);
}
</script>

<template>
    <ElSwitch :model-value="isActiveValue" class="ml-2"
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="Kích hoạt"
        @click="onToggle" />
</template>