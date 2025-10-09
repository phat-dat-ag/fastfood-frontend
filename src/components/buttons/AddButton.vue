<script setup lang="ts">
const props = defineProps<{
    onClick: () => void;
    label: string;
}>();
</script>
<template>
    <button type="button"
        class="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 font-semibold"
        @click="props.onClick">
        {{ props.label }}
    </button>
</template>