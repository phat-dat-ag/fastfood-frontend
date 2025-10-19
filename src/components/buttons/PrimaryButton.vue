<script setup lang="ts">
const props = defineProps<{
    label: string;
    onClick?: () => void;
}>();
</script>
<template>
    <button
        class="w-full bg-orange-500 text-white font-semibold py-2.5 rounded-full shadow-md hover:bg-orange-600 transition-all duration-200 hover:shadow-lg active:scale-95"
        type="submit" @click="props.onClick?.()">
        {{ props.label }}
    </button>
</template>