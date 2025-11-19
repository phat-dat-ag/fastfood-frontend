<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { UploadUserFile, UploadFile } from "element-plus";
import { deleteImage, getAboutUsPageImages, uploadImage } from "../../service/image.service";
import { useApiHandler } from "../../composables/useApiHandler";
import { ABOUT_US_PAGE_IMAGE_MESSAGE } from "../../constants/messages";
import type { AboutUsPageImage, Image, ImageCreateRequest } from "../../types/image.types";
import { PAGE_TYPE } from "../../constants/page-type";
import { SECTION_TYPE } from "../../constants/section-type";
import UploadImagesSection from "./components/UploadImagesSection.vue";

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

const handlePreviewImage = (file: UploadUserFile) => {
    if (file.url) {
        dialogImageUrl.value = file.url;
        dialogVisible.value = true;
    }
};

const handleRemoveFile = (file: UploadUserFile, fileList: UploadUserFile[]) => {
    useApiHandler(
        () => deleteImage(Number(file.name)),
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

const handleAddFile = async (file: UploadFile, sectionType: string) => {
    if (!file.raw) return;

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
};
</script>

<template>
    <div class="p-6 space-y-10">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Quản lý ảnh trang "Về chúng tôi"</h2>

        <UploadImagesSection title="Ảnh Carousel"
            description="Các ảnh này sẽ hiển thị ở carousel trên trang 'Về chúng tôi'."
            v-model:fileList="carouselImages" :sectionType="SECTION_TYPE.CAROUSEL" @preview="handlePreviewImage"
            @remove="handleRemoveFile" @add="handleAddFile" />

        <UploadImagesSection title="Ảnh Showcase"
            description="Các ảnh này sẽ hiển thị ở phần trưng trên trang 'Về chúng tôi'."
            v-model:fileList="showcaseImages" :sectionType="SECTION_TYPE.SHOWCASE" @preview="handlePreviewImage"
            @remove="handleRemoveFile" @add="handleAddFile" />

        <UploadImagesSection title="Ảnh Mission"
            description="Các ảnh này sẽ hiển thị ở phần sứ mệnh trên trang 'Về chúng tôi'."
            v-model:fileList="missionImages" :sectionType="SECTION_TYPE.MISSION" @preview="handlePreviewImage"
            @remove="handleRemoveFile" @add="handleAddFile" />

        <el-dialog v-model="dialogVisible" width="50%">
            <img class="w-full rounded" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>
