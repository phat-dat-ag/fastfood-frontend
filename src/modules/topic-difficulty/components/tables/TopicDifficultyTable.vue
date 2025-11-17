<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../../components/buttons/AddButton.vue';
import EditButton from '../../../../components/buttons/EditButton.vue';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';
import type { TopicDifficulty } from '../../../../types/topic-difficulty.types';
import type { SwitchResponse } from '../../../../types/switch-button.types';
import Switch from '../../../../components/buttons/Switch.vue';

interface TopicTableProps {
    topicDifficulties: Array<TopicDifficulty>;
    openCreateTopicDifficultyModal: () => void;
    openUpdateTopicDifficultyModal: (topicDifficulty: TopicDifficulty) => void;
    handleDeleteTopicDifficulty: (topicDifficultyId: number) => Promise<void>;
    goToAwardManagementPage: (slug: string) => void;
    goToQuestionManagementPage: (slug: string) => void;
}
const props = defineProps<TopicTableProps>();
const emit = defineEmits(["activate-topic-difficulty", "deactivate-topic-difficulty"]);

async function handleActivateTopicDifficulty(payload: SwitchResponse) {
    if (payload.isActive) {
        emit("activate-topic-difficulty", payload.targetId);
    }
}

async function handleDeactivateTopicDifficulty(payload: SwitchResponse) {
    if (!payload.isActive) {
        emit("deactivate-topic-difficulty", payload.targetId);
    }
}
</script>
<template>
    <div>
        <div class="py-2 flex justify-end">
            <AddButton :onClick="props.openCreateTopicDifficultyModal" label="+ Thêm độ khó" />
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <ElTable :data="props.topicDifficulties" border class="w-full">
                <ElTableColumn label="Tên độ khó" prop="name" show-overflow-tooltip />
                <ElTableColumn label="Thời gian (giây)" prop="duration" width="140" />
                <ElTableColumn label="Số câu hỏi" prop="questionCount" width="100" />
                <ElTableColumn label="Điểm tối thiểu" prop="minCorrectToReward" width="120" />
                <ElTableColumn width="160" label="Trạng thái" prop="activated">
                    <template #default="scope">
                        <Switch :isActive="scope.row.activated" :targetId="scope.row.id"
                            @activate="handleActivateTopicDifficulty" @deactivate="handleDeactivateTopicDifficulty" />
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thao tác" width="360">
                    <template #default="scope">
                        <div class="flex gap-2 justify-evenly">
                            <EditButton :onClick="() => props.openUpdateTopicDifficultyModal(scope.row)"
                                label="Cập nhật" />
                            <DeleteButton :onClick="() => props.handleDeleteTopicDifficulty(scope.row.id)"
                                label="Xóa" />
                            <AddButton label="Chi tiết"
                                :onClick="() => props.goToAwardManagementPage(scope.row.slug)" />
                            <AddButton label="Câu hỏi"
                                :onClick="() => props.goToQuestionManagementPage(scope.row.slug)" />
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>