<script setup lang="ts">
const props = defineProps<{
    onClick: (data?: any) => void;
    label: string;
}>();
</script>
<template>
    <button type="button"
        class="w-full bg-white text-orange-500 font-semibold py-2.5 rounded-full border border-orange-400 hover:bg-orange-50 transition-all duration-200 active:scale-95"
        @click="props.onClick">
        {{ props.label }}
    </button>
</template>