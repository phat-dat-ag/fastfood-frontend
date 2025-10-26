<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue';
import type { Address } from '../../types/geocode.types';

const props = defineProps<{
    addresses: Address[];
}>();

const emit = defineEmits(["change-address"]);

const selectedAddressId = ref<number | undefined>(undefined);

function onAddressChange(value: number) {
    if (!value) return;
    const selectedAddress = props.addresses.find(address => address.id === value);
    if (selectedAddress) {
        emit("change-address", selectedAddress);
    }
}

</script>

<template>
    <ElSelect v-model="selectedAddressId" placeholder="Địa chỉ giao hàng" filterable class="w-full"
        @change="onAddressChange">
        <ElOption v-for="address in props.addresses" :key="address.id"
            :label="address.name + ': ' + address.ward + ', ' + address.district + ', ' + address.province"
            :value="address.id" />
    </ElSelect>
</template>