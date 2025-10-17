<script setup lang="ts">
import { useRouter } from 'vue-router';
import AddButton from '../../../components/buttons/AddButton.vue';
import { ROUTE_NAMES } from '../../../constants/route-names';

const router = useRouter();

</script>

<template>
    <div class="py-2 flex justify-end">
        <AddButton :onClick="() => router.push({ name: ROUTE_NAMES.ADMIN.PROMOTION_ORDER_ADD })"
            label="Thêm mã khuyến mãi cho đơn hàng" />
    </div>
    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">

    </div>
</template>