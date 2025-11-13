<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { STATS_CATEGORY, STATS_ORDER, STATS_PRODUCT, STATS_USER } from '../../constants/messages';
import { getCategoryStats, getOrderStats, getProductStats, getUserStats } from '../../service/dashboard.service';
import type { CategoryStats, OrderStats, ProductStats, UserStats } from '../../types/stats.types';
import { ORDER_STATUS_TEXT } from '../../utils/order-display.utils';
import { formatCurrencyVND } from '../../utils/currency.utils';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  type ChartData,
  type TooltipItem,
} from 'chart.js';
import { Pie, Bar } from 'vue-chartjs';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

const userStats = ref<UserStats | null>(null);
const orderStats = ref<OrderStats | null>(null);
const productStats = ref<ProductStats[] | null>(null);
const categoryStats = ref<CategoryStats[] | null>(null);

const animatedCOD: Ref<number> = ref(0);
const animatedBank: Ref<number> = ref(0);
const animatedTotal: Ref<number> = ref(0);

function animateRevenue(target: number, setter: Ref<number>) {
  let current = 0;
  const step = Math.ceil(target / 50);
  const interval = setInterval(() => {
    current += step;
    if (current >= target) {
      setter.value = target;
      clearInterval(interval);
    } else {
      setter.value = current;
    }
  }, 20);
}

const orderChartData = ref<ChartData<'pie', number[], string>>({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [],
  }],
});

const productChartData = ref<ChartData<'bar', number[], string>>({
  labels: [],
  datasets: [{
    label: 'Doanh thu',
    data: [],
    backgroundColor: '#FFA500',
  }],
});

const categoryChartData = ref<ChartData<'bar', number[], string>>({
  labels: [],
  datasets: [{
    label: 'Doanh thu',
    data: [],
    backgroundColor: '#4CAF50',
  }],
});

const showOrderChart = computed(() => orderStats.value !== null);
const showCategoryChart = computed(() => categoryStats.value && categoryStats.value.length > 0);
const showProductChart = computed(() => productStats.value && productStats.value.length > 0);

async function loadUserStats() {
  await useApiHandler<UserStats>(
    getUserStats,
    { loading: STATS_USER.get, error: STATS_USER.getError },
    data => userStats.value = data
  );
}

async function loadOrderStats() {
  await useApiHandler<OrderStats>(
    getOrderStats,
    { loading: STATS_ORDER.get, error: STATS_ORDER.getError },
    data => {
      orderStats.value = data;

      animateRevenue(Number(data.cashOnDeliveryRevenue), animatedCOD);
      animateRevenue(Number(data.bankTransferRevenue), animatedBank);
      animateRevenue(Number(data.totalRevenue), animatedTotal);

      orderChartData.value = {
        labels: [
          ORDER_STATUS_TEXT.PENDING,
          ORDER_STATUS_TEXT.CONFIRMED,
          ORDER_STATUS_TEXT.DELIVERING,
          ORDER_STATUS_TEXT.DELIVERED,
          ORDER_STATUS_TEXT.CANCELLED,
        ],
        datasets: [{
          data: [
            data.pendingOrderAmount,
            data.confirmedOrderAmount,
            data.deliveringOrderAmount,
            data.deliveredOrderAmount,
            data.cancelledOrderAmount,
          ],
          backgroundColor: ['#FFA500', '#1E90FF', '#00CED1', '#32CD32', '#FF6347']
        }]
      };
    }
  );
}

async function loadCategoryStats() {
  await useApiHandler<CategoryStats[]>(
    getCategoryStats,
    { loading: STATS_CATEGORY.get, error: STATS_CATEGORY.getError },
    data => {
      categoryStats.value = data;
      categoryChartData.value = {
        labels: data.map(c => c.name),
        datasets: [{
          label: 'Doanh thu',
          data: data.map(c => c.totalRevenue),
          backgroundColor: '#4CAF50'
        }]
      };
    }
  );
}

