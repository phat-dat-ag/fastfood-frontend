<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AdminFilterHeader from '../../components/AdminFilterHeader.vue';
import type { Filter } from '../../types/filter.types';
import type { User } from '../../types/user.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getAccounts } from '../../service/user.service';
import { ACCOUNT_MESSAGES } from '../../constants/messages';
import AccountTable from './components/AccountTable.vue';

const accounts = ref<User[]>([]);

async function loadAccounts() {
    await useApiHandler<User[]>(
        getAccounts,
        {
            loading: ACCOUNT_MESSAGES.get,
            error: ACCOUNT_MESSAGES.getError,
        },
        (data: User[]) => accounts.value = data,
    )
}

onMounted(loadAccounts);

const filterOptions: Filter[] = [
    { label: 'Nhân viên', value: 'staff' },
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
</script>

<template>
    <div class="p-6 bg-orange-50 min-h-screen text-gray-800">
        <h2 class="text-2xl font-semibold text-orange-500">
            Quản lý khách hàng và nhân viên
        </h2>
        <AdminFilterHeader :filterOptions="filterOptions" @update:search="handleSearchChange"
            @update:filter="handleFilterChange" />

        <AccountTable :accounts="accounts" />
    </div>
</template>