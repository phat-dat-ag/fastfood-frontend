<script setup lang="ts">
const heroImages = [
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760621763/2_ly_tt_lsehtt.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760621637/combo_burger_cpyory.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760617724/product/lexmgdvga1hr5grhage1.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760617346/product/od7yswu9qk8jxvosqtmr.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760363466/product/a5ysdjld6ipzrlsmmprw.webp',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760363323/product/pzfzpykn19f5wmljicz2.webp',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760616478/category/pj5yhctaxkfge7hvfkuw.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760616584/category/yuvdent5gheuqkeh9m7b.webp',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760617822/product/e6oiizjat3evk2s0hlm4.webp',
]

const foodImages = [
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760621763/2_ly_tt_lsehtt.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760621637/combo_burger_cpyory.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760617724/product/lexmgdvga1hr5grhage1.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760617346/product/od7yswu9qk8jxvosqtmr.jpg',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760363466/product/a5ysdjld6ipzrlsmmprw.webp',
    'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760363323/product/pzfzpykn19f5wmljicz2.webp',
]

const urlQuality = 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619235/hai_san_tuoi_song_wniqmo.jpg';
const urlSpeed = 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619251/khong_gian_quan_ihc0e6.jpg';
const urlFriendly = 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760619256/phuc_vu_chuyen_nghiep_mpjuml.jpg';
</script>
<template>
    <div class="min-h-screen text-gray-800">
        <section class="relative">
            <el-carousel :interval="4000" type="card" height="400px" indicator-position="outside" arrow="always">
                <el-carousel-item v-for="(img, index) in heroImages" :key="index" class="rounded-2xl overflow-hidden">
                    <img :src="img" alt="Aurelion Shop slide" class="w-full h-full object-cover rounded-2xl" />
                </el-carousel-item>
            </el-carousel>
        </section>

        <section class="max-w-6xl mx-auto px-4 py-16 text-center">
            <h2 class="text-3xl font-bold mb-6 text-amber-600">Giới thiệu cửa hàng chúng tôi</h2>
            <p class="text-lg text-gray-600 leading-relaxed">
                Tọa lạc tại trung tâm <strong>Phường Ninh Kiều, Cần Thơ</strong>,
                <span class="text-amber-700 font-semibold">Aurelion Shop</span> tự hào mang đến cho bạn
                những món ăn nhanh thơm ngon, tiện lợi và đảm bảo vệ sinh an toàn thực phẩm.
                Chúng tôi luôn hướng tới trải nghiệm ẩm thực tuyệt vời nhất – nơi hương vị, tốc độ
                và dịch vụ thân thiện hòa quyện hoàn hảo.
            </p>
        </section>

        <section class="py-12">
            <div class="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="(img, i) in foodImages" :key="i"
                    class="overflow-hidden rounded-2xl shadow hover:shadow-lg transition">
                    <img :src="img" alt="Food image"
                        class="w-full h-72 object-cover hover:scale-105 transition-transform" />
                </div>
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-4 py-16 text-center">
            <h2 class="text-3xl font-bold mb-6 text-amber-600">Sứ mệnh & Cam kết</h2>
            <p class="text-lg text-gray-600 mb-10 leading-relaxed">
                Chúng tôi không chỉ phục vụ món ăn nhanh, mà còn mang đến sự tận tâm và chất lượng trong từng phần ăn.
                Với nguyên liệu tươi sạch mỗi ngày và đội ngũ nhân viên thân thiện,
                Aurelion Shop cam kết mang lại <strong>dịch vụ nhanh chóng – hương vị khó quên</strong>.
            </p>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div class="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
                    <img :src="urlQuality" alt="Chất lượng" class="w-24 h-24 mx-auto mb-4 object-cover rounded-full" />
                    <h3 class="font-semibold text-xl mb-2 text-amber-700">Chất lượng hàng đầu</h3>
                    <p class="text-gray-600">Từng món ăn được chuẩn bị kỹ lưỡng với nguyên liệu chọn lọc.</p>
                </div>
                <div class="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
                    <img :src="urlSpeed" alt="Nhanh chóng" class="w-24 h-24 mx-auto mb-4 object-cover rounded-full" />
                    <h3 class="font-semibold text-xl mb-2 text-amber-700">Phục vụ nhanh</h3>
                    <p class="text-gray-600">Đặt món, nhận hàng – chỉ trong vài phút, mọi thứ đã sẵn sàng!</p>
                </div>
                <div class="p-8 bg-white rounded-2xl shadow hover:shadow-lg transition">
                    <img :src="urlFriendly" alt="Thân thiện" class="w-24 h-24 mx-auto mb-4 object-cover rounded-full" />
                    <h3 class="font-semibold text-xl mb-2 text-amber-700">Thân thiện & vui vẻ</h3>
                    <p class="text-gray-600">Luôn mỉm cười và tận tâm trong từng cuộc trò chuyện.</p>
                </div>
            </div>
        </section>

        <section class="py-12">
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
