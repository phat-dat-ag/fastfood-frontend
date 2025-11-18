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
import type { AwardCreateRequest, AwardResponse } from '../../types/award.types';
import { activateAward, createAward, deactivateAward, deleteAward, getAllAwardsByTopicDifficulty } from '../../service/award.service';
import AwardTable from './components/tables/AwardTable.vue';
import AwardModal from './components/modals/AwardModal.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';
import EmptyPage from '../../components/EmptyPage.vue';

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

const awardResponse = ref<AwardResponse | null>(null);

async function loadAwards(page: number = 0) {
    const request: PageRequest = {
        page,
        size: PAGE_SIZE.AWARD,
    }
    const slug: string = route.params.slug.toString() || "";
    await useApiHandler<AwardResponse>(
        () => getAllAwardsByTopicDifficulty(slug, request),
        {
            loading: AWARD_MESSAGE.get,
            error: AWARD_MESSAGE.getError,
        },
        (data: AwardResponse) => awardResponse.value = data,
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

async function handleActivateAward(awardId: number) {
    const page = awardResponse.value?.currentPage || 0;
    await useApiHandler(
        () => activateAward(awardId),
        {
            loading: "Đang kích hoạt phần thưởng",
            error: "Lỗi kích hoạt phần thưởng"
        },
        () => { },
        () => loadAwards(page)
    )
}

async function handleDeactivateAward(awardId: number) {
    const page = awardResponse.value?.currentPage || 0;
    await useApiHandler(
        () => deactivateAward(awardId),
        {
            loading: "Đang hủy kích hoạt phần thưởng",
            error: "Lỗi hủy kích hoạt phần thưởng"
        },
        () => { },
        () => loadAwards(page)
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

async function handlePageChange(page: number) {
    await loadAwards(page);
}
</script>
<template>
    <div class="p-6">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý phần thưởng của độ khó
        </h2>

        <div v-if="topicDifficulty && awardResponse"
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
            <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
                @update:filter="handleFilterChange" />
            <div>
                <AwardTable :awards="awardResponse.awards" :openCreateAwardModal="openCreateAwardModal"
                    :handleDeleteAward="handleDeleteAward" @activate-award="handleActivateAward"
                    @deactivate-award="handleDeactivateAward" />
                <Pagination :totalItem="awardResponse.totalItems" :pageSize="awardResponse.pageSize"
                    :currentPage="awardResponse.currentPage" @change-page="handlePageChange" />
                <AwardModal v-if="isAwardModalVisible" :isCreatingAward="isCreatingAward"
                    @create-award="handleCreateAward" @close="isAwardModalVisible = false" />
            </div>
        </div>
        <EmptyPage v-else />
    </div>
</template>