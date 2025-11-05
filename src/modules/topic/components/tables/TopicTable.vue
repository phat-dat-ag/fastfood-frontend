<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../../components/buttons/AddButton.vue';
import type { Topic } from '../../../../types/topic.types';
import { formatDateTimeString } from '../../../../utils/time.utils';
import EditButton from '../../../../components/buttons/EditButton.vue';
import DeleteButton from '../../../../components/buttons/DeleteButton.vue';

interface TopicTableProps {
    topics: Array<Topic>;
    openCreateTopicModal: () => void;
    openUpdateTopicModal: (topic: Topic) => void;
    handleDeleteTopic: (topicId: number) => Promise<void>;
    goToTopicDifficultyManagementPage: (slug: string) => void;
}
const props = defineProps<TopicTableProps>();
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
                <ElTableColumn width="100" label="Trạng thái" prop="activated">
                    <template #default="scope">
                        <span v-if="scope.row.activated" class="text-green-500 font-medium">
                            Hoạt động
                        </span>
                        <span v-else class="text-red-500 font-medium">
                            Đã ẩn
                        </span>
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