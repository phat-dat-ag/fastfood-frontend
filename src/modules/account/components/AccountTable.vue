<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import AddButton from '../../../components/buttons/AddButton.vue';
import DeleteButton from '../../../components/buttons/DeleteButton.vue';
import type { User } from '../../../types/user.types';
import { formatDateString, formatDateTimeString } from '../../../utils/time.utils';
import Switch from '../../../components/buttons/Switch.vue';
import type { SwitchResponse } from '../../../types/switch-button.types';

interface AccountTableProps {
    accounts: User[];
}

const props = defineProps<AccountTableProps>();
const emit = defineEmits(["delete-account", "activate-account", "deactivate-account"]);

function handleDeleteAccount(phone: string) {
    emit("delete-account", phone);
}

async function handleAccountStatusChange(payload: SwitchResponse) {
    if (payload.isActive) {
        emit("activate-account", payload.targetId);
    } else {
        emit("deactivate-account", payload.targetId);
    }
}
</script>

<template>
    <div>
        <div class="py-2 flex justify-end">
            <AddButton :onClick="() => { }" label="+ Thêm người dùng" />
        </div>
        <div class="bg-white rounded-xl shadow-md overflow-hidden border border-orange-100">
            <ElTable :data="props.accounts" border class="w-full">
                <ElTableColumn width="100" label="Ảnh">
                    <template #default="scope">
                        <img :src="scope.row.avatarUrl" alt="Ảnh đại diện" class="w-12 h-12 object-cover rounded-md" />
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Người dùng" prop="name" show-overflow-tooltip />
                <ElTableColumn label="Số điện thoại" prop="phone" />
                <ElTableColumn width="100" label="Sinh nhật">
                    <template #default="scope">
                        {{ formatDateString(scope.row.birthday) }}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Tham gia">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.createdAt) }}
                    </template>
                </ElTableColumn>
                <ElTableColumn label="Cập nhật">
                    <template #default="scope">
                        {{ formatDateTimeString(scope.row.updatedAt) }}
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Trạng thái">
                    <template #default="scope">
                        <Switch :isActive="scope.row.activated" :targetId="scope.row.id"
                            @status-change="handleAccountStatusChange" />
                    </template>
                </ElTableColumn>

                <ElTableColumn label="Thao tác">
                    <template #default="scope">
                        <div class="flex gap-2 justify-evenly">
                            <DeleteButton :onClick="() => handleDeleteAccount(scope.row.phone)" label="Xóa" />
                        </div>
                    </template>
                </ElTableColumn>
            </ElTable>
        </div>
    </div>
</template>