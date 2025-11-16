<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import Container3D from '../3DModel/Container3D.vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { getProductBySlug } from '../../service/product.service';
import { CART_MESSAGE, PRODUCT_MESSAGES } from '../../constants/messages';
import type { Product } from '../../types/product.types';
import { onMounted, ref } from 'vue';
import NumberInput from '../../components/inputs/NumberInput.vue';
import PrimaryButton from '../../components/buttons/PrimaryButton.vue';
import { formatCurrencyVND } from '../../utils/currency.utils';
import { useUserStore } from '../../store/useUserStore.store';
import { notifyError } from '../../utils/notification.utils';
import { addProductToCart } from '../../service/cart.service';
import ProductReviewList from '../review/components/ProductReviewList.vue';
import { USER_ROLES } from '../../constants/user-roles';
import { ROUTE_NAMES } from '../../constants/route-names';

const route = useRoute();
const slug = String(route.params.slug || "");

const product = ref<Product | null>(null);

async function loadProduct() {
    await useApiHandler(
        () => getProductBySlug(slug),
        {
            loading: PRODUCT_MESSAGES.get,
            error: PRODUCT_MESSAGES.getError,
        },
        (data: Product) => product.value = data,
    )
}

onMounted(loadProduct);

const quantity = ref<number>(0);
function onQuantityChange(newQuantity: number) {
    quantity.value = newQuantity;
}

const userStore = useUserStore();

async function handleAddToCart() {
    if (!userStore.isSignedIn()) {
        notifyError("Hãy đăng nhập trước khi thêm sản phẩm vào giỏ hàng");
        return;
    }
    if (quantity.value < 1) return;
    if (product.value === null) {
        notifyError("Không có thông tin sản phẩm để đặt hàng");
        return;
    }
    await useApiHandler(
        () => addProductToCart({ productId: product.value!.id, quantity: quantity.value }),
        {
            loading: CART_MESSAGE.create,
            success: CART_MESSAGE.createSuccess,
            error: CART_MESSAGE.createError,
        },
        () => { },
    )
}

const router = useRouter();

function goToAllReviewsPage() {
    if (!product.value) {
        notifyError("Không thể đến trang tất cả các đánh giá, hãy thử lại");
        return;
    }
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.ALL_PRODUCT_REVIEWS, params: { productId: product.value.id } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.ALL_PRODUCT_REVIEWS, params: { productId: product.value.id } });
    else router.push({ name: ROUTE_NAMES.GUEST.ALL_PRODUCT_REVIEWS, params: { productId: product.value.id } });
}

</script>

<template>
    <div v-if="product" class="container mx-auto p-2 space-y-16">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div
                class="h-[200px] sm:h-[300px] lg:h-[400px] bg-white shadow rounded-2xl p-4 flex items-center justify-center">
                <img :src="product.imageUrl" alt="Product image" class="w-full h-full object-contain rounded-xl" />
            </div>

            <div v-if="product.modelUrl"
                class="h-[200px] sm:h-[300px] lg:h-[400px] bg-white shadow rounded-2xl p-4 flex items-center justify-center">
                <Container3D :modelUrl="product.modelUrl" />
            </div>
            <div v-else
                class="bg-gray-50 shadow-inner rounded-2xl p-4 flex items-center justify-center text-gray-400 italic">
                Không có mô hình 3D
            </div>
        </div>

        <div class="space-y-6">
            <h1 class="text-3xl font-bold">{{ product.name }}</h1>
            <p class="text-gray-500">Danh mục: {{ product.categoryName }}</p>
            <p class="text-gray-700 leading-relaxed">{{ product.description }}</p>

            <div class="flex items-center gap-4">
                <span class="text-2xl font-semibold text-blue-600">
                    {{ formatCurrencyVND(product.discountedPrice) }}
                </span>
                <span v-if="product.discountedPrice !== product.price" class="text-gray-400 line-through">
                    {{ formatCurrencyVND(product.price) }}
                </span>
            </div>

            <div class="flex items-center gap-6 mt-4">
                <template v-if="product.reviewCount > 0">
                    <div class="flex items-center gap-2">
                        <ElRate :model-value="product.averageRating" disabled :precision="0.25" show-score />
                        <span class="text-gray-600 text-sm">({{ product.reviewCount }} đánh giá)</span>
                    </div>
                </template>
                <div class="flex items-center gap-2">
                    <span class="bg-green-100 text-green-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                        Đã bán: {{ product.soldCount }}
                    </span>
                </div>
            </div>

            <div class="w-[50%] mt-6">
                <label class="block text-gray-600 font-medium mb-2">Số lượng:</label>
                <NumberInput :value="quantity" :min="0" :max="99" :step="1" @quantity-change="onQuantityChange" />
                <PrimaryButton label="Thêm vào giỏ hàng" :onClick="() => handleAddToCart()" class="mt-4" />
            </div>
        </div>

        <div class="border-t pt-10">
            <h2 class="text-2xl font-bold mb-4">Đánh giá khách hàng</h2>
            <ProductReviewList :reviews="product.reviews" :showViewAllButton=true
                @view-all-reviews="goToAllReviewsPage" />
        </div>

        <div class="border-t pt-10">
            <h2 class="text-2xl font-bold mb-6">Sản phẩm gợi ý</h2>
        </div>

    </div>

    <div v-else class="p-8 text-center text-gray-500">
        Lỗi khi tải thông tin sản phẩm, hãy thử lại.
    </div>
</template>

<style scoped>
.container {
    max-width: 1200px;
}
</style>
