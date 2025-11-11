<script setup lang="ts">
import { ref } from 'vue';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';

const props = defineProps<{
    withinOneDay: boolean;
}>();
const emit = defineEmits(["send-feedback"]);

const feedback = ref('');
const feedbackErrors = ref<string | null>(null);

function submitFeedback() {
    feedbackErrors.value = null;
    const feedbackMessage = feedback.value?.trim() ?? '';
    if (feedbackMessage.length <= 0 || feedbackMessage.length > 500) {
        feedbackErrors.value = 'Góp ý không được trống, tối đa 500 ký tự';
        return;
    }
    emit("send-feedback", feedbackMessage);
}
</script>
<template>
    <div v-if="props.withinOneDay">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Góp ý về trò chơi (không bắt buộc)</h3>
        <p class="text-sm text-gray-500 mb-3">
            Bạn có thể góp ý tối đa 500 ký tự. Góp ý chỉ nhận trong vòng 24 giờ kể từ khi hoàn thành.
        </p>

        <el-input type="textarea" v-model="feedback" :rows="5" placeholder="Viết góp ý của bạn..." maxlength="500"
            show-word-limit />

        <div v-if="feedbackErrors" class="text-sm text-red-600 mt-2">{{ feedbackErrors }}</div>

        <div class="flex items-center justify-end gap-3 mt-3">
            <div class="w-[12%]">
                <PrimaryButton label="Gửi góp ý" :onclick="() => submitFeedback()" />
            </div>
        </div>
    </div>

    <div v-else class="text-sm text-gray-500">
        Góp ý và hiển thị đáp án chi tiết đã hết hạn (chỉ hiển thị trong 24 giờ sau khi hoàn thành).
    </div>
</template>