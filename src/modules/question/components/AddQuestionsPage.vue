<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElSwitch } from "element-plus";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import { notifyError, notifySuccess } from "../../../utils/notification.utils";
import SecondaryButton from "../../../components/buttons/SecondaryButton.vue";
import DeleteButton from "../../../components/buttons/DeleteButton.vue";
import AddButton from "../../../components/buttons/AddButton.vue";
import PrimaryButton from "../../../components/buttons/PrimaryButton.vue";
import type { QuestionCreateRequest, QuestionPrimaryData } from "../../../types/question.types";
import { useApiHandler } from "../../../composables/useApiHandler";
import { createQuestions } from "../../../service/question.service";
import { QUESTION_MESSAGE } from "../../../constants/messages";

const route = useRoute();
const router = useRouter();

function makeEmptyQuestion(): QuestionPrimaryData {
    return {
        content: "",
        imageUrl: null,
        audioUrl: null,
        isActivated: true,
        answerType: "text",
        answers: [
            { content: "", imageUrl: null, isCorrect: true },
            { content: "", imageUrl: null, isCorrect: false },
            { content: "", imageUrl: null, isCorrect: false },
            { content: "", imageUrl: null, isCorrect: false },
        ],
    };
}

const questions = ref<QuestionPrimaryData[]>([makeEmptyQuestion()]);

function addQuestion() {
    questions.value.push(makeEmptyQuestion());
    notifySuccess("Đã thêm câu hỏi");
}

function removeQuestion(index: number) {
    if (questions.value.length === 1) {
        notifyError("Phải có ít nhất 1 câu hỏi", "Xóa câu hỏi thất bại!");
        return;
    }
    questions.value.splice(index, 1);
    notifySuccess(`Đã xóa câu hỏi ${index + 1}`);
}

function handleFileChange(event: Event, obj: Record<string, any>, field: "imageUrl" | "audioUrl") {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];

        const maxSizeMB = field === "audioUrl" ? 5 : 10;
        if (file.size > maxSizeMB * 1024 * 1024) {
            notifyError(`File ${field === "audioUrl" ? "âm thanh" : "ảnh"} vượt quá ${maxSizeMB}MB!`);
            target.value = "";
            return;
        }

        obj[field] = target.files[0];
        target.value = "";
    }
}

function isQuillEmpty(html: string): boolean {
    if (!html) return true;
    const clean = html
        .replace(/<p><br><\/p>/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, "")
        .trim();
    return clean.length === 0;
}

async function handleSubmitAll(): Promise<void> {
    for (const [i, q] of questions.value.entries()) {
        if (isQuillEmpty(q.content)) {
            notifyError(`Câu hỏi ${i + 1}: nội dung câu hỏi là bắt buộc.`);
            return;
        }

        if (q.content.length > 2000) {
            notifyError(`Câu hỏi ${i + 1}: nội dung không quá 2000 ký tự.`);
            return;
        }

        const hasText = q.answers.some(a => !!(a.content && a.content.trim()));
        const hasImage = q.answers.some(a => !!a.imageUrl);
        if (hasText && hasImage) {
            notifyError(`Câu hỏi ${i + 1}: các đáp án chỉ được là ảnh hoặc chỉ được là các câu.`);
            return;
        }

        if (!hasText && !hasImage) {
            notifyError(`Câu hỏi ${i + 1}: vui lòng nhập hoặc tải lên đáp án.`);
            return;
        }

        if (hasText) {
            for (const [j, a] of q.answers.entries()) {
                if (!a.content || !a.content.trim()) {
                    notifyError(`Câu hỏi ${i + 1}, đáp án ${j + 1}: bắt buộc nhập.`);
                    return;
                }
                if (a.content.length > 300) {
                    notifyError(`Câu hỏi ${i + 1}, đáp án ${j + 1}: không quá 300 ký tự.`);
                    return;
                }
            }
        }

        if (q.answers.filter(a => a.isCorrect).length !== 1) {
            notifyError(`Câu hỏi ${i + 1}: phải có đúng 1 đáp án đúng.`);
            return;
        }
    }

    const dataRequest: QuestionCreateRequest[] = questions.value.map(q => ({
        content: q.content,
        imageUrl: q.imageUrl ? q.imageUrl : null,
        audioUrl: q.audioUrl ? q.audioUrl : null,
        isActivated: q.isActivated,
        answers: q.answers.map(a => ({
            content: a.content || "",
            imageUrl: a.imageUrl ? a.imageUrl : null,
            isCorrect: a.isCorrect,
        })),
    }));

    const slug = route.params.slug.toString() || "";

    await useApiHandler(
        () => createQuestions(dataRequest, slug),
        {
            loading: QUESTION_MESSAGE.create,
            success: QUESTION_MESSAGE.createSuccess,
            error: QUESTION_MESSAGE.createError,
        },
        () => router.back(),
    )
}

