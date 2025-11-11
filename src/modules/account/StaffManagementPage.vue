<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import type { User } from '../../types/user.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { activateAccount, deactivateAccount, deleteUser, getAllStaffAccounts } from '../../service/user.service';
import { STAFF_ACCOUNT_MESSAGES } from '../../constants/messages';
import AccountTable from './components/AccountTable.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const staffAccounts = ref<User[]>([]);

async function loadStaffAccounts() {
    await useApiHandler<User[]>(
        getAllStaffAccounts,
        {
            loading: STAFF_ACCOUNT_MESSAGES.get,
            error: STAFF_ACCOUNT_MESSAGES.getError,
        },
        (data: User[]) => staffAccounts.value = data,
    )
}

onMounted(loadStaffAccounts);

const filterOptions: Filter[] = [
    { label: 'Mới tham gia', value: 'new_member' },
    { label: 'Nhân viên tiềm năng', value: 'potential_staff' },
    { label: 'Nhân viên năng suất', value: 'hard_working_staff' },
];

const activeFilters = ref<any[]>([]);

function handleFilterChange(filters: any[]) {
    activeFilters.value = filters;
    console.log(activeFilters.value);
}

const search = ref<string>("");

function handleSearchChange(searchText: string) {
    search.value = searchText;
    console.log(search.value);
}

async function deleteStaffAccount(phone: string) {
    const confirmed: boolean = await openConfirmDeleteMessage("Bạn muốn xóa tài khoản nhân viên này?");
    if (!confirmed) return;

    await useApiHandler(
        () => deleteUser(phone),
        {
            loading: STAFF_ACCOUNT_MESSAGES.delete,
            success: STAFF_ACCOUNT_MESSAGES.deleteSuccess,
            error: STAFF_ACCOUNT_MESSAGES.deleteError,
        },
        () => { },
        loadStaffAccounts,
    )
}

async function handleActivateAccount(userId: number) {
    const confirmed = await openConfirmDeleteMessage("Kích hoạt tài khoản nhân viên này?");
    if (!confirmed) return;
    await useApiHandler(
        () => activateAccount(userId),
        {
            loading: "Đang kích hoạt tài khoản nhân viên",
            error: "Lỗi kích hoạt tài khoản nhân viên",
        },
        () => { },
        loadStaffAccounts
    )
}

async function handleDeactivateAccount(userId: number) {
    const confirmed = await openConfirmDeleteMessage("Vô hiệu hóa tài khoản nhân viên này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deactivateAccount(userId),
        {
            loading: "Đang vô hiệu hóa tài khoản nhân viên",
            error: "Lỗi vô hiệu hóa tài khoản nhân viên",
        },
        () => { },
        loadStaffAccounts
    )
}
</script>

<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý nhân viên
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <AccountTable :accounts="staffAccounts" @delete-account="deleteStaffAccount"
            @activate-account="handleActivateAccount" @deactivate-account="handleDeactivateAccount" />
    </div>
</template>