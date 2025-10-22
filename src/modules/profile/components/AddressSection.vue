<script setup lang="ts">
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import type { Address, AddressCreateRequest } from '../../../types/geocode.types';
import AddressSelector from './AddressSelector.vue';

const props = defineProps<{
    addresses: Address[];
    handleAddAddress: (address: AddressCreateRequest) => Promise<void>;
    handleDeleteAddress: (id: number) => Promise<void>;
}>();
</script>
<template>
    <div
        class="bg-white/90 shadow-lg rounded-2xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300">
        <div class="bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-3">
            <h2 class="text-white text-lg font-semibold tracking-wide">Địa chỉ giao hàng</h2>
        </div>

        <div class="p-6 space-y-6">
            <div v-if="props.addresses.length > 0" class="space-y-3">
                <div v-for="(address, index) in props.addresses" :key="index"
                    class="border rounded-xl p-4 flex justify-between items-center hover:shadow-md transition">
                    <div>
                        <p class="font-semibold text-gray-800">
                            {{ address.name }}
                        </p>
                        <p class="text-gray-600 text-sm leading-relaxed">
                            {{ address.detail ? (address.detail + ', ') : '' }}
                            {{ address.street }}, {{ address.ward }}, {{ address.district }},
                            {{ address.province }}
                        </p>
                    </div>
                    <div class="w-[10%]">
                        <DeleteButton label="Xóa" :onClick="() => props.handleDeleteAddress(address.id)" />
                    </div>
                </div>
            </div>
            <div v-else class="text-gray-500 italic text-center">
                Cưng ơi cưng chưa có địa chỉ nào hết. Hãy thêm địa chỉ mới để được giao hàng nghe cưng!
            </div>

            <transition name="fade">
                <AddressSelector @add-address="props.handleAddAddress" />
            </transition>
        </div>
    </div>
</template>