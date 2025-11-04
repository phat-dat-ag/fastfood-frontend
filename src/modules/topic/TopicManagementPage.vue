<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import TopicTable from './components/tables/TopicTable.vue';
import TopicModal from './components/modals/TopicModal.vue';
import type { Topic, TopicCreateRequest, TopicUpdateRequest } from '../../types/topic.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { createTopic, deleteTopic, getAllTopics, updateTopic } from '../../service/topic.service';
import { TOPIC_MESSAGE } from '../../constants/messages';
import { useTopicStore } from '../../store/useTopicStore.store';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const topics = ref<Topic[]>([]);

async function loadTopics() {
    await useApiHandler<Topic[]>(
        getAllTopics,
        {
            loading: TOPIC_MESSAGE.get,
            error: TOPIC_MESSAGE.getError,
        },
        (data: Topic[]) => topics.value = data,
    )
}

onMounted(loadTopics);

const filterOptions: Filter[] = [
    { label: 'Mới ra mắt', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
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

const isTopicModalVisible = ref<boolean>(false);
const isCreatingTopic = ref<boolean>(true);

const openCreateTopicModal = () => {
    isTopicModalVisible.value = true;
    isCreatingTopic.value = true;
}

async function handleCreateTopic(data: TopicCreateRequest) {
    await useApiHandler(
        () => createTopic(data),
        {
            loading: TOPIC_MESSAGE.create,
            success: TOPIC_MESSAGE.createSuccess,
            error: TOPIC_MESSAGE.createError,
        },
        () => { },
        loadTopics,
    )
}

const topicStore = useTopicStore();

const openUpdateTopicModal = (topic: Topic) => {
    isTopicModalVisible.value = true;
    isCreatingTopic.value = false;
    topicStore.setTopic(topic);
}

const handleUpdateTopic = async (topicInformation: TopicUpdateRequest) => {
    await useApiHandler(
        () => updateTopic(topicInformation),
        {
            loading: TOPIC_MESSAGE.update,
            success: TOPIC_MESSAGE.updateSuccess,
            error: TOPIC_MESSAGE.updateError,
        },
        () => { },
        loadTopics,
    )
}

async function handleDeleteTopic(topicId: number) {
    const confirmed = await openConfirmDeleteMessage("Bạn muốn xóa chủ đề này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deleteTopic(topicId),
        {
            loading: TOPIC_MESSAGE.delete,
            success: TOPIC_MESSAGE.deleteSuccess,
            error: TOPIC_MESSAGE.deleteError,
        },
        () => { },
        loadTopics,
    )
}
</script>

<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý chủ đề trò chơi
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <TopicTable :topics="topics" :openCreateTopicModal="openCreateTopicModal"
            :openUpdateTopicModal="openUpdateTopicModal" :handleDeleteTopic="handleDeleteTopic" />

        <TopicModal v-if="isTopicModalVisible" :isCreatingTopic="isCreatingTopic" @create-topic="handleCreateTopic"
            @update-topic="handleUpdateTopic" @close="isTopicModalVisible = false" />
    </div>
</template>