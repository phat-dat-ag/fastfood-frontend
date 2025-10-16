<script setup lang="ts">
const billPromotions = [
    {
        title: 'Giảm 40% cho hóa đơn từ 1.000.000đ',
        code: 'HFJD40',
        desc: 'Nhập mã HFJD40 để được giảm ngay 40% cho mọi hóa đơn trên 1 triệu!',
        image: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760616545/category/rm1h4wzo6yawksi1h513.webp'
    },
    {
        title: 'Giảm 20% cho hóa đơn từ 500.000đ',
        code: 'FAST20',
        desc: 'Nhập mã FAST20 để tiết kiệm ngay 20% cho hóa đơn trên 500k.',
        image: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760616478/category/pj5yhctaxkfge7hvfkuw.jpg'
    },
    {
        title: 'FREESHIP cho đơn từ 200.000đ',
        code: 'FREESHIP200',
        desc: 'Nhập mã FREESHIP200 để được miễn phí giao hàng toàn quốc!',
        image: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760363494/product/udcpqzjqenv1oreioikl.jpg'
    },
]

const categoryPromotions = [
    { title: 'Giảm 30% Món Gà Rán', desc: 'Chỉ trong tuần này!', img: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760342031/category/j1u40al5k2ouubrlsc4q.jpg' },
    { title: 'Ưu đãi Trà Sữa 1 Tặng 1', desc: 'Áp dụng cho danh mục Trà sữa', img: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760621763/2_ly_tt_lsehtt.jpg' },
]

const productPromotions = [
    { title: 'Pizza Hải Sản -20%', desc: 'Giảm ngay 20% cho Pizza Hải Sản tươi ngon!', img: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760617280/product/fh69pgxs6yfsusknlk6e.jpg' },
    { title: 'Combo Burger + Khoai Tây', desc: 'Chỉ 99k – no nê cả buổi!', img: 'https://res.cloudinary.com/dfsdlsfbv/image/upload/v1760621637/combo_burger_cpyory.jpg' },
]
</script>

<template>
    <div class="min-h-screen text-gray-800">
        <section class="text-center py-16">
            <h1 class="text-3xl font-bold text-amber-600 mb-4">🎉 ƯU ĐÃI KHỦNG – NHẬN NGAY HÔM NAY!</h1>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                Aurelion Shop luôn mang đến cho bạn những chương trình khuyến mãi hấp dẫn nhất —
                từ món ăn, danh mục đến hóa đơn! Hãy tận dụng cơ hội để thưởng thức hương vị tuyệt vời với giá siêu ưu
                đãi ✨
            </p>
        </section>

        <section class="py-12 bg-gradient-to-r from-amber-100 to-orange-50">
            <div class="max-w-6xl mx-auto px-4">
                <h2 class="text-3xl font-bold text-center mb-10 text-amber-700">
                    🔥 Khuyến mãi theo Hóa đơn
                </h2>
                <el-carousel :interval="4000" height="300px" arrow="always">
                    <el-carousel-item v-for="(promo, i) in billPromotions" :key="i" class="rounded-2xl overflow-hidden">
                        <div class="flex flex-col md:flex-row bg-white rounded-2xl shadow-md h-full">
                            <img :src="promo.image" alt="Bill promotion" class="w-full md:w-1/2 h-full object-cover" />
                            <div class="flex flex-col justify-center p-6 text-left">
                                <h3 class="text-2xl font-semibold text-amber-700 mb-2">{{ promo.title }}</h3>
                                <p class="text-gray-600 mb-3">{{ promo.desc }}</p>
                                <div class="text-sm bg-amber-600 text-white px-4 py-2 rounded-full w-fit font-semibold">
                                    Mã: {{ promo.code }}
                                </div>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-4 py-16">
            <h2 class="text-3xl font-bold text-center mb-10 text-amber-700">
                🍗 Khuyến mãi theo Danh mục
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="(promo, i) in categoryPromotions" :key="i"
                    class="rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                    <img :src="promo.img" alt="Category promotion" class="w-full h-64 object-cover" />
                    <div class="p-6 text-center">
                        <h3 class="text-xl font-semibold text-amber-700 mb-2">{{ promo.title }}</h3>
                        <p class="text-gray-600">{{ promo.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="max-w-6xl mx-auto px-4 py-16">
            <h2 class="text-3xl font-bold text-center mb-10 text-amber-700">
                🍕 Khuyến mãi theo Món ăn
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div v-for="(promo, i) in productPromotions" :key="i"
                    class="rounded-2xl overflow-hidden shadow hover:shadow-lg transition">
                    <img :src="promo.img" alt="Product promotion" class="w-full h-64 object-cover" />
                    <div class="p-6 text-center">
                        <h3 class="text-xl font-semibold text-amber-700 mb-2">{{ promo.title }}</h3>
                        <p class="text-gray-600">{{ promo.desc }}</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.el-carousel__arrow {
    background-color: rgba(251, 191, 36, 0.9) !important;
    color: white !important;
    border-radius: 9999px !important;
    transition: background-color 0.3s ease;
}

.el-carousel__arrow:hover {
    background-color: rgba(245, 158, 11, 0.95) !important;
}
</style>
