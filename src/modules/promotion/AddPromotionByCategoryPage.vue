<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category, CategoryDisplayResponse } from '../../types/category.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getDisplayableCategories } from '../../service/category.service';
import { CATEGORY_MESSAGES, PROMOTION_CATEGORY_MESSAGE } from '../../constants/messages';
import PromotionFormBase from './components/PromotionFormBase.vue';
import { toVietnamTimezoneISOString } from '../../utils/time.utils';
import type { PromotionCategoryCreateRequest } from '../../types/promotion.types';
import { createPromotionCategory } from '../../service/promotion.service';
import router from '../../router';

const categories = ref<Category[]>([]);

async function loadCategories() {
    await useApiHandler<CategoryDisplayResponse>(
        getDisplayableCategories,
        {
            loading: CATEGORY_MESSAGES.get,
            error: CATEGORY_MESSAGES.getError,
        },
        (data: CategoryDisplayResponse) => categories.value = data.displayableCategories,
    )
}

onMounted(loadCategories);

async function handleSubmitPromotionCategory(formValues: any) {
    const startAt = toVietnamTimezoneISOString(new Date(formValues.startAt), false);
    const endAt = toVietnamTimezoneISOString(new Date(formValues.endAt), true);

    const data: PromotionCategoryCreateRequest = {
        categoryId: formValues.id,
        type: formValues.type,
        value: formValues.value,
        startAt: startAt,
        endAt: endAt,
        quantity: formValues.quantity,
        maxDiscountAmount: formValues.maxDiscountAmount,
        minSpendAmount: 0,
        global: false,
        activated: formValues.isActivated,
        code: formValues.code,
    }

    await useApiHandler(
        () => createPromotionCategory(data),
        {
            loading: PROMOTION_CATEGORY_MESSAGE.create,
            success: PROMOTION_CATEGORY_MESSAGE.createSuccess,
            error: PROMOTION_CATEGORY_MESSAGE.createError,
        },
        () => { router.back() },
    )
}

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Thêm mã khuyến mãi cho danh mục
        </h2>
        <PromotionFormBase :showTargetSelect="true" selectLabel="Danh mục áp dụng" placeholderOption="Chọn danh mục"
            :options="categories" :onSubmit="handleSubmitPromotionCategory" />

    </div>
</template>