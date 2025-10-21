<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue';

const addresses = ref([
    { label: "123 Nguyễn Trãi, Q.5, TP.HCM" },
    { label: "45 Hai Bà Trưng, Q.1, TP.HCM" },
    { label: "Số 10 Cầu Giấy, Hà Nội" },
]);

const selectedAddress = ref<string>("");

function onAddressChange(value: string) {
    console.log("🏠 Địa chỉ được chọn:", value);
}

</script>

<template>
    <ElSelect v-model="selectedAddress" placeholder="Địa chỉ giao hàng" clearable filterable class="w-full"
        @change="onAddressChange">
        <ElOption v-for="address in addresses" :key="address.label" :label="address.label" :value="address.label" />
    </ElSelect>
</template>