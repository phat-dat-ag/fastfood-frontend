<script setup lang="ts">
const props = defineProps<{
    onClick: () => void;
    label: string;
}>();
</script>
<template>
    <button type="button"
        class="text-orange-500 font-semibold hover:underline hover:text-orange-600 transition-colors duration-200 cursor-pointer"
        @click="props.onClick">
        {{ props.label }}
    </button>
</template>