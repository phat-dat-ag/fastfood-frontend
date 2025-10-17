<script setup lang="ts">
import PromotionForm from './components/PromotionForm.vue';

</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Thêm mã khuyến mãi cho đơn hàng
        </h2>
        <PromotionForm :isPromotionCategory=false selectLabel="Áp dụng cho đơn hàng" placeholderOption="Chọn đơn hàng"
            :options="[]" />
    </div>
</template>