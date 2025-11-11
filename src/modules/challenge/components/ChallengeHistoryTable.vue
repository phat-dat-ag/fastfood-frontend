<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import type { Quiz } from '../../../types/quiz.types';
import { formatDateTimeString } from '../../../utils/time.utils';
import EditButton from '../../../components/buttons/EditButton.vue';

const props = defineProps<{
    quizzes: Quiz[];
    handleViewChallengeHistoryDetail: (quizId: number) => void;
}>();
</script>

<template>
    <div>
        <div class="bg-white/95 rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <ElTable :data="props.quizzes" border stripe class="w-full"
                :header-cell-style="{ background: '#FFF3E0', color: '#B45309', fontWeight: 600, fontSize: '14px' }">
                <ElTableColumn label="Chủ đề" prop="topicDifficulty.topicName" show-overflow-tooltip />
                <ElTableColumn label="Độ khó" prop="topicDifficulty.name" show-overflow-tooltip />

                <ElTableColumn label="Bắt đầu">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.startedAt) }}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Nộp bài">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.completedAt) }}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Mã khuyến mãi">
                    <template #default="scope">
                        {{ scope.row.promotion ? scope.row.promotion.code : "" }}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Hành động" width="120" fixed="right" align="center">
                    <template #default="scope">
                        <EditButton label="Chi tiết" :onClick="() => handleViewChallengeHistoryDetail(scope.row.id)" />
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>

<style scoped src="../../../styles/order-table.css"></style>
