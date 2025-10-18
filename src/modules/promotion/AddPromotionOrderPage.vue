<script setup lang="ts">
import { useApiHandler } from '../../composables/useApiHandler';
import { PROMOTION_ORDER_MESSAGE } from '../../constants/messages';
import router from '../../router';
import { createPromotionOrder } from '../../service/promotion.service';
import type { PromotionOrderCreateRequest } from '../../types/promotion.types';
import { toVietnamTimezoneISOString } from '../../utils/time.utils';
import PromotionFormBase from './components/PromotionFormBase.vue';

async function handleSubmitPromotionOrder(formValues: any) {
    const startAt = toVietnamTimezoneISOString(new Date(formValues.startAt), false);
    const endAt = toVietnamTimezoneISOString(new Date(formValues.endAt), true);

    const data: PromotionOrderCreateRequest = {
        type: formValues.type,
        value: formValues.value,
        startAt: startAt,
        endAt: endAt,
        quantity: formValues.quantity,
        maxDiscountAmount: formValues.maxDiscountAmount,
        minSpendAmount: formValues.minSpendAmount,
        isGlobal: true,
        isActivated: formValues.isActivated,
        code: formValues.code,
    }

    await useApiHandler(
        () => createPromotionOrder(data),
        {
            loading: PROMOTION_ORDER_MESSAGE.create,
            success: PROMOTION_ORDER_MESSAGE.createSuccess,
            error: PROMOTION_ORDER_MESSAGE.createError,
        },
        () => { router.back() },
    )
}

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Thêm mã khuyến mãi cho đơn hàng
        </h2>
        <PromotionFormBase :isGlobal="true" :showTargetSelect="false" :onSubmit="handleSubmitPromotionOrder" />
    </div>
</template>