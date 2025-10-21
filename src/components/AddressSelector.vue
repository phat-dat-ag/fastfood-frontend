<script setup lang="ts">
import { ref, nextTick, onBeforeUnmount } from "vue";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import { ElButton } from "element-plus";
import type { ParsedAddress } from "../types/geocode.types";
import { parseAddressComponents } from "../utils/geocode";
import { notifyError } from "../utils/notification.utils";

const mapApiKey = import.meta.env.VITE_GOONG_MAP_KEY as string;
const geocodeApiKey = import.meta.env.VITE_GOONG_API_KEY as string;

const showMap = ref(false);
let map: any = null;
let marker: any = null;

async function toggleMap() {
    showMap.value = !showMap.value;

    if (showMap.value) {
        await nextTick();
        initMap();
    } else {
        if (map) {
            map.remove();
            map = null;
        }
    }
}

function initMap() {
    if (map) map.remove();

    goongjs.accessToken = mapApiKey;

    map = new goongjs.Map({
        container: "goong-map",
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: [105.7705, 10.0299],
        zoom: 13,
    });

    map.on("click", async (e: any) => {
        const { lng, lat } = e.lngLat;

        if (marker) marker.remove();
        marker = new goongjs.Marker().setLngLat([lng, lat]).addTo(map);

        try {
            const res = await fetch(
                `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${geocodeApiKey}`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const result = data.results?.[0];

            const parts: ParsedAddress = parseAddressComponents(result?.address_components || []);
            console.log("📍 Chi tiết địa chỉ:", parts);
            console.log("Tọa độ:", lat, lng);
        } catch (err) {
            notifyError(`Lỗi chọn địa điểm, hãy thử lại! ${err}`);
        }
    });
}

onBeforeUnmount(() => {
    if (map) map.remove();
});
</script>

<template>
    <div class="w-full flex flex-col space-y-3">
        <ElButton type="warning" plain class="w-full" @click="toggleMap">
            {{ showMap ? "Đóng bản đồ" : "Thêm địa chỉ mới" }}
        </ElButton>

        <transition name="fade">
            <div v-if="showMap" class="w-full rounded-xl border h-[400px] overflow-hidden relative">
                <div id="goong-map" class="w-full h-full"></div>
            </div>
        </transition>
    </div>
</template>
