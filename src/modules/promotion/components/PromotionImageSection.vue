<script setup lang="ts">
import type { ItemPromotionImage } from '../../../types/image.types';
import { formatCurrencyVND } from '../../../utils/currency.utils';
import { formatDateString } from '../../../utils/time.utils';


const props = defineProps<{
  title: string;
  promotions: ItemPromotionImage[];
}>();

function getPromotionLabel(promo: ItemPromotionImage) {
  if (promo.type === 'PERCENTAGE') return `${promo.value}%`;
  if (promo.type === 'FIXED_AMOUNT') return formatCurrencyVND(promo.value.toString());
  return '';
}

function getBadgeColor(promo: ItemPromotionImage) {
  return promo.type === 'PERCENTAGE' ? 'bg-green-500' : 'bg-orange-500';
}
</script>
<template>
  <section>
    <h2 class="text-2xl md:text-3xl font-bold text-amber-700 mb-8 text-center">
      {{ props.title }}
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div v-for="(promo, i) in props.promotions" :key="i"
        class="relative group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
        <img :src="promo.url" :alt="promo.name"
          class="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />

        <div class="absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-bold"
          :class="getBadgeColor(promo)">
          {{ promo.type === 'PERCENTAGE' ? 'Giảm %' : 'Giảm tiền' }}
        </div>

        <div
          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-300 rounded-xl flex items-end">
          <div class="p-4 text-white opacity-0 group-hover:opacity-100 transition duration-300">
            <h3 class="font-semibold text-lg">{{ promo.name }}</h3>
            <p class="text-sm">
              Giảm ngay: <span class="font-bold">{{ getPromotionLabel(promo) }}</span>
            </p>
            <p class="text-xs mt-1">
              {{ formatDateString(promo.startAt) }} - {{ formatDateString(promo.endAt) }}
            </p>
          </div>
        </div>

        <div class="p-4 flex flex-col gap-1 md:hidden">
          <h3 class="font-semibold text-lg text-amber-700">{{ promo.name }}</h3>
          <p class="text-gray-600 text-sm">
            Giảm ngay: <span class="font-medium text-gray-800">{{ getPromotionLabel(promo) }}</span>
          </p>
          <p class="text-gray-400 text-xs">
            {{ formatDateString(promo.startAt) }} - {{ formatDateString(promo.endAt) }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>