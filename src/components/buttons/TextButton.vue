<script setup lang="ts">
const props = defineProps<{
    onClick: () => void;
    label: string;
}>();
</script>
<template>
    <button type="button" class="hover:underline hover:text-blue-500" @click="props.onClick">
        {{ props.label }}
    </button>
</template>