function getObjectURL(file: File | null): string | undefined {
    if (!file) return undefined;
    return window.URL.createObjectURL(file);
}
</script>
<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <h2 class="text-2xl font-semibold text-orange-500">
                Thêm các câu hỏi cho độ khó:
            </h2>
            <div class="w-[12%]">
                <SecondaryButton label="Quay lại" :onClick="() => router.back()" />
            </div>
        </div>

        <div v-for="(q, index) in questions" :key="index"
            class="bg-white border border-orange-200 rounded-2xl shadow-md p-6 mb-6 hover:shadow-lg transition">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold text-orange-600">Câu hỏi {{ index + 1 }}</h3>
                <div class="w-[12%]">
                    <DeleteButton label="Xóa câu hỏi" :onClick="() => removeQuestion(index)" />
                </div>
            </div>

            <label class="block text-sm font-medium text-gray-700 mb-2">Nội dung câu hỏi:</label>
            <QuillEditor v-model:content="q.content" contentType="html" theme="snow"
                class="bg-white rounded-lg border border-gray-200" :style="{ minHeight: '120px' }" />

            <div class="grid grid-cols-2 gap-4 mt-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Ảnh minh họa cho câu hỏi (tùy chọn):
                    </label>
                    <input type="file" accept="image/*" @change="(e) => handleFileChange(e, q, 'imageUrl')" />
                    <div v-if="q.imageUrl" class="mt-2 flex items-center gap-2">
                        <img :src="getObjectURL(q.imageUrl)" class="w-40 rounded border" />
                        <span class="text-xs text-gray-500 truncate max-w-[150px]">{{ q.imageUrl.name }}</span>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                        Âm thanh minh họa cho câu hỏi (tùy chọn):
                    </label>
                    <input type="file" accept="audio/*" @change="(e) => handleFileChange(e, q, 'audioUrl')" />
                    <div v-if="q.audioUrl" class="mt-2 flex items-center gap-2">
                        <audio controls :src="getObjectURL(q.audioUrl)" class="w-full"></audio>
                        <span class="text-xs text-gray-500 truncate max-w-[150px]">{{ q.audioUrl.name }}</span>
                    </div>
                </div>
            </div>

            <div class="mt-4 flex items-center gap-2">
                <span class="text-sm text-gray-700">Kích hoạt câu hỏi:</span>
                <ElSwitch v-model="q.isActivated" />
            </div>

            <div class="mt-5 flex gap-6 items-center">
                <span class="text-sm text-gray-700">Dạng đáp án:</span>
                <label class="flex items-center gap-1">
                    <input type="radio" value="text" v-model="q.answerType" /> <span>Văn bản</span>
                </label>
                <label class="flex items-center gap-1">
                    <input type="radio" value="image" v-model="q.answerType" /> <span>Hình ảnh</span>
                </label>
            </div>

            <div class="mt-4 grid grid-cols-2 gap-4">
                <div v-for="(a, i) in q.answers" :key="i" class="p-3 flex flex-col gap-2">
                    <div class="flex items-center gap-2">
                        <input type="radio" :name="'correct-' + index" v-model="a.isCorrect" :value="true"
                            @change="q.answers.forEach((x, j) => (x.isCorrect = j === i))" />
                        <span class="text-sm font-medium text-gray-700">Đáp án {{ i + 1 }}</span>
                    </div>

                    <template v-if="q.answerType === 'text'">
                        <input v-model="a.content" type="text"
                            class="border border-gray-200 rounded px-2 py-1 focus:ring-1 focus:ring-orange-400"
                            placeholder="Nhập nội dung đáp án..." />
                    </template>

                    <template v-else>
                        <input type="file" accept="image/*" @change="(e) => handleFileChange(e, a, 'imageUrl')" />
                        <div v-if="a.imageUrl" class="mt-1 flex items-center gap-2">
                            <img :src="getObjectURL(a.imageUrl)" class="w-32 rounded border" />
                            <span class="text-xs text-gray-500 truncate max-w-[120px]">{{ a.imageUrl.name }}</span>
                        </div>
                    </template>
                </div>
            </div>
        </div>

        <div class="flex justify-between mt-8">
            <div class="w-[20%]">
                <AddButton label="Thêm câu hỏi mới" :onClick="addQuestion" />
            </div>
            <div class="w-[20%]">
                <PrimaryButton label="Lưu tất cả" :onClick="handleSubmitAll" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.ql-toolbar {
    border-radius: 0.5rem 0.5rem 0 0;
    border-color: #e5e7eb;
}

.ql-container {
    border-radius: 0 0 0.5rem 0.5rem;
    border-color: #e5e7eb;
}
</style>