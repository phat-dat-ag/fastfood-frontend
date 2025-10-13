<script setup lang="ts">
import { ref, watch } from "vue";
import type { Category } from "../../../types/category.types";
import { ElTooltip } from "element-plus";

interface Props {
    categories: Category[];
}
const props = defineProps<Props>();
const emit = defineEmits(["select"]);

const selectedCategoryId = ref<number | null>(null);

function handleSelect(category: Category) {
    selectedCategoryId.value = category.id;
    emit("select", category);
}

const isSelected = (id: number) => selectedCategoryId.value === id;

watch(
    () => props.categories,
    (newCategories) => {
        if (newCategories.length > 0 && selectedCategoryId.value === null) {
            const firstCategory: Category = newCategories[0];
            selectedCategoryId.value = firstCategory.id;
            emit("select", firstCategory);
        }
    },
    { immediate: true }
)
</script>
<template>
    <div class="sticky top-0 z-50 bg-white shadow-sm border-b px-4 py-3">
        <div class="grid grid-cols-12 gap-3 justify-items-center">
            <div v-for="category in props.categories" :key="category.id"
                class="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                @click="handleSelect(category)">
                <ElTooltip class="box-item" effect="dark" :content="category.name" placement="left-start">
                    <img :src="category.imageUrl" alt="category" class="w-12 h-12 rounded-full object-cover border"
                        :class="{
                            'ring-2 ring-blue-500 ring-offset-2': isSelected(category.id),
                        }" />
                </ElTooltip>
            </div>
        </div>
    </div>
</template>
<style scoped>
.sticky {
    backdrop-filter: blur(8px);
}
</style>
