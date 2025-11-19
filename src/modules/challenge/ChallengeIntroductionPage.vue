<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '../../constants/route-names';
import { onMounted, onUnmounted, ref } from 'vue';
import type { ChallengeIntroductionImage, Image } from '../../types/image.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getChallengeIntroductionPageImages } from '../../service/image.service';
import { CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE } from '../../constants/messages';

const router = useRouter();

const difficulties = [
    { name: 'Dễ', desc: 'Khởi động nhẹ nhàng, vui vẻ.', icon: '🥪', reward: 'Mã giảm giá từ 10%' },
    { name: 'Trung bình', desc: 'Thử thách vừa phải, thú vị.', icon: '🍟', reward: 'Mã giảm giá từ 20%' },
    { name: 'Khó', desc: 'Đòi hỏi tốc độ và sự tập trung cao độ!', icon: '🍔', reward: 'Mã giảm giá từ 40%' },
]

const carouselImages = ref<Image[]>([]);

async function loadChallengeIntroductionImages() {
    await useApiHandler<ChallengeIntroductionImage>(
        getChallengeIntroductionPageImages,
        {
            loading: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.get,
            error: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.getError,
        },
        (data: ChallengeIntroductionImage) => carouselImages.value = data.carouselImages
    );
}

onMounted(loadChallengeIntroductionImages);

const carouselHeight = ref("400px");
const updateCarouselHeight = () => {
    const w = window.innerWidth;

    if (w < 480) carouselHeight.value = "100px";
    else if (w < 1024) carouselHeight.value = "200px";
    else carouselHeight.value = "400px";
};

onMounted(() => {
    updateCarouselHeight();
    window.addEventListener("resize", updateCarouselHeight);
});

onUnmounted(() => {
    window.removeEventListener("resize", updateCarouselHeight);
});
</script>

<template>
    <div>
        <section class="relative">
            <el-carousel v-if="carouselImages.length > 0" :interval="4000" type="card" :height="carouselHeight"
                indicator-position="outside" arrow="always" class="transparent-carousel">
                <el-carousel-item v-for="(img, index) in carouselImages" :key="index"
                    class="rounded-2xl overflow-hidden">
                    <img :src="img.url" :alt="img.alternativeText"
                        class="w-full h-full object-cover rounded-2xl shadow-lg" />
                </el-carousel-item>
            </el-carousel>
        </section>

        <section class="mx-auto px-6 py-6 text-center">
            <h2 class="text-4xl font-bold mb-6 text-orange-600 uppercase tracking-wide">
                🎉 Thử Thách Vui – Nhận Quà Ngon! 🎁
            </h2>
            <p class="text-lg leading-relaxed text-gray-700">
                Tại <span class="font-semibold text-orange-600">Aurelion Shop</span>
                , bạn không chỉ được thưởng thức món ăn ngon mà còn có thể
                <span class="font-semibold text-red-500">nhận quà hấp dẫn</span>
                qua các thử thách nhanh và thú vị.
            </p>
            <p class="text-lg leading-relaxed text-gray-700">
                Trả lời đúng – nhận mã giảm giá – đặt món ngon liền tay! 🍔🍟🥤
            </p>
            <p class="mt-4 text-gray-600">
                Mỗi độ khó mang đến cơ hội khác nhau. Càng thử sức cao, phần thưởng càng lớn!
                Chọn cấp độ phù hợp và bắt đầu thôi!
            </p>
        </section>

        <section class="max-w-6xl mx-auto px-6 pb-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(diff, i) in difficulties" :key="i"
                class="bg-white rounded-2xl shadow-md border border-orange-200 p-8 text-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300">
                <div class="text-6xl mb-4">{{ diff.icon }}</div>
                <h3 class="text-2xl font-bold text-orange-600 mb-2">{{ diff.name }}</h3>
                <p class="text-gray-700 mb-4">{{ diff.desc }}</p>
                <p class="text-red-500 font-semibold">🎁 Phần thưởng:</p>
                <p class="text-red-500 font-semibold">{{ diff.reward }}</p>
            </div>
        </section>

        <section
            class="text-center py-10 px-6 bg-gradient-to-r from-orange-500 via-red-400 to-orange-600 text-white rounded-[2rem]">
            <h3 class="text-3xl font-bold mb-4">🔥 Tham Gia Ngay – Nhận Ưu Đãi Hấp Dẫn 🔥</h3>
            <p class="text-white/90 max-w-3xl mx-auto mb-8">
                Hãy dành ít phút để vui chơi và nhận quà – đơn giản, nhanh chóng và cực kỳ hấp dẫn.
                <span class="text-yellow-200 font-semibold">Đăng ký hoặc đăng nhập</span>
                để bắt đầu thử thách hôm nay cùng Aurelion Shop!
            </p>

            <div class="flex flex-wrap justify-center gap-4">
                <el-button size="large" round style="background-color: #ffb800; color: white; border: none;"
                    @click="() => router.push({ name: ROUTE_NAMES.AUTH.SIGN_UP })">
                    Đăng ký ngay 🌟
                </el-button>
                <el-button size="large" round style="background-color: white; color: #ff4d4d; border: none;"
                    @click="() => router.push({ name: ROUTE_NAMES.AUTH.SIGN_IN })">
                    Đăng nhập để chơi 🎮
                </el-button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.transparent-carousel {
    background-color: transparent !important;
}

.el-carousel__arrow {
    background-color: rgba(255, 184, 0, 0.9) !important;
    color: white !important;
    border-radius: 9999px !important;
}

.el-carousel__arrow:hover {
    background-color: rgba(255, 102, 0, 0.95) !important;
}

.el-carousel__indicator {
    display: none;
}

.el-carousel__item {
    border-radius: 20px;
    overflow: hidden;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
}
</style>
