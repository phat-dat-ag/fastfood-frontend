<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from "vue";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import type { ParsedAddress } from "../../types/geocode.types";
import { parseAddressComponents } from "../../utils/geocode.utils";
import { notifyError } from "../../utils/notification.utils";

const emit = defineEmits(["change-address"]);

const mapApiKey = import.meta.env.VITE_GOONG_MAP_KEY as string;
const geocodeApiKey = import.meta.env.VITE_GOONG_API_KEY as string;

let map: any = null;
let marker: any = null;


onMounted(async () => {
    await nextTick();
    initMap();
});

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
        marker = new goongjs.Marker({ color: "#FF7A00" }).setLngLat([lng, lat]).addTo(map);

        try {
            const res = await fetch(
                `https://rsapi.goong.io/Geocode?latlng=${lat},${lng}&api_key=${geocodeApiKey}`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const result = data.results?.[0];
            const parsedAddress: ParsedAddress = parseAddressComponents(result?.address_components || [], lat, lng);
            emit("change-address", parsedAddress);
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
    <div class="w-full h-full rounded-xl border overflow-hidden shadow-sm">
        <div id="goong-map" class="w-full h-full"></div>
    </div>
</template>
