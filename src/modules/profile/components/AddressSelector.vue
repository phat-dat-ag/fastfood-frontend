<script setup lang="ts">
import { ref } from "vue";
import "@goongmaps/goong-js/dist/goong-js.css";
import { ElInput, ElCard } from "element-plus";
import AddressMap from "../../../components/addresses/AddressMap.vue";
import type { AddressCreateRequest, ParsedAddress } from "../../../types/geocode.types";
import { notifyError } from "../../../utils/notification.utils";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
const emit = defineEmits(["add-address"]);

const selectedAddress = ref<ParsedAddress | null>(null);
const name = ref<string>("");
const detail = ref<string>("");

function onAddressChange(parsedAddress: ParsedAddress) {
    selectedAddress.value = parsedAddress;
}

function handleClickAddButton() {
    if (name.value.length < 3 || name.value.length > 40) {
        notifyError("Tên địa chỉ phải từ 3 đến 40 ký tự!");
        return;
    }

    if (detail.value.length > 100) {
        notifyError("Ghi chú nên ít hơn 100 ký tự!");
        return;
    }

    if (!selectedAddress.value) {
        notifyError("Hãy chọn địa chỉ trên bản đồ!");
        return;
    }

    if (!selectedAddress.value.latitude || !selectedAddress.value.longitude) {
        notifyError("Chưa có tọa độ, hãy thử lại!");
        return;
    }

    const address: AddressCreateRequest = {
        name: name.value,
        detail: detail.value,
        latitude: selectedAddress.value.latitude,
        longitude: selectedAddress.value.longitude,
        street: selectedAddress.value.street || "Không xác định",
        ward: selectedAddress.value.ward || "Không xác định",
        district: selectedAddress.value.district || "Không xác định",
        province: selectedAddress.value.province || "Không xác định",
    }

    emit("add-address", address);
}
</script>
<template>
    <ElCard class="p-6 rounded-2xl shadow-md w-full">
        <h2 class="text-2xl font-semibold text-gray-700 mb-5">Thêm địa chỉ giao hàng nè mày</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="w-full h-[400px] rounded-xl border overflow-hidden shadow-sm">
                <AddressMap @change-address="onAddressChange" />
            </div>

            <div class="flex flex-col justify-between space-y-4">
                <div class="space-y-3">
                    <ElInput v-model="name" placeholder="Tên địa chỉ (VD: Nhà riêng, Công ty)" clearable
                        class="w-full" />
                    <ElInput v-model="detail" type="textarea" :rows="3"
                        placeholder="Ghi chú cho shipper (VD: Cổng màu xanh, kế bên tiệm tạp hóa...)" class="w-full" />
                </div>

                <div v-if="selectedAddress"
                    class="bg-gray-50 border rounded-lg p-4 text-sm text-gray-700 leading-relaxed space-y-3">
                    <div>
                        <strong>📍 Địa chỉ đã chọn:</strong>
                        <p class="mt-1 text-gray-800">
                            {{ selectedAddress.street }}, {{ selectedAddress.ward }},
                            {{ selectedAddress.district }}, {{ selectedAddress.province }}
                        </p>
                    </div>

                    <div class="pt-2">
                        <PrimaryButton label="Thêm địa chỉ này" :onClick="handleClickAddButton" />
                    </div>
                </div>

                <div v-else class="italic text-gray-500 border rounded-lg p-3 text-center">
                    Hãy chọn một vị trí trên bản đồ để xác định địa chỉ của bạn
                </div>
            </div>
        </div>
    </ElCard>
</template>
