<script setup lang="ts">
import { ElInputNumber } from 'element-plus';
import { ref } from 'vue';
interface NumberInputProps {
    initialValue?: number;
    min: number;
    max: number;
    step: number;
}
const props = defineProps<NumberInputProps>();
const emit = defineEmits(["quantity-change"]);

const num = ref<number>(props.initialValue ? props.initialValue : 0);

function onChange(value: number | undefined) {
    if (value)
        emit("quantity-change", value);
}
</script>

<template>
    <div class="py-2 flex justify-center">
        <ElInputNumber v-model="num" :min="props.min" :max="props.max" :step="props.step" @change="onChange" />
    </div>
</template>