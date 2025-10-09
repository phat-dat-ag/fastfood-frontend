<script setup lang="ts">
const props = defineProps<{
    onClick: (data: any) => void;
    label: string;
}>();
</script>
<template>
    <button type="button"
        class="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition duration-200 font-semibold"
        @click="props.onClick">
        {{ props.label }}
    </button>
</template>