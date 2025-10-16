<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ROUTE_NAMES } from '../../constants/route-names';

const router = useRouter();

const heroImages = [
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619383/Yone_sqkrmp.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619381/AurelionSol_z7hsub.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619383/sejuani_ysltlj.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619382/nautilus_sybstb.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619382/poro_q88uuy.webp',
]

const difficulties = [
    { name: 'Tân binh', desc: 'Khởi động nhẹ nhàng, làm nóng chiến trường!', icon: '🥉', reward: 'Mã giảm 10%' },
    { name: 'Chiến binh', desc: 'Thử thách tầm trung – không thể xem thường!', icon: '🥈', reward: 'Mã giảm 20%' },
    { name: 'Đại cao thủ', desc: 'Vượt qua ranh giới giới hạn bản thân!', icon: '🥇', reward: 'Mã giảm 40%' },
]

</script>

<template>
    <div class="min-h-screen text-gray-200 bg-gradient-to-b from-[#0f172a] to-[#1e293b]">
        <section class="relative bg-white">
            <el-carousel :interval="4000" type="card" height="400px" indicator-position="outside" arrow="always"
                class="transparent-carousel">
                <el-carousel-item v-for="(img, index) in heroImages" :key="index" class="rounded-2xl overflow-hidden">
                    <img :src="img" alt="Challenge slide" class="w-full h-full object-cover rounded-2xl" />
                </el-carousel-item>
            </el-carousel>
        </section>

        <section class="max-w-5xl mx-auto px-6 py-16 text-center">
            <h2 class="text-3xl font-bold mb-6 text-amber-400">🔥 Thức Tỉnh Bản Năng Anh Hùng 🔥</h2>
            <p class="text-lg leading-relaxed text-gray-300">
                Mỗi ngày, bạn chỉ có <span class="font-semibold text-amber-400">một cơ hội duy nhất</span> để bước vào
                đấu trường thử thách của
                <span class="font-bold text-amber-500">Aurelion Shop</span>.
                Hãy chọn chủ đề bạn yêu thích, chọn độ khó bạn dám đối mặt — và thể hiện kỹ năng “<span
                    class="text-amber-400">Tinh Hoa Trí Tuệ</span>”
                như <span class="italic">Lux tung Cầu Ánh Sáng</span> hay <span class="italic">Yasuo lướt trong bão
                    kiếm</span>!
            </p>
            <p class="mt-4 text-gray-400">
                Trả lời chính xác, giành chiến thắng, và nhận <span class="font-semibold text-amber-300">mã giảm giá
                    ngẫu nhiên</span>
                áp dụng lên toàn đơn hàng – phần thưởng dành cho những nhà vô địch thật sự 💫
            </p>
        </section>

        <section class="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div v-for="(diff, i) in difficulties" :key="i"
                class="bg-[#1e293b]/60 border border-amber-400/20 rounded-2xl shadow-lg p-8 text-center hover:scale-105 transition-transform duration-300">
                <div class="text-5xl mb-4">{{ diff.icon }}</div>
                <h3 class="text-2xl font-bold text-amber-400 mb-2">{{ diff.name }}</h3>
                <p class="text-gray-300 mb-4">{{ diff.desc }}</p>
                <p class="text-amber-300 font-semibold">🎁 Phần thưởng: {{ diff.reward }}</p>
            </div>
        </section>

        <section class="text-center pb-20 px-6">
            <h3 class="text-2xl font-bold mb-4 text-amber-400">⚔️ Hãy sẵn sàng chiến đấu! ⚔️</h3>
            <p class="text-gray-300 max-w-3xl mx-auto mb-8">
                Chỉ cần một cú click – bạn có thể chọn chủ đề, độ khó, và bắt đầu hành trình khám phá kiến thức như đang
                leo rank!
                Mỗi trận chiến là một cơ hội, mỗi chiến thắng là một phần thưởng ngọt ngào 🍔✨
                <span class="text-amber-300 font-semibold">Đừng chỉ đứng ngoài nhìn – những chiến binh thực thụ luôn
                    hành động!</span>
                Chiến trường đang mở ra trước mắt bạn... <span class="text-amber-400 font-bold">hãy đăng ký hoặc đăng
                    nhập ngay</span> để bước vào trận chiến trí tuệ, nơi vinh quang và phần thưởng đang chờ đón 🏆🔥
            </p>

            <div class="flex flex-wrap justify-center gap-4">
                <el-button type="warning" size="large" round
                    @click="() => router.push({ name: ROUTE_NAMES.AUTH.SIGN_UP })">
                    Đăng ký ngay 🌟
                </el-button>
                <el-button type="primary" size="large" round
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

.el-carousel__container {
    background-color: transparent !important;
}

.el-carousel__item {
    border-radius: 16px;
    overflow: hidden;
    background: transparent !important;
    box-shadow: none !important;
    transition: all 0.4s ease;
}

.el-carousel__arrow {
    background-color: rgba(251, 191, 36, 0.9) !important;
    color: white !important;
    border-radius: 9999px !important;
}

.el-carousel__arrow:hover {
    background-color: rgba(245, 158, 11, 0.95) !important;
}

.el-carousel__indicator {
    display: none;
}
</style>
