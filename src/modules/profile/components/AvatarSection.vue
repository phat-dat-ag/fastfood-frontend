<script setup lang="ts">
import { ElAvatar } from 'element-plus';

const props = defineProps<{
    avatarImage: string;
    avatarFile: File | null;
    onImageChange: (e: Event) => void;
}>();

const emit = defineEmits(["update-avatar"]);

</script>
<template>
    <div
        class="bg-white/90 shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
        <div class="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3">
            <h2 class="text-white text-lg font-semibold tracking-wide">Ảnh đại diện</h2>
        </div>

        <div class="flex flex-col md:flex-row items-center gap-8 p-6">
            <div class="flex flex-col items-center gap-3">
                <ElAvatar :size="120" :src="props.avatarImage" alt="Ảnh đại diện"
                    class="shadow-md border-2 border-orange-300 hover:scale-105 transition-transform duration-300" />
            </div>

            <div class="flex flex-col gap-3 text-gray-700">
                <h3 class="font-semibold text-lg">Cập nhật ảnh đại diện</h3>
                <input ref="fileInputRef" type="file" accept="image/*" @change="props.onImageChange" class="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-orange-100 file:text-orange-600 hover:file:bg-orange-200 transition" />
                <button v-if="props.avatarFile"
                    class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all duration-300"
                    @click="emit('update-avatar')">
                    Cập nhật
                </button>
            </div>
        </div>
    </div>
</template>