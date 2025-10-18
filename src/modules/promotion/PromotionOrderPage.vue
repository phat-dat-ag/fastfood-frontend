<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import PromotionOrderTable from './components/PromotionOrderTable.vue';
import type { Promotion, PromotionResponse } from '../../types/promotion.types';
import { deletePromotion, getPromotionOrder } from '../../service/promotion.service';
import { PROMOTION_ORDER_MESSAGE } from '../../constants/messages';
import { useApiHandler } from '../../composables/useApiHandler';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const filterOptions: Filter[] = [
    { label: 'Thêm gần đây', value: 'recently-added' },
    { label: 'Cập nhật gần đây', value: 'recently-updated' },
    { label: 'Đang khuyến mãi', value: 'with-promotion' },
    { label: 'Đang không được khuyến mãi', value: 'no-promotion' },
];

const activeFilters = ref<any[]>([]);

function handleFilterChange(filters: any[]) {
    activeFilters.value = filters;
    console.log(activeFilters.value);
}

const search = ref<string>("");

function handleSearchChange(searchText: string) {
    search.value = searchText;
    console.log(search.value);
}

const promotions = ref<Promotion[]>([]);

async function loadPromotions() {
    await useApiHandler<PromotionResponse>(
        getPromotionOrder,
        {
            loading: PROMOTION_ORDER_MESSAGE.get,
            error: PROMOTION_ORDER_MESSAGE.getError,
        },
        (data: PromotionResponse) => promotions.value = data.promotions,
    )
}
onMounted(loadPromotions);

async function handleDeletePromotionOrder(promotionId: number) {
    const confirmed: boolean = await openConfirmDeleteMessage("Bạn thực sự muốn xóa khuyến mãi cho đơn hàng này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deletePromotion(promotionId),
        {
            loading: PROMOTION_ORDER_MESSAGE.delete,
            success: PROMOTION_ORDER_MESSAGE.deleteSuccess,
            error: PROMOTION_ORDER_MESSAGE.deleteError,
        },
        () => { },
        loadPromotions,
    )
}

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý mã khuyến mãi cho đơn hàng
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <PromotionOrderTable :promotions="promotions" :handleDeletePromotionOrder="handleDeletePromotionOrder" />
    </div>
</template>