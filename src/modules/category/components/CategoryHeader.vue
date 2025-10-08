<script lang="ts" setup>
import { ElOption, ElSelect } from 'element-plus';
import { ref } from 'vue'

const props = defineProps<{
  filterOptions: Array<{ label: string; value: string }>
}>();

const emit = defineEmits(["update:filter"]);

const value = ref<string[]>([])

</script>
<template>
  <ElSelect v-model="value" multiple filterable default-first-option :reserve-keyword="false"
    placeholder="Chọn tiêu chí lọc" style="width: 240px" @change="() => $emit('update:filter', value)">
    <ElOption v-for="item in props.filterOptions" :key="item.value" :label="item.label" :value="item.value" />
  </ElSelect>
</template>
