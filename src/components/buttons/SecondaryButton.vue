<script setup lang="ts">
const props = defineProps<{
    onClick: (data?: any) => void;
    label: string;
}>();
</script>
<template>
    <button type="button"
        class="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition duration-200 font-semibold"
        @click="props.onClick">
        {{ props.label }}
    </button>
</template>