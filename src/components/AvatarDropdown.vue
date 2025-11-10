<script setup lang="ts">
import { ElDropdown } from 'element-plus';

defineProps<{ avatarUrl: string }>();
defineEmits(["signOut", "go-to-profile-page", "go-to-order-history-page", "go-to-challenge-history-page"]);

</script>
<template>
    <ElDropdown>
        <el-avatar :size="40" :src="avatarUrl" />
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="$emit('go-to-profile-page')">Thông tin cá nhân</el-dropdown-item>
                <el-dropdown-item @click="$emit('go-to-order-history-page')">Lịch sử mua hàng</el-dropdown-item>
                <el-dropdown-item @click="$emit('go-to-challenge-history-page')">Lịch sử thách thức</el-dropdown-item>
                <el-dropdown-item @click="$emit('signOut')">Đăng xuất</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </ElDropdown>
</template>