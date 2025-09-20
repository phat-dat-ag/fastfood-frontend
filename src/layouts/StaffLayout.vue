<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { STAFF } from '../constants/user-role.constant';

</script>
<template>
    <Header :role="STAFF"></Header>
    <main class="w-[80%] mx-auto">
        <router-view></router-view>
    </main>
    <Footer></Footer>
</template>