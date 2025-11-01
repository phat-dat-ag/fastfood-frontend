<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category } from '../../types/category.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getCategories } from '../../service/category.service';
import { CATEGORY_MESSAGES } from '../../constants/messages';
import ProductSegment from './components/ProductSegment.vue';
import { useUserStore } from '../../store/useUserStore.store';
import { notifyError } from '../../utils/notification.utils';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names';
import { USER_ROLES } from '../../constants/user-roles';

const categories = ref<Category[]>([]);
async function loadCategories() {
  await useApiHandler<Category[]>(
    getCategories,
    {
      loading: CATEGORY_MESSAGES.get,
      error: CATEGORY_MESSAGES.getError,
    },
    (data: Category[]) => categories.value = data,
  )
}
onMounted(loadCategories);

const router = useRouter();

const userStore = useUserStore();

const selectedCategory = ref<Category>();
function handleSelect(category: Category) {
  selectedCategory.value = category;
  const role = userStore.user?.role;
  if (role === USER_ROLES.USER)
    router.push({ name: ROUTE_NAMES.USER.CATEGORY_DETAIL, params: { slug: category.slug } });
  else if (role === USER_ROLES.STAFF)
    router.push({ name: ROUTE_NAMES.STAFF.CATEGORY_DETAIL, params: { slug: category.slug } });
  else notifyError("Tài khoản không đủ quyền để xem sản phẩm của danh mục");
}
</script>
<template>
  <div class="flex flex-col gap-4">
    <ProductSegment :categories="categories" @select="handleSelect" />
    <router-view></router-view>
  </div>
</template>
