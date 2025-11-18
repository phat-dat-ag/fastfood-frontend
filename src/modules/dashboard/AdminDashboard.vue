<script setup lang="ts">
import { ref, onMounted, computed, type Ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { STATS_CATEGORY, STATS_ORDER, STATS_PRODUCT, STATS_TOPIC, STATS_TOPIC_DIFFICULTY, STATS_USER } from '../../constants/messages';
import { getCategoryStats, getOrderStats, getProductStats, getTopicDifficultyStats, getTopicStats, getUserStats } from '../../service/dashboard.service';
import type { CategoryStats, OrderStats, ProductStats, TopicDifficultyStats, TopicStats, UserStats } from '../../types/stats.types';
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
  LineElement,
  PointElement,
  BarController,
  LineController,
  type ChartData,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import type { Chart, Plugin, ChartDataset } from 'chart.js';
import { Pie, Bar } from 'vue-chartjs';

type MixedBarLineData = ChartData<"bar" | "line", number[], string>;

const bringLineToFront: Plugin<'bar' | 'line'> = {
  id: 'bringLineToFront',
  afterDatasetsDraw(chart: Chart) {
    chart.data.datasets.forEach((dataset: ChartDataset, index: number) => {
      const meta = chart.getDatasetMeta(index);
      const dsType = (dataset as any).type;
      if (dsType === 'line') {
        try {
          (meta.dataset as any)?.draw();
        } catch (e) {

        }
      }
    });
  }
};

ChartJS.register(bringLineToFront);

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  LineElement,
  PointElement,
  LineController
);

const userStats = ref<UserStats | null>(null);
const orderStats = ref<OrderStats | null>(null);
const productStats = ref<ProductStats[] | null>(null);
const categoryStats = ref<CategoryStats[] | null>(null);
const topicStats = ref<TopicStats[] | null>(null);
const topicDifficultyStats = ref<TopicDifficultyStats[] | null>(null);

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

const topicChartData = ref<ChartData<'bar', number[], string>>({
  labels: [],
  datasets: [
    {
      label: 'Phần thưởng nhận',
      data: [],
      backgroundColor: '#1E90FF',
    },
    {
      label: 'Lượt tham gia',
      data: [],
      backgroundColor: '#FFA500',
    }
  ],
});

const topicChartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { font: { size: 14 } }
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar'> | any) => {
          const datasetLabel = ctx.dataset?.label ?? '';
          const value = ctx.raw as number;
          return `${datasetLabel}: ${value}`;
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { display: false },
    }
  }
}));

const difficultyChartData = ref<MixedBarLineData>({
  labels: [],
  datasets: [
    {
      type: 'bar',
      label: 'Phần thưởng nhận',
      data: [],
      backgroundColor: '#4CAF50',
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'bar',
      label: 'Lượt tham gia',
      data: [],
      backgroundColor: '#FFA500',
      yAxisID: 'y',
      order: 1,
    },
    {
      type: 'line',
      label: 'Thời gian trung bình (giây)',
      data: [],
      borderColor: '#1E90FF',
      yAxisID: 'y1',
      order: 10,
      borderWidth: 3,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: '#1E90FF',
    }
  ],
});

const difficultyChartOptions = computed<ChartOptions<'bar' | 'line'>>(() => ({
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: { font: { size: 14 } }
    },
    tooltip: {
      callbacks: {
        label: (ctx: TooltipItem<'bar' | 'line'>) => {
          const dsLabel = ctx.dataset?.label ?? '';
          const value = ctx.raw as number;
          if (ctx.dataset?.type === 'line') return `Thời gian TB: ${value}s`;
          return `${dsLabel}: ${value}`;
        }
      }
    }
  },
  scales: {
    x: { ticks: { display: false } },
    y: { type: 'linear', position: 'left', beginAtZero: true, stacked: false }, // Bar
    y1: { type: 'linear', position: 'right', beginAtZero: true, stacked: false, grid: { drawOnChartArea: false } }, // Line
  }
}));

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

async function loadTopicStats() {
  await useApiHandler<TopicStats[]>(
    getTopicStats,
    { loading: STATS_TOPIC.get, error: STATS_TOPIC.getError },
    (data) => {
      topicStats.value = data;

      topicChartData.value = {
        labels: data.map(t => t.name),
        datasets: [
          {
            label: 'Phần thưởng nhận',
            data: data.map(t => t.totalPromotionsReceived),
            backgroundColor: '#1E90FF',
          },
          {
            label: 'Lượt tham gia',
            data: data.map(t => t.totalQuizzesPlayed),
            backgroundColor: '#FFA500',
          }
        ]
      };
    }
  );
}

async function loadTopicDifficultyStats() {
  await useApiHandler<TopicDifficultyStats[]>(
    getTopicDifficultyStats,
    { loading: STATS_TOPIC_DIFFICULTY.get, error: STATS_TOPIC_DIFFICULTY.getError },
    (data) => {
      topicDifficultyStats.value = data;

      difficultyChartData.value = {
        labels: data.map(d => d.name),
        datasets: [
          {
            type: 'bar',
            label: 'Phần thưởng nhận',
            data: data.map(d => d.totalPromotionsReceived),
            backgroundColor: '#4CAF50',
            yAxisID: 'y',
          },
          {
            type: 'bar',
            label: 'Lượt tham gia',
            data: data.map(d => d.totalQuizzesPlayed),
            backgroundColor: '#FFA500',
            yAxisID: 'y',
          },
          {
            type: 'line',
            label: 'Thời gian trung bình (giây)',
            data: data.map(d => d.avgDurationSeconds),
            borderColor: '#1E90FF',
            tension: 0.3,
            pointRadius: 3,
            yAxisID: 'y1',
          }
        ]
      } as MixedBarLineData;
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
  await loadTopicStats();
  await loadTopicDifficultyStats();
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

    <div v-if="topicStats" class="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 class="text-lg md:text-xl font-semibold mb-2 text-center">Thống kê theo chủ đề</h3>
      <div class="w-full max-w-3xl h-72 md:h-80 lg:h-96">
        <Bar :data="topicChartData" :options="topicChartOptions" />
      </div>
    </div>

    <div v-if="topicDifficultyStats" class="bg-white shadow rounded p-4 flex flex-col items-center">
      <h3 class="text-lg md:text-xl font-semibold mb-2 text-center">Thống kê theo độ khó</h3>
      <div class="w-full max-w-3xl h-72 md:h-80 lg:h-96">
        <Bar :data="difficultyChartData as unknown as ChartData<'bar', (number | null)[], string>"
          :options="difficultyChartOptions as unknown as ChartOptions<'bar'>" />
      </div>
    </div>
  </div>
</template>
