<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadFile, UploadUserFile, UploadProps } from "element-plus";

const props = defineProps<{
    title: string;
    description: string;
    fileList: UploadUserFile[];
    sectionType: string;
}>();

const emit = defineEmits<{
    (e: "update:fileList", value: UploadUserFile[]): void;
    (e: "preview", file: UploadUserFile): void;
    (e: "remove", file: UploadUserFile, fileList: UploadUserFile[]): void; // <-- chỉnh lại
    (e: "add", file: UploadFile, sectionType: string): void;
}>();

const internalFileList = ref<UploadUserFile[]>([...props.fileList]);

watch(() => props.fileList, (newVal) => {
    internalFileList.value = [...newVal];
});

const handlePreview: UploadProps["onPreview"] = (file) => {
    emit("preview", file as UploadUserFile);
};

const handleRemove: UploadProps["onRemove"] = (file: UploadUserFile, fileList: UploadUserFile[]) => {
    emit("remove", file, fileList);
    internalFileList.value = fileList;
    emit("update:fileList", fileList);
};

const handleChange: UploadProps["onChange"] = (file) => {
    emit("add", file, props.sectionType);
};
</script>
<template>
    <section class="p-4 bg-gray-50 rounded-lg shadow-sm">
        <h3 class="text-lg font-semibold text-gray-700 mb-1">{{ title }}</h3>
        <p class="text-gray-500 text-sm mb-3">{{ description }}</p>

        <el-upload v-model:file-list="internalFileList" list-type="picture-card" :auto-upload="false"
            :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handleChange">
            <el-icon>
                <Plus />
            </el-icon>
        </el-upload>
    </section>
</template>
<style scoped>
.el-upload {
    --el-upload-list-picture-card-size: 130px;
}

section p {
    line-height: 1.4;
}
</style>
