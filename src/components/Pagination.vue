<script setup lang="ts">
import { ElPagination } from 'element-plus/es/components/index.mjs';
import { ref, watch } from 'vue';

const props = defineProps<{
    totalItem: number;
    pageSize: number;
    currentPage: number;
}>();
const emit = defineEmits(["change-page"]);

const current = ref<number>(props.currentPage + 1);

watch(() => props.currentPage, (newPage) => {
    current.value = newPage + 1;
})

function onPageChange(page: number) {
    emit("change-page", page - 1)
}
</script>

<template>
    <div class="w-full my-4 flex justify-center">
        <ElPagination background layout="prev, pager, next" :total=props.totalItem :page-size=props.pageSize
            v-model:current-page="current" @current-change="onPageChange" />
    </div>
</template>