async function loadProductStats() {
  await useApiHandler<ProductStats[]>(
    getProductStats,
    { loading: STATS_PRODUCT.get, error: STATS_PRODUCT.getError },
    data => {
      productStats.value = data;
      productChartData.value = {
        labels: data.map(p => p.name),
        datasets: [{
          label: 'Doanh thu',
          data: data.map(p => p.totalRevenue),
          backgroundColor: '#FFA500'
        }]
      };
    }
  );
}

const categoryChartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'>) => {
          const index = ctx.dataIndex;
          const value = ctx.raw as number;
          const quantity = categoryStats.value?.[index]?.totalQuantitySold ?? 0;
          return `Doanh thu: ${formatCurrencyVND(value.toString())}\nSố lượng: ${quantity}`;
        }
      }
    }
  },
  scales: { x: { ticks: { display: false } } }
}));

const productChartOptions = computed(() => ({
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'>) => {
          const index = ctx.dataIndex;
          const value = ctx.raw as number;
          const quantity = productStats.value?.[index]?.totalQuantitySold ?? 0;
          return `Doanh thu: ${formatCurrencyVND(value.toString())}\nSố lượng: ${quantity}`;
        }
      }
    }
  },
  scales: { x: { ticks: { display: false } } }
}));

onMounted(async () => {
  await loadUserStats();
  await loadOrderStats();
  await loadProductStats();
  await loadCategoryStats();
});
</script>

<template>
  <div v-if="userStats" class="p-6 space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-6 gap-4">
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Nhân viên</div>
        <div class="text-2xl font-bold">{{ userStats.totalStaff }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Nhân viên đã kích hoạt</div>
        <div class="text-2xl font-bold">{{ userStats.totalActivatedStaff }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Nhân viên mới</div>
        <div class="text-2xl font-bold">{{ userStats.staffJoinedThisMonth }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Tổng khách hàng</div>
        <div class="text-2xl font-bold">{{ userStats.totalUser }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Khách hàng đã kích hoạt</div>
        <div class="text-2xl font-bold">{{ userStats.totalActivatedUser }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Khách hàng tháng này</div>
        <div class="text-2xl font-bold">{{ userStats.userJoinedThisMonth }}</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Doanh thu COD</div>
        <div class="text-2xl font-bold text-orange-500">{{ formatCurrencyVND(animatedCOD.toString()) }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Doanh thu Chuyển khoản</div>
        <div class="text-2xl font-bold text-blue-500">{{ formatCurrencyVND(animatedBank.toString()) }}</div>
      </div>
      <div class="bg-white shadow rounded p-4 text-center">
        <div class="text-gray-500">Tổng doanh thu</div>
        <div class="text-2xl font-bold text-green-500">{{ formatCurrencyVND(animatedTotal.toString()) }}</div>
      </div>
    </div>

    <div v-if="showOrderChart" class="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 class="text-lg md:text-xl font-semibold mb-2 text-center">Trạng thái đơn hàng</h3>
      <div class="w-full max-w-xl h-64 md:h-72 lg:h-80">
        <Pie :data="orderChartData" :chart-options="{
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { font: { size: 14 } } }
          }
        }" />
      </div>
    </div>

    <div v-if="showCategoryChart && categoryStats" class="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 class="text-lg md:text-xl font-semibold mb-2 text-center">Doanh thu theo danh mục</h3>
      <div class="w-full max-w-3xl h-72 md:h-80 lg:h-96">
        <Bar :data="categoryChartData" :options="categoryChartOptions" />
      </div>
    </div>

    <div v-if="showProductChart && productStats" class="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 class="text-lg md:text-xl font-semibold mb-2 text-center">Top sản phẩm theo doanh thu</h3>
      <div class="w-full max-w-3xl h-72 md:h-80 lg:h-96">
        <Bar :data="productChartData" :options="productChartOptions" />
      </div>
    </div>
  </div>
</template>
