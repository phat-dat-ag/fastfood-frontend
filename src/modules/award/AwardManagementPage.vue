<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import type { TopicDifficulty } from '../../types/topic-difficulty.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { AWARD_MESSAGE, TOPIC_DIFFICULTY_MESSAGE } from '../../constants/messages';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';
import { getTopicDifficultyBySlug } from '../../service/topic-difficulty.service';
import type { Award, AwardCreateRequest } from '../../types/award.types';
import { createAward, deleteAward, getAllAwardsByTopicDifficulty } from '../../service/award.service';
import AwardTable from './components/tables/AwardTable.vue';
import AwardModal from './components/modals/AwardModal.vue';

const route = useRoute();

const topicDifficulty = ref<TopicDifficulty | null>(null);

async function loadTopicDifficultyBySlug() {
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler<TopicDifficulty>(
        () => getTopicDifficultyBySlug(slug),
        {
            loading: TOPIC_DIFFICULTY_MESSAGE.get,
            error: TOPIC_DIFFICULTY_MESSAGE.getError,
        },
        (data: TopicDifficulty) => topicDifficulty.value = data,
    )
}

const awards = ref<Award[]>([]);

async function loadAwards() {
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler<Award[]>(
        () => getAllAwardsByTopicDifficulty(slug),
        {
            loading: AWARD_MESSAGE.get,
            error: AWARD_MESSAGE.getError,
        },
        (data: Award[]) => awards.value = data,
    )
}

onMounted(() => {
    loadTopicDifficultyBySlug();
    loadAwards();
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

const isAwardModalVisible = ref<boolean>(false);
const isCreatingAward = ref<boolean>(true);

const openCreateAwardModal = () => {
    isAwardModalVisible.value = true;
    isCreatingAward.value = true;
}

async function handleCreateAward(data: AwardCreateRequest) {
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler(
        () => createAward(slug, data),
        {
            loading: AWARD_MESSAGE.create,
            success: AWARD_MESSAGE.createSuccess,
            error: AWARD_MESSAGE.createError,
        },
        () => { },
        loadAwards,
    )
}

async function handleDeleteAward(awardId: number) {
    const confirmed = await openConfirmDeleteMessage("Bạn muốn xóa phần thưởng này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deleteAward(awardId),
        {
            loading: AWARD_MESSAGE.delete,
            success: AWARD_MESSAGE.deleteSuccess,
            error: AWARD_MESSAGE.deleteError,
        },
        () => { },
        loadAwards,
    )
}
</script>
<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý phần thưởng của độ khó
        </h2>

        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <div v-if="topicDifficulty"
            class="bg-white/90 border border-orange-200 rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300">

            <div class="bg-gradient-to-r from-orange-500 to-amber-400 text-white rounded-xl px-5 py-3 mb-5">
                <h2 class="text-xl font-semibold tracking-wide drop-shadow-sm">
                    Độ khó: {{ topicDifficulty.name }}
                </h2>
            </div>

            <div>
                <p class="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Mô tả độ khó
                </p>
                <p
                    class="text-gray-700 leading-relaxed whitespace-pre-line bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                    {{ topicDifficulty.description }}
                </p>
            </div>
        </div>

        <AwardTable :awards="awards" :openCreateAwardModal="openCreateAwardModal"
            :handleDeleteAward="handleDeleteAward" />
        <AwardModal v-if="isAwardModalVisible" :isCreatingAward="isCreatingAward" @create-award="handleCreateAward"
            @close="isAwardModalVisible = false" />
    </div>
</template>