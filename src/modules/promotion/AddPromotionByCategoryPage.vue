<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category } from '../../types/category.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getCategories } from '../../service/category.service';
import { CATEGORY_MESSAGES } from '../../constants/messages';
import PromotionForm from './components/PromotionForm.vue';

const categories = ref<Category[]>([]);

async function loadCategories() {
    await useApiHandler<Category[]>(
        getCategories,
        {
            loading: CATEGORY_MESSAGES.get,
            error: CATEGORY_MESSAGES.getError,
        },
        (data: Category[]) => categories.value = data,
    )
}

onMounted(loadCategories);

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Thêm mã khuyến mãi cho danh mục
        </h2>
        <PromotionForm :categories="categories" />
    </div>
</template>