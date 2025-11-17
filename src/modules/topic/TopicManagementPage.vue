<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import TopicTable from './components/tables/TopicTable.vue';
import TopicModal from './components/modals/TopicModal.vue';
import type { Topic, TopicCreateRequest, TopicResponse, TopicUpdateRequest } from '../../types/topic.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { activateTopic, createTopic, deactivateTopic, deleteTopic, getAllTopics, updateTopic } from '../../service/topic.service';
import { TOPIC_MESSAGE } from '../../constants/messages';
import { useTopicStore } from '../../store/useTopicStore.store';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';

const topicResponse = ref<TopicResponse | null>(null);

async function loadTopics(page: number = 0) {
    const request: PageRequest = {
        page,
        size: PAGE_SIZE.TOPIC,
    }
    await useApiHandler<TopicResponse>(
        () => getAllTopics(request),
        {
            loading: TOPIC_MESSAGE.get,
            error: TOPIC_MESSAGE.getError,
        },
        (data: TopicResponse) => topicResponse.value = data,
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

async function handleActivateTopic(topicId: number) {
    const page: number = topicResponse.value?.currentPage || 0;
    await useApiHandler(
        () => activateTopic(topicId),
        {
            loading: "Đang kích hoạt chủ đề",
            error: "Lỗi kích hoạt chủ đề",
        },
        () => { },
        () => loadTopics(page)
    )
}

async function handleDeactivateTopic(topicId: number) {
    const page: number = topicResponse.value?.currentPage || 0;
    await useApiHandler(
        () => deactivateTopic(topicId),
        {
            loading: "Đang kích hoạt chủ đề",
            error: "Lỗi kích hoạt chủ đề",
        },
        () => { },
        () => loadTopics(page)
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

const router = useRouter();

function goToTopicDifficultyManagementPage(slug: string) {
    router.push({ name: ROUTE_NAMES.ADMIN.TOPIC_DIFFICULTY_MANAGEMENT, params: { slug } });
}

async function handlePageChange(page: number) {
    await loadTopics(page);
}
</script>

<template>
    <div class="p-6">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý chủ đề trò chơi
        </h2>
        <div v-if="topicResponse">

            <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
                @update:filter="handleFilterChange" />

            <TopicTable :topics="topicResponse.topics" :openCreateTopicModal="openCreateTopicModal"
                :openUpdateTopicModal="openUpdateTopicModal" :handleDeleteTopic="handleDeleteTopic"
                :goToTopicDifficultyManagementPage="goToTopicDifficultyManagementPage"
                @activate-topic="handleActivateTopic" @deactivate-topic="handleDeactivateTopic" />

            <Pagination :totalItem="topicResponse.totalItems" :pageSize="topicResponse.pageSize"
                :currentPage="topicResponse.currentPage" @change-page="handlePageChange" />

            <TopicModal v-if="isTopicModalVisible" :isCreatingTopic="isCreatingTopic" @create-topic="handleCreateTopic"
                @update-topic="handleUpdateTopic" @close="isTopicModalVisible = false" />
        </div>
    </div>
</template>