<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { TopicDisplay } from '../../types/topic.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getAllDisplayableTopics } from '../../service/topic.service';
import { TOPIC_MESSAGE } from '../../constants/messages';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names';
import type { TopicDifficultyDisplay } from '../../types/topic-difficulty.types';
import SecondaryButton from '../../components/buttons/SecondaryButton.vue';
import { notifyError } from '../../utils/notification.utils';
import { useUserStore } from '../../store/useUserStore.store';
import { USER_ROLES } from '../../constants/user-roles';

const router = useRouter();

const displayableTopics = ref<TopicDisplay[]>([]);
const selectedTopic = ref<TopicDisplay | null>(null);
const selectedDifficulty = ref<TopicDifficultyDisplay | null>(null);

async function loadDisplayableTopics() {
    await useApiHandler<TopicDisplay[]>(
        getAllDisplayableTopics,
        {
            loading: TOPIC_MESSAGE.get,
            error: TOPIC_MESSAGE.getError,
        },
        (data: TopicDisplay[]) => (displayableTopics.value = data),
    );
}

onMounted(loadDisplayableTopics);

function handleSelectTopic(topic: TopicDisplay) {
    selectedTopic.value = topic;
    selectedDifficulty.value = null;
}

function handleSelectDifficulty(diff: TopicDifficultyDisplay) {
    selectedDifficulty.value = diff;
}

function goBack() {
    if (selectedDifficulty.value) {
        selectedDifficulty.value = null;
    } else if (selectedTopic.value) {
        selectedTopic.value = null;
    }
}

const userStore = useUserStore();

function startChallenge() {
    if (!selectedTopic.value || !selectedDifficulty.value) {
        notifyError("Không thể đến trang thử thách, hãy thử lại!");
        return;
    }
    const role = userStore.user?.role;
    if (role === USER_ROLES.USER)
        router.push({ name: ROUTE_NAMES.USER.QUIZZ, params: { slug: selectedDifficulty.value.slug, } });
    else if (role === USER_ROLES.STAFF)
        router.push({ name: ROUTE_NAMES.STAFF.QUIZZ, params: { slug: selectedDifficulty.value.slug, } });
    else notifyError("Tài khoản không đủ quyền để tham gia thử thách!");
}
</script>
<template>
    <div class="mx-auto space-y-8">
        <div class="rounded-2xl p-6 text-white bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 shadow-lg">
            <h1 class="text-3xl font-bold drop-shadow-md">
                🎯 Thử thách thú vị cùng <span class="text-yellow-200">Aurelion Shop</span>!
            </h1>
            <p class="mt-2 text-white/90">
                Tham gia ngay để nhận mã khuyến mãi hấp dẫn — chọn chủ đề bạn yêu thích và bắt đầu thôi!
            </p>
        </div>

        <div v-if="!selectedTopic" class="w-[60%] mx-auto space-y-6 text-center">
            <h2 class="text-2xl font-semibold text-orange-600">Danh sách chủ đề:</h2>
            <div class="flex flex-col space-y-2">
                <button v-for="topic in displayableTopics" :key="topic.id" @click="handleSelectTopic(topic)"
                    class="text-left px-5 py-3 rounded-xl border border-orange-200 bg-white shadow-sm hover:bg-orange-50 hover:scale-[1.02] transition-all text-center">
                    <span class="text-orange-600 font-semibold text-lg">{{ topic.name }}</span>
                </button>
            </div>
        </div>

        <div v-else-if="!selectedDifficulty" class="space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-orange-600">{{ selectedTopic.name }}</h2>
                <div class="w-[12%]">
                    <SecondaryButton label="Quay lại" :onClick="goBack" />
                </div>
            </div>

            <div
                class="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 shadow-md">
                <p class="text-gray-700 whitespace-pre-line">
                    {{ selectedTopic.description?.slice(0, 2000) }}
                </p>
            </div>

            <div v-if="selectedTopic">
                <h3 class="text-xl font-semibold text-orange-600 mt-6">🎮 Chọn độ khó:</h3>
                <div class="flex flex-col space-y-3 mt-3">
                    <button v-for="diff in selectedTopic.difficulties" :key="diff.id"
                        @click="handleSelectDifficulty(diff)" :class="[
                            'text-left p-4 rounded-xl border transition-all shadow-sm',
                            selectedDifficulty?.id === diff.id
                                ? 'bg-orange-100 border-orange-400 shadow-lg'
                                : 'bg-white border-orange-200 hover:bg-orange-50 hover:scale-[1.02]'
                        ]">
                        <div class="flex flex-col space-y-1">
                            <span class="text-lg font-semibold text-orange-600">{{ diff.name }}</span>
                            <div class="flex flex-wrap gap-3 text-sm text-gray-700">
                                <span class="bg-orange-50 px-2 py-1 rounded-md border border-orange-200">⏱ {{
                                    diff.duration }}s</span>
                                <span class="bg-orange-50 px-2 py-1 rounded-md border border-orange-200">❓ {{
                                    diff.questionCount }} câu</span>
                                <span class="bg-orange-50 px-2 py-1 rounded-md border border-orange-200">🏆đúng từ {{
                                    diff.minCorrectToReward }} câu để nhận thưởng</span>
                            </div>
                            <p class="text-gray-600 text-sm mt-1 line-clamp-3">
                                {{ diff.description?.slice(0, 2000) }}
                            </p>
                        </div>
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold text-orange-600">{{ selectedDifficulty.name }}</h2>
                <div class="w-[12%]">
                    <SecondaryButton label="Quay lại" :onClick="goBack" />
                </div>
            </div>

            <div
                class="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6 shadow-md">
                <p class="text-gray-700 mb-4 whitespace-pre-line">
                    {{ selectedDifficulty.description?.slice(0, 2000) }}
                </p>
                <ul class="text-gray-700 text-sm space-y-1">
                    <li>⏱️ Thời gian: {{ selectedDifficulty.duration }} giây</li>
                    <li>❓ Số câu hỏi: {{ selectedDifficulty.questionCount }}</li>
                    <li>🏆 Trả lời đúng tối thiểu: {{ selectedDifficulty.minCorrectToReward }}</li>
                </ul>
            </div>

            <div class="text-center mt-6">
                <button @click="startChallenge"
                    class="px-8 py-3 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-400 text-white font-bold rounded-2xl shadow-md hover:scale-[1.03] transition-all">
                    Bắt đầu thử thách
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.line-clamp-3 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
}
</style>
