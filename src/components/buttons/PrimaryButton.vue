<script setup lang="ts">
const props = defineProps<{
    label: string;
    onClick?: () => void;
}>();
</script>
<template>
    <button class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold"
        type="submit" @click="props.onClick?.()">
        {{ props.label }}
    </button>
</template>