<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import type { User } from '../../types/user.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { activateAccount, deactivateAccount, deleteUser, getAllCustomerAccounts } from '../../service/user.service';
import { CUSTOMER_ACCOUNT_MESSAGES } from '../../constants/messages';
import AccountTable from './components/AccountTable.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const customerAccounts = ref<User[]>([]);

async function loadCustomerAccounts() {
    await useApiHandler<User[]>(
        getAllCustomerAccounts,
        {
            loading: CUSTOMER_ACCOUNT_MESSAGES.get,
            error: CUSTOMER_ACCOUNT_MESSAGES.getError,
        },
        (data: User[]) => customerAccounts.value = data,
    )
}

onMounted(loadCustomerAccounts);

const filterOptions: Filter[] = [
    { label: 'Khách hàng', value: 'customer' },
    { label: 'Mới tham gia', value: 'new_member' },
    { label: 'Khách hàng tiềm năng', value: 'potential_customer' },
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

async function deleteCustomerAccount(phone: string) {
    const confirmed: boolean = await openConfirmDeleteMessage("Bạn muốn xóa tài khoản khách hàng này?");
    if (!confirmed) return;

    await useApiHandler(
        () => deleteUser(phone),
        {
            loading: CUSTOMER_ACCOUNT_MESSAGES.delete,
            success: CUSTOMER_ACCOUNT_MESSAGES.deleteSuccess,
            error: CUSTOMER_ACCOUNT_MESSAGES.deleteError,
        },
        () => { },
        loadCustomerAccounts,
    )
}

async function handleActivateAccount(userId: number) {
    const confirmed = await openConfirmDeleteMessage("Kích hoạt tài khoản khách hàng này?");
    if (!confirmed) return;
    await useApiHandler(
        () => activateAccount(userId),
        {
            loading: "Đang kích hoạt tài khoản khách hàng",
            error: "Lỗi kích hoạt tài khoản khách hàng",
        },
        () => { },
        loadCustomerAccounts
    )
}

async function handleDeactivateAccount(userId: number) {
    const confirmed = await openConfirmDeleteMessage("Vô hiệu hóa tài khoản khách hàng này?");
    if (!confirmed) return;
    await useApiHandler(
        () => deactivateAccount(userId),
        {
            loading: "Đang vô hiệu hóa tài khoản khách hàng",
            error: "Lỗi vô hiệu hóa tài khoản khách hàng",
        },
        () => { },
        loadCustomerAccounts
    )
}
</script>

<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý khách hàng
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <AccountTable :accounts="customerAccounts" @delete-account="deleteCustomerAccount"
            @activate-account="handleActivateAccount" @deactivate-account="handleDeactivateAccount" />
    </div>
</template>