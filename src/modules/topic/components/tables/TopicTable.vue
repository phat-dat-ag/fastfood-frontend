<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../../components/buttons/AddButton.vue';
import type { Topic } from '../../../../types/topic.types';
import { formatDateTimeString } from '../../../../utils/time.utils';
import EditButton from '../../../../components/buttons/EditButton.vue';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';
import type { SwitchResponse } from '../../../../types/switch-button.types';
import Switch from '../../../../components/buttons/Switch.vue';

interface TopicTableProps {
    topics: Array<Topic>;
    openCreateTopicModal: () => void;
    openUpdateTopicModal: (topic: Topic) => void;
    handleDeleteTopic: (topicId: number) => Promise<void>;
    goToTopicDifficultyManagementPage: (slug: string) => void;
}
const props = defineProps<TopicTableProps>();
const emit = defineEmits(["activate-topic", "deactivate-topic"]);

async function handleActivateTopic(payload: SwitchResponse) {
    if (payload.isActive) {
        emit("activate-topic", payload.targetId);
    }
}

async function handleDeactivateTopic(payload: SwitchResponse) {
    if (!payload.isActive) {
        emit("deactivate-topic", payload.targetId);
    }
}
</script>
<template>
    <div>
        <div class="py-2 flex justify-end">
            <AddButton :onClick="props.openCreateTopicModal" label="+ Thêm chủ đề" />
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <ElTable :data="props.topics" border class="w-full">
                <ElTableColumn label="Tên chủ đề" prop="name" show-overflow-tooltip />
                <ElTableColumn label="Mô tả" prop="description" show-overflow-tooltip />
                <ElTableColumn label="Ra mắt" width="160">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.createdAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Cập nhật" width="160">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.updatedAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn width="160" label="Trạng thái">
                    <template #default="scope">
                        <Switch :isActive="scope.row.activated" :targetId="scope.row.id" @activate="handleActivateTopic"
                            @deactivate="handleDeactivateTopic" />
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thao tác">
                    <template #default="scope">
                        <div class="flex gap-2 justify-evenly">
                            <EditButton :onClick="() => props.openUpdateTopicModal(scope.row)" label="Cập nhật" />
                            <DeleteButton :onClick="() => props.handleDeleteTopic(scope.row.id)" label="Xóa" />
                            <AddButton label="Chi tiết"
                                :onClick="() => props.goToTopicDifficultyManagementPage(scope.row.slug)" />
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>