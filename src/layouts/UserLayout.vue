<script setup lang="ts">
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { USER_ROLES } from '../constants/user-roles';
</script>
<template>
    <div class="min-h-screen flex flex-col">
        <Header :role="USER_ROLES.USER"></Header>
        <main class="w-full px-3 sm:w-[90%] lg:w-[80%] my-4 mx-auto">
            <router-view></router-view>
        </main>
        <Footer></Footer>
    </div>
</template>