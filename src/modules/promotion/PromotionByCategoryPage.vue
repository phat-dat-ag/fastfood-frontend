<script setup lang="ts">
import { ref } from 'vue';
import type { Filter } from '../../types/filter.types';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';

const filterOptions: Filter[] = [
  { label: 'Thêm gần đây', value: 'recently-added' },
  { label: 'Cập nhật gần đây', value: 'recently-updated' },
  { label: 'Đang khuyến mãi', value: 'with-promotion' },
  { label: 'Đang không được khuyến mãi', value: 'no-promotion' },
];

const activeFilters = ref<any[]>([]);

function handleFilterChange(filters: any[]) {
  activeFilters.value = filters;
  console.log(activeFilters.value);
}

const search = ref<string>("");

function handleSearchChange(searchText: string) {
  search.value = searchText;
  console.log(search.value);
}

</script>
<template>
  <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
    <h2 class="text-2xl font-semibold text-orange-500">
      Quản lý mã khuyến mãi theo danh mục
    </h2>
    <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
      @update:filter="handleFilterChange" />
  </div>
</template>