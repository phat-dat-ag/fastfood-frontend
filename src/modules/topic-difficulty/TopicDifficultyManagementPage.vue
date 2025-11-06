<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import type { TopicDifficulty, TopicDifficultyCreateRequest, TopicDifficultyUpdateRequest } from '../../types/topic-difficulty.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { TOPIC_DIFFICULTY_MESSAGE, TOPIC_MESSAGE } from '../../constants/messages';
import { ROUTE_NAMES } from '../../constants/route-names';
import TopicDifficultyTable from './components/tables/TopicDifficultyTable.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import { createTopicDifficulty, deleteTopicDifficulty, getAllTopicDifficultiesByTopic, updateTopicDifficulty } from '../../service/topic-difficulty.service';
import { useTopicDifficultyStore } from '../../store/useTopicDifficultyStore.store';
import TopicDifficultyModal from './components/modals/TopicDifficultyModal.vue';
import type { Topic } from '../../types/topic.types';
import { getTopicBySlug } from '../../service/topic.service';

const route = useRoute();

const topic = ref<Topic | null>(null);

async function loadTopicBySlug() {
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler<Topic>(
        () => getTopicBySlug(slug),
        {
            loading: TOPIC_MESSAGE.get,
            error: TOPIC_MESSAGE.getError,
        },
        (data: Topic) => topic.value = data,
    )
}

const topicDifficulties = ref<TopicDifficulty[]>([]);

async function loadTopicDifficulties() {
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler<TopicDifficulty[]>(
        () => getAllTopicDifficultiesByTopic(slug),
        {
            loading: TOPIC_DIFFICULTY_MESSAGE.get,
            error: TOPIC_DIFFICULTY_MESSAGE.getError,
        },
        (data: TopicDifficulty[]) => topicDifficulties.value = data,
    )
}

onMounted(() => {
    loadTopicBySlug();
    loadTopicDifficulties();
})

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

const isTopicDifficultyModalVisible = ref<boolean>(false);
const isCreatingTopicDifficulty = ref<boolean>(true);

const openCreateTopicDifficultyModal = () => {
    isTopicDifficultyModalVisible.value = true;
    isCreatingTopicDifficulty.value = true;
}

async function handleCreateTopicDifficulty(data: TopicDifficultyCreateRequest) {
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler(
        () => createTopicDifficulty(slug, data),
        {
            loading: TOPIC_DIFFICULTY_MESSAGE.create,
            success: TOPIC_DIFFICULTY_MESSAGE.createSuccess,
            error: TOPIC_DIFFICULTY_MESSAGE.createError,
        },
        () => { },
        loadTopicDifficulties,
    )
}

const topicDifficultyStore = useTopicDifficultyStore();

const openUpdateTopicDifficultyModal = (topicDifficulty: TopicDifficulty) => {
    isTopicDifficultyModalVisible.value = true;
    isCreatingTopicDifficulty.value = false;
    topicDifficultyStore.setTopicDifficulty(topicDifficulty);
}

const handleUpdateTopic = async (topicInformation: TopicDifficultyUpdateRequest) => {
    await useApiHandler(
        () => updateTopicDifficulty(topicInformation),
        {
            loading: TOPIC_DIFFICULTY_MESSAGE.update,
            success: TOPIC_DIFFICULTY_MESSAGE.updateSuccess,
            error: TOPIC_DIFFICULTY_MESSAGE.updateError,
        },
        () => { },
        loadTopicDifficulties,
    )
}

async function handleDeleteTopicDifficulty(topicDifficultyId: number) {
    const confirmed = await openConfirmDeleteMessage("Bạn muốn xóa độ khó của chủ đề này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deleteTopicDifficulty(topicDifficultyId),
        {
            loading: TOPIC_DIFFICULTY_MESSAGE.delete,
            success: TOPIC_DIFFICULTY_MESSAGE.deleteSuccess,
            error: TOPIC_DIFFICULTY_MESSAGE.deleteError,
        },
        () => { },
        loadTopicDifficulties,
    )
}

const router = useRouter();

function goToAwardManagementPage(slug: string) {
    router.push({ name: ROUTE_NAMES.ADMIN.AWARD_MANAGEMENT, params: { slug } });
}

function goToQuestionManagementPage(slug: string) {
    router.push({ name: ROUTE_NAMES.ADMIN.QUESTION_MANAGEMENT, params: { slug } });
}
</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý độ khó của chủ đề
        </h2>

        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <div v-if="topic"
            class="bg-white/90 border border-orange-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">

            <div class="bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl px-5 py-3 mb-5">
                <h2 class="text-xl font-semibold tracking-wide drop-shadow-sm">
                    Chủ đề: {{ topic.name }}
                </h2>
            </div>

            <div>
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Mô tả chủ đề
                </p>
                <p
                    class="text-gray-700 leading-relaxed whitespace-pre-line bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                    {{ topic.description }}
                </p>
            </div>
        </div>

        <TopicDifficultyTable :topicDifficulties="topicDifficulties"
            :openCreateTopicDifficultyModal="openCreateTopicDifficultyModal"
            :openUpdateTopicDifficultyModal="openUpdateTopicDifficultyModal"
            :handleDeleteTopicDifficulty="handleDeleteTopicDifficulty"
            :goToAwardManagementPage="goToAwardManagementPage"
            :goToQuestionManagementPage="goToQuestionManagementPage" />

        <TopicDifficultyModal v-if="isTopicDifficultyModalVisible"
            :isCreatingTopicDifficulty="isCreatingTopicDifficulty"
            @create-topic-difficulty="handleCreateTopicDifficulty" @update-topic-difficulty="handleUpdateTopic"
            @close="isTopicDifficultyModalVisible = false" />
    </div>
</template>