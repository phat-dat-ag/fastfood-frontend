<script setup lang="ts">
import { ElInputNumber } from 'element-plus';
interface NumberInputProps {
    value: number;
    min: number;
    max: number;
    step: number;
}
const props = defineProps<NumberInputProps>();
const emit = defineEmits(["quantity-change"]);

function onChange(value?: number) {
    if (value != null)
        emit("quantity-change", value);
}
</script>

<template>
    <div class="py-2 flex justify-center">
        <ElInputNumber :model-value="props.value" :min="props.min" :max="props.max" :step="props.step"
            @update:model-value="onChange" />
    </div>
</template>