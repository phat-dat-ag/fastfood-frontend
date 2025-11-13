<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import type { UserResponse } from '../../types/user.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { activateAccount, deactivateAccount, deleteUser, getAllCustomerAccounts } from '../../service/user.service';
import { CUSTOMER_ACCOUNT_MESSAGES } from '../../constants/messages';
import AccountTable from './components/AccountTable.vue';
import type { PageRequest } from '../../types/pagination.types';
import { PAGE_SIZE } from '../../constants/pagination';
import Pagination from '../../components/Pagination.vue';
import { openConfirmDeleteMessage } from '../../utils/confirmation.utils';

const userReponse = ref<UserResponse | null>(null);

async function loadCustomerAccounts(page: number = 0) {
    const pageRequest: PageRequest = {
        page,
        size: PAGE_SIZE.ACCOUNTS.CUSTOMER,
    }
    await useApiHandler<UserResponse>(
        () => getAllCustomerAccounts(pageRequest),
        {
            loading: CUSTOMER_ACCOUNT_MESSAGES.get,
            error: CUSTOMER_ACCOUNT_MESSAGES.getError,
        },
        (data: UserResponse) => { userReponse.value = data; console.log(userReponse.value.users) },
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
    const page: number = userReponse.value?.currentPage || 0;
    await useApiHandler(
        () => activateAccount(userId),
        {
            loading: "Đang kích hoạt tài khoản khách hàng",
            error: "Lỗi kích hoạt tài khoản khách hàng",
        },
        () => { },
        () => loadCustomerAccounts(page),
    )
}

async function handleDeactivateAccount(userId: number) {
    const page: number = userReponse.value?.currentPage || 0;
    await useApiHandler(
        () => deactivateAccount(userId),
        {
            loading: "Đang vô hiệu hóa tài khoản khách hàng",
            error: "Lỗi vô hiệu hóa tài khoản khách hàng",
        },
        () => { },
        () => loadCustomerAccounts(page),
    )
}
async function handlePageChange(page: number) {
    await loadCustomerAccounts(page);
}
</script>
<template>
    <div class="p-6">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý khách hàng
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <div v-if="userReponse">
            <AccountTable :accounts="userReponse.users" @delete-account="deleteCustomerAccount"
                @activate-account="handleActivateAccount" @deactivate-account="handleDeactivateAccount" />
            <Pagination :totalItem="userReponse.totalItems" :pageSize="userReponse.pageSize"
                :currentPage="userReponse.currentPage" @change-page="handlePageChange" />
        </div>
    </div>
</template>