<script setup lang="ts">
import { ref, watch } from "vue";
import type { Category } from "../../../types/category.types";

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
    <div
        class="sticky top-[72px] z-40 bg-gradient-to-r from-white via-gray-50 to-white backdrop-blur-md shadow-md px-2 py-2 border-b border-gray-200">

        <div class="max-w-[1200px] mx-auto overflow-x-auto scrollbar-hide">
            <div class="pt-3 flex gap-4 justify-start w-max snap-x snap-mandatory">
                <div v-for="category in props.categories" :key="category.id"
                    class="flex flex-col items-center group cursor-pointer transition-all duration-300 snap-start"
                    @click="handleSelect(category)">
                    <div class="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white transition-all duration-300"
                        :class="{
                            'ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110': isSelected(category.id),
                            'hover:ring-1 hover:ring-blue-300': !isSelected(category.id)
                        }">
                        <img :src="category.imageUrl" alt="category" class="w-11 h-11 object-cover rounded-full" />
                    </div>
                    <span
                        class="mt-2 text-[13px] font-medium text-gray-700 group-hover:text-blue-500 transition-colors duration-300 truncate w-20 text-center">
                        {{ category.name }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.sticky {
    backdrop-filter: blur(8px);
}
</style>