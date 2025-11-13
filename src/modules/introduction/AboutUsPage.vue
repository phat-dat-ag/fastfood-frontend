<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import type { AboutUsPageImage, Image } from '../../types/image.types';
import { getAboutUsPageImages } from '../../service/image.service';
import { ABOUT_US_PAGE_IMAGE_MESSAGE } from '../../constants/messages';

const carouselImages = ref<Image[]>([]);
const showcaseImages = ref<Image[]>([]);
const missionImages = ref<Image[]>([]);

async function loadAboutUsImages() {
    await useApiHandler<AboutUsPageImage>(
        getAboutUsPageImages,
        {
            loading: ABOUT_US_PAGE_IMAGE_MESSAGE.get,
            error: ABOUT_US_PAGE_IMAGE_MESSAGE.getError,
        },
        (data: AboutUsPageImage) => {
            carouselImages.value = data.carouselImages;
            showcaseImages.value = data.showcaseImages;
            missionImages.value = data.missionImages;
        }
    );
}

onMounted(loadAboutUsImages);
</script>

<template>
    <div class="space-y-16">
        <section v-if="carouselImages.length > 0" class="relative">
            <el-carousel :interval="4000" type="card" height="400px" indicator-position="outside" arrow="always">
                <el-carousel-item v-for="(img, index) in carouselImages" :key="index"
                    class="rounded-2xl overflow-hidden">
                    <img :src="img.url" :alt="img.alternativeText" class="w-full h-full object-cover rounded-2xl" />
                </el-carousel-item>
            </el-carousel>
        </section>

        <section class="max-w-6xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-6 text-amber-600">Giới thiệu cửa hàng chúng tôi</h2>
            <p class="text-lg text-gray-600 leading-relaxed">
                Tọa lạc tại trung tâm <strong>Phường Ninh Kiều, Cần Thơ</strong>,
                <span class="text-amber-700 font-semibold">Aurelion Shop</span> tự hào mang đến cho bạn
                những món ăn nhanh thơm ngon, tiện lợi và đảm bảo vệ sinh an toàn thực phẩm.
                Chúng tôi luôn hướng tới trải nghiệm ẩm thực tuyệt vời nhất – nơi hương vị, tốc độ
                và dịch vụ thân thiện hòa quyện hoàn hảo.
            </p>
        </section>

        <section v-if="showcaseImages.length > 0">
            <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="(img, i) in showcaseImages" :key="i"
                    class="overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
                    <img :src="img.url" :alt="img.alternativeText"
                        class="w-full h-72 object-cover hover:scale-105 transition-transform" />
                </div>
            </div>
        </section>

        <section class="max-w-6xl mx-auto text-center">
            <h2 class="text-3xl font-bold mb-6 text-amber-600">Sứ mệnh & Cam kết</h2>
            <p class="text-lg text-gray-600 mb-10 leading-relaxed">
                Chúng tôi không chỉ phục vụ món ăn nhanh, mà còn mang đến sự tận tâm và chất lượng trong từng phần ăn.
                Với nguyên liệu tươi sạch mỗi ngày và đội ngũ nhân viên thân thiện,
                Aurelion Shop cam kết mang lại <strong>dịch vụ nhanh chóng – hương vị khó quên</strong>.
            </p>

            <div v-if="missionImages.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div v-for="(img, i) in missionImages" :key="i"
                    class="overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
                    <img :src="img.url" :alt="img.alternativeText"
                        class="w-full h-64 object-cover hover:scale-105 transition-transform" />
                </div>
            </div>
        </section>

        <section>
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-3xl font-bold mb-4 text-amber-700">Liên hệ với chúng tôi</h2>
                <p class="text-gray-700 mb-6">
                    📍 Địa chỉ: Số 12, Phường Ninh Kiều, TP. Cần Thơ
                    <br />
                    ☎️ Hotline: <span class="font-semibold">0909 123 456</span>
                    <br />
                    🌐 Website: <a href="#" class="text-amber-600 underline">www.aurelionshop.vn</a>
                </p>
                <el-button type="warning" round>Đặt món ngay 🍔</el-button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.el-carousel__item {
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transition: all 0.4s ease;
}

.el-carousel__arrow {
    background-color: rgba(251, 191, 36, 0.9) !important;
    color: white !important;
    border-radius: 9999px !important;
    transition: background-color 0.3s ease;
}

.el-carousel__arrow:hover {
    background-color: rgba(245, 158, 11, 0.95) !important;
}

.el-carousel__indicator {
    display: none;
}
</style>
