<script setup lang="ts">
import { onMounted, onBeforeUnmount, nextTick } from "vue";
import goongjs from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";
import type { ParsedAddress } from "../../types/geocode.types";
import { parseAddressComponents } from "../../utils/geocode.utils";
import { notifyError } from "../../utils/notification.utils";
import { STORE_LOCATION } from "../../constants/location-store";

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
    const storeCenter = [STORE_LOCATION.longitude, STORE_LOCATION.latitude];

    map = new goongjs.Map({
        container: "goong-map",
        style: "https://tiles.goong.io/assets/goong_map_web.json",
        center: storeCenter,
        zoom: 13,
    });

    const storeEl = document.createElement("div");
    storeEl.innerHTML =
        `<div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        transform: translateY(-10px);
    ">
        <div style="
        background-color: #007AFF;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 3px rgba(0,0,0,0.4);
        "></div>
        <span style="
        background: white;
        color: #007AFF;
        font-weight: 600;
        font-size: 12px;
        margin-top: 4px;
        padding: 1px 6px;
        border-radius: 4px;
        box-shadow: 0 0 2px rgba(0,0,0,0.3);
        ">
        ${STORE_LOCATION.name}
        </span>
    </div>`;

    const storeMarker = new goongjs.Marker({ element: storeEl })
        .setLngLat(storeCenter)
        .setPopup(
            new goongjs.Popup({ offset: 25 }).setHTML(`
      <strong>${STORE_LOCATION.name}</strong><br/>
      ${STORE_LOCATION.detail}<br/>
      ${STORE_LOCATION.street}, ${STORE_LOCATION.ward}, ${STORE_LOCATION.district}
    `)
        );

    storeMarker.addTo(map);

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
