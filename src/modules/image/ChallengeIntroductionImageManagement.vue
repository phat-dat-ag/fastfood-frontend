<script setup lang="ts">
import type { UploadFile, UploadUserFile } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useApiHandler } from '../../composables/useApiHandler';
import { deleteImage, getChallengeIntroductionPageImages, uploadImage } from '../../service/image.service';
import { CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE } from '../../constants/messages';
import type { ChallengeIntroductionImage, Image, ImageCreateRequest } from '../../types/image.types';
import { PAGE_TYPE } from '../../constants/page-type';
import UploadImagesSection from './components/UploadImagesSection.vue';
import { SECTION_TYPE } from '../../constants/section-type';

const carouselImages = ref<UploadUserFile[]>([]);

const dialogImageUrl = ref("");
const dialogVisible = ref(false);

async function loadAboutUsImages() {
    await useApiHandler<ChallengeIntroductionImage>(
        getChallengeIntroductionPageImages,
        {
            loading: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.get,
            error: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.getError,
        },
        (data: ChallengeIntroductionImage) => {
            carouselImages.value = data.carouselImages.map((img: Image) => ({
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
            loading: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.delete,
            error: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.deleteError,
            success: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.deleteSuccess,
        },
        () => { },
        loadAboutUsImages
    );
};

function prepareImageData(file: UploadFile, sectionType: string): ImageCreateRequest {
    return {
        imageFile: file.raw as File,
        alternativeText: "Ảnh mô tả",
        pageType: PAGE_TYPE.CHALLENGE,
        sectionType,
    };
}

const handleAddFile = async (file: UploadFile, sectionType: string) => {
    if (!file.raw) return;

    const dataToSend = prepareImageData(file, sectionType);

    await useApiHandler(
        () => uploadImage(dataToSend),
        {
            loading: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.create,
            error: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.createError,
            success: CHALLENGE_INTRODUCTION_PAGE_IMAGE_MESSAGE.createSuccess,
        },
        () => { },
        loadAboutUsImages
    );
};
</script>
<template>
    <div class="p-6 space-y-10">
        <h2 class="text-2xl font-bold mb-6 text-gray-800">Quản lý ảnh trang "Thử thách"</h2>

        <UploadImagesSection title="Ảnh Carousel"
            description="Các ảnh này sẽ hiển thị ở carousel trên trang 'Giới thiệu thử thách'."
            v-model:fileList="carouselImages" :sectionType="SECTION_TYPE.CAROUSEL" @preview="handlePreviewImage"
            @remove="handleRemoveFile" @add="handleAddFile" />
    </div>
</template>