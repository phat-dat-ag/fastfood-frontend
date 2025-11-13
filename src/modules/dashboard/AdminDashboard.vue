<template>
  <el-container style="padding:24px;">
    <el-header style="background:transparent; padding-bottom:16px">
      <h2 style="margin:0; color:#e74c3c">Admin Dashboard — Fast Food & Rewards</h2>
      <p style="margin:4px 0 0 0; color:#7f8c8d">Bảng tổng hợp thống kê, báo cáo, trò chơi.</p>
    </el-header>

    <div v-if="userStats">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card>
            <h4>Tổng nhân viên</h4>
            <p>{{ userStats.totalStaff }}</p>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <h4>Nhân viên đã kích hoạt</h4>
            <p>{{ userStats.totalActivatedStaff }}</p>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <h4>Nhân viên tham gia tháng này</h4>
            <p>{{ userStats.staffJoinedThisMonth }}</p>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="8">
          <el-card>
            <h4>Tổng khách hàng</h4>
            <p>{{ userStats.totalUser }}</p>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <h4>Khách hàng đã kích hoạt</h4>
            <p>{{ userStats.totalActivatedUser }}</p>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <h4>Khách hàng tham gia tháng này</h4>
            <p>{{ userStats.userJoinedThisMonth }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-main>
      <!-- KPI Cards -->
      <el-row :gutter="20">
        <el-col :span="6" v-for="card in kpiCards" :key="card.label">
          <el-card shadow="hover" style="text-align:center; padding:16px">
            <div style="font-size:28px; font-weight:700; color:#e67e22">{{ card.value }}</div>
            <div style="font-size:14px; color:#7f8c8d">{{ card.label }}</div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <!-- Charts Section -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <h4>Doanh thu theo tuần</h4>
            <div ref="weeklyRevenueChart" style="height:150px"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <h4>Top sản phẩm bán chạy</h4>
            <div ref="topProductChart" style="height:250px"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="hover">
            <h4>Tỷ lệ trạng thái đơn hàng</h4>
            <div ref="orderStatusChart" style="height:250px"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <!-- Game & Rewards -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card shadow="hover">
            <h4>Người chơi & Phần thưởng</h4>
            <el-progress :percentage="gameStats.claimRate" status="success" />
            <p>Đã đổi: {{ gameStats.claimed }} / Phát: {{ gameStats.issued }}</p>
            <el-table :data="recentGames" style="width:100%; margin-top:12px">
              <el-table-column prop="player" label="Người chơi" />
              <el-table-column prop="prize" label="Phần thưởng" />
              <el-table-column prop="issuedAt" label="Thời gian" width="160" />
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card shadow="hover">
            <h4>Doanh thu & Lợi nhuận (Tháng)</h4>
            <div ref="monthlyRevenueChart" style="height:300px"></div>
          </el-card>
        </el-col>
      </el-row>

      <el-divider />

      <!-- Orders Table -->
      <el-card shadow="hover">
        <h4>Báo cáo đơn hàng chi tiết</h4>
        <el-table :data="orders" style="width:100%">
          <el-table-column prop="id" label="#" width="80" />
          <el-table-column prop="customer" label="Khách hàng" />
          <el-table-column prop="total" label="Tổng tiền" />
          <el-table-column prop="status" label="Trạng thái" />
          <el-table-column prop="date" label="Ngày" width="160" />
        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useApiHandler } from '../../composables/useApiHandler'
import { STATS_USER } from '../../constants/messages'
import { getUserStats } from '../../service/dashboard.service'
import type { UserStats } from '../../types/stats.types'

const kpiCards = [
  { label: 'Doanh thu hôm nay', value: '₫12,500,000' },
  { label: 'Đơn hàng hôm nay', value: 342 },
  { label: 'Người chơi hôm nay', value: 128 },
  { label: 'Mã khuyến mãi phát', value: 24 }
]

const gameStats = { issued: 124, claimed: 87, claimRate: 70 }

const recentGames = ref([
  { player: 'Nguyen A', prize: '10% OFF', issuedAt: '2025-11-10 14:10' },
  { player: 'Tran B', prize: 'Free Fries', issuedAt: '2025-11-10 13:44' },
  { player: 'Le C', prize: '₫20,000', issuedAt: '2025-11-09 09:12' }
])

const orders = ref(Array.from({ length: 20 }).map((_, i) => ({
  id: 1000 + i,
  customer: `Customer ${i + 1}`,
  total: `₫${(Math.round(Math.random() * 100) + 20).toLocaleString()}000`,
  status: ['Pending', 'Preparing', 'Delivered', 'Refunded'][Math.floor(Math.random() * 4)],
  date: new Date(Date.now() - i * 86400000).toLocaleDateString()
})))

const weeklyRevenueChart = ref<HTMLDivElement | null>(null)
const topProductChart = ref<HTMLDivElement | null>(null)
const orderStatusChart = ref<HTMLDivElement | null>(null)
const monthlyRevenueChart = ref<HTMLDivElement | null>(null)

onMounted(() => {
  if (weeklyRevenueChart.value) {
    const chart = echarts.init(weeklyRevenueChart.value)
    chart.setOption({
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
      yAxis: { type: 'value' },
      series: [{ type: 'line', data: [1200, 2000, 1500, 3000, 2800, 3500, 4000], smooth: true, areaStyle: {} }]
    })
  }

  if (topProductChart.value) {
    const chart = echarts.init(topProductChart.value)
    chart.setOption({
      xAxis: { type: 'category', data: ['Burger', 'Wrap', 'Fries', 'Combo'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [1240, 980, 860, 340] }]
    })
  }

  if (orderStatusChart.value) {
    const chart = echarts.init(orderStatusChart.value)
    chart.setOption({
      series: [{
        type: 'pie', radius: '60%', data: [
          { value: 40, name: 'Pending' }, { value: 30, name: 'Preparing' }, { value: 25, name: 'Delivered' }, { value: 5, name: 'Refunded' }
        ]
      }]
    })
  }

  if (monthlyRevenueChart.value) {
    const chart = echarts.init(monthlyRevenueChart.value)
    chart.setOption({
      xAxis: { type: 'category', data: ['W1', 'W2', 'W3', 'W4'] },
      yAxis: { type: 'value' },
      series: [
        { name: 'Revenue', type: 'bar', data: [12000, 15000, 18000, 22000] },
        { name: 'Profit', type: 'line', data: [4000, 5000, 6000, 8000] }
      ]
    })
  }
})

const userStats = ref<UserStats | null>(null);
async function loadUserStats() {
  await useApiHandler<UserStats>(
    getUserStats,
    {
      loading: STATS_USER.get,
      error: STATS_USER.getError,
    },
    (data: UserStats) => userStats.value = data,
  )
}

onMounted(loadUserStats);
</script>
