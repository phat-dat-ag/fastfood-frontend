<script setup lang="ts">
import { ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue';
import type { Address } from '../../types/geocode.types';

const props = defineProps<{
    addresses: Address[];
}>();

const emit = defineEmits(["change-address"]);

const selectedAddress = ref<string>("");

function onAddressChange(value: string) {
    emit("change-address", value);
}

</script>

<template>
    <ElSelect v-model="selectedAddress" placeholder="Địa chỉ giao hàng" clearable filterable class="w-full"
        @change="onAddressChange">
        <ElOption v-for="address in props.addresses" :key="address.id"
            :label="address.ward + ', ' + address.district + ', ' + address.province" :value="address.id" />
    </ElSelect>
</template>