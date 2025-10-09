<script lang="ts" setup>
import { ElInput, ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue'

const props = defineProps<{
    filterOptions: Array<{ label: string; value: string }>
}>();

const emit = defineEmits(["update:filter", "update:search"]);

const value = ref<string[]>([]);
const search = ref<string>("");

</script>
<template>
    <div class="flex gap-2 py-2">
        <ElInput v-model="search" placeholder="Tìm kiếm..." clearable style="width: 30%"
            @input="() => $emit('update:search', search)" />
        <ElSelect v-model="value" multiple filterable default-first-option :reserve-keyword="false"
            placeholder="Chọn tiêu chí lọc" style="width: 70%" @change="() => $emit('update:filter', value)">
            <ElOption v-for="item in props.filterOptions" :key="item.value" :label="item.label" :value="item.value" />
        </ElSelect>
    </div>
</template>
