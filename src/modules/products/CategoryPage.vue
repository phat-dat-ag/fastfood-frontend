<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Category, CategoryDisplayResponse } from '../../types/category.types';
import { useApiHandler } from '../../composables/useApiHandler';
import { getAllDisplayableCategories } from '../../service/category.service';
import { CATEGORY_MESSAGES } from '../../constants/messages';
import ProductSegment from './components/ProductSegment.vue';
import { useUserStore } from '../../store/useUserStore.store';
import { useRouter } from 'vue-router';
import { ROUTE_NAMES } from '../../constants/route-names';
import { USER_ROLES } from '../../constants/user-roles';
import EmptyPage from '../../components/EmptyPage.vue';

const categories = ref<Category[]>([]);
async function loadCategories() {
  await useApiHandler<CategoryDisplayResponse>(
    getAllDisplayableCategories,
    {
      loading: CATEGORY_MESSAGES.get,
      error: CATEGORY_MESSAGES.getError,
    },
    (data: CategoryDisplayResponse) => categories.value = data.displayableCategories,
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
  else router.push({ name: ROUTE_NAMES.GUEST.CATEGORY_DETAIL, params: { slug: category.slug } });
}
</script>
<template>
  <div v-if="categories.length > 0" class="flex flex-col gap-4">
    <ProductSegment :categories="categories" @select="handleSelect" />
    <router-view></router-view>
  </div>
  <EmptyPage v-else title="Không tìm thấy các danh mục sản phẩm nào" />
</template>
