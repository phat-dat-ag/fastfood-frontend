<script setup lang="ts">
import PrimaryButton from './buttons/PrimaryButton.vue';

interface Props {
    title: string;
    description: string;
    buttonLabel?: string;
    onClick?: () => void;
}

const props = defineProps<Props>();
</script>
<template>
    <div class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg">
        <div class="flex flex-col md:flex-row items-start justify-between gap-4">
            <div class="flex-1">
                <h1 class="text-3xl font-bold drop-shadow-md">{{ props.title }}</h1>
                <p class="text-white/90 mt-2">{{ props.description }}</p>
            </div>
            <div v-if="props.buttonLabel && onClick" class="w-[20%] mt-4 md:mt-0">
                <PrimaryButton :label="props.buttonLabel" :onClick="props.onClick" />
            </div>
        </div>
    </div>
</template>
