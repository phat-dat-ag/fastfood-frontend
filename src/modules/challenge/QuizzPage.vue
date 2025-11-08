<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

async function loadQuestions() {
    const topicDifficultySlug = route.params.slug.toString() || "";
    console.log("slug: ", topicDifficultySlug);
}

onMounted(loadQuestions);
</script>
<template>
    Trang trò chơi nè
</template>