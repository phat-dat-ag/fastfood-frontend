<script setup lang="ts">
import { useRouter } from "vue-router";
import PrimaryButton from "./buttons/PrimaryButton.vue";

const props = defineProps<{ title?: string }>();

const router = useRouter();
const goBack = () => router.push("/");
</script>
<template>
    <div class="flex flex-col items-center justify-center gap-4 text-center">
        <img src="https://res.cloudinary.com/dfsdlsfbv/image/upload/v1763455723/t1-yone-pyke-vi-gnar-varus-skin-lol-splash-art-8k-wallpaper-uhdpaper.com-472_5_h_lmrwv6.jpg"
            alt="Empty" class="w-full max-w-lg md:max-w-xl lg:max-w-2xl animate-bounce" />

        <h1 class="text-4xl font-bold text-orange-600 drop-shadow-lg">
            {{ props.title || "Trang này hông có dữ liệu gì hết!!!! 😋" }}
        </h1>

        <div class="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
            <PrimaryButton label="Về trang trước" @click="goBack" />
        </div>
    </div>
</template>
