<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps, UploadUserFile, UploadFile } from "element-plus";
import { deleteImage, getAboutUsPageImages, uploadImage } from "../../service/image.service";
import { useApiHandler } from "../../composables/useApiHandler";
import { ABOUT_US_PAGE_IMAGE_MESSAGE } from "../../constants/messages";
import type {
    AboutUsPageImage,
    Image,
    ImageCreateRequest,
} from "../../types/image.types";
import { PAGE_TYPE } from "../../constants/page-type";
import { SECTION_TYPE } from "../../constants/section-type";

const carouselImages = ref<UploadUserFile[]>([]);
const showcaseImages = ref<UploadUserFile[]>([]);
const missionImages = ref<UploadUserFile[]>([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

async function loadAboutUsImages() {
    await useApiHandler<AboutUsPageImage>(
        getAboutUsPageImages,
        {
            loading: ABOUT_US_PAGE_IMAGE_MESSAGE.get,
            error: ABOUT_US_PAGE_IMAGE_MESSAGE.getError,
        },
        (data: AboutUsPageImage) => {
            carouselImages.value = data.carouselImages.map((img: Image) => ({
                name: img.id.toString(),
                url: img.url,
            }));
            showcaseImages.value = data.showcaseImages.map((img: Image) => ({
                name: img.id.toString(),
                url: img.url,
            }));
            missionImages.value = data.missionImages.map((img: Image) => ({
                name: img.id.toString(),
                url: img.url,
            }));
        }
    );
}

onMounted(loadAboutUsImages);

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!;
    dialogVisible.value = true;
};

const handleRemove: UploadProps["onRemove"] = async (uploadFile) => {
    await useApiHandler(
        () => deleteImage(Number(uploadFile.name)),
        {
            loading: ABOUT_US_PAGE_IMAGE_MESSAGE.delete,
            error: ABOUT_US_PAGE_IMAGE_MESSAGE.deleteError,
            success: ABOUT_US_PAGE_IMAGE_MESSAGE.deleteSuccess,
        },
        () => { },
        loadAboutUsImages
    );
};

function prepareImageData(file: UploadFile, sectionType: string): ImageCreateRequest {
    return {
        imageFile: file.raw as File,
        alternativeText: "Ảnh mô tả",
        pageType: PAGE_TYPE.ABOUT_US,
        sectionType,
    };
}

const handleAdd = async (file: UploadFile, sectionType: string) => {
    if (file.raw) {
        const dataToSend = prepareImageData(file, sectionType);
        await useApiHandler(
            () => uploadImage(dataToSend),
            {
                loading: ABOUT_US_PAGE_IMAGE_MESSAGE.create,
                error: ABOUT_US_PAGE_IMAGE_MESSAGE.createError,
                success: ABOUT_US_PAGE_IMAGE_MESSAGE.createSuccess,
            },
            () => { },
            loadAboutUsImages
        );
    }
};
</script>

<template>
    <div class="p-6 space-y-10">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Quản lý ảnh trang "Về chúng tôi"</h2>

        <section class="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Ảnh Carousel</h3>
            <p class="text-gray-500 text-sm mb-3">
                Các ảnh này sẽ hiển thị ở carousel trên trang "Về chúng tôi".
            </p>
            <el-upload v-model:file-list="carouselImages" :auto-upload="false" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :on-change="(file: UploadFile) => handleAdd(file, SECTION_TYPE.CAROUSEL)">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </section>

        <section class="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Ảnh Showcase</h3>
            <p class="text-gray-500 text-sm mb-3">
                Các ảnh này sẽ hiển thị ở phần trưng trên trang "Về chúng tôi".
            </p>
            <el-upload v-model:file-list="showcaseImages" :auto-upload="false" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :on-change="(file: UploadFile) => handleAdd(file, SECTION_TYPE.SHOWCASE)">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </section>

        <section class="p-4 bg-gray-50 rounded-lg shadow-sm">
            <h3 class="text-lg font-semibold text-gray-700 mb-1">Ảnh Mission</h3>
            <p class="text-gray-500 text-sm mb-3">
                Các ảnh này sẽ hiển thị ở phần sứ mệnh trên trang "Về chúng tôi".
            </p>
            <el-upload v-model:file-list="missionImages" :auto-upload="false" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove"
                :on-change="(file: UploadFile) => handleAdd(file, SECTION_TYPE.MISSION)">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
        </section>

        <el-dialog v-model="dialogVisible" width="50%">
            <img class="w-full rounded" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>

<style scoped>
.el-upload {
    --el-upload-list-picture-card-size: 130px;
}

section p {
    line-height: 1.4;
}
</style>
