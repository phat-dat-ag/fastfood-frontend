<script setup lang="ts">
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import type { Category } from '../../../types/category.types';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import type { PromotionCategoryCreateRequest, PromotionProductCreateRequest } from '../../../types/promotion.types';
import { useApiHandler } from '../../../composables/useApiHandler';
import { createPromotionCategory, createPromotionProduct } from '../../../service/promotion.service';
import { PROMOTION_CATEGORY_MESSAGE, PROMOTION_PRODUCT_MESSAGE } from '../../../constants/messages';
import { useRouter } from 'vue-router';
import { toVietnamTimezoneISOString } from '../../../utils/time.utils';
import type { Product } from '../../../types/product.types';

const router = useRouter();

const props = defineProps<{
    isPromotionCategory: boolean;
    selectLabel: string;
    placeholderOption: string;
    options: Category[] | Product[];
}>();

const now = new Date();

const promotionTypes = ['FIXED_AMOUNT', 'PERCENTAGE'] as const;

const schema = yup.object({
    id: yup
        .number()
        .required('Phải chọn đối tượng được khuyến mãi')
        .typeError('Phải chọn đối tượng hợp lệ'),
    code: yup
        .string()
        .required('Phải nhập mã khuyến mãi')
        .min(2, 'Mã khuyến mãi dài từ 2 ký tự')
        .max(40, 'Mã khuyến mãi dài tối đa 40 ký tự')
        .matches(/^[A-Za-z0-9]+$/, 'Mã khuyến mãi chỉ gồm chữ và số')
        .transform((value: string) => value?.replace(/\s+/g, '') || ''),
    type: yup
        .mixed<'FIXED_AMOUNT' | 'PERCENTAGE'>()
        .oneOf(promotionTypes, 'Loại khuyến mãi không hợp lệ')
        .required('Phải chọn loại khuyến mãi'),
    value: yup
        .number()
        .required('Phải nhập giá trị khuyến mãi')
        .when('type', {
            is: 'PERCENTAGE',
            then: (schema) =>
                schema.min(1, 'Giá trị khuyến mãi từ 1 đến 100%').max(100, 'Giá trị khuyến mãi từ 1 đến 100%'),
        })
        .when('type', {
            is: 'FIXED_AMOUNT',
            then: (schema) =>
                schema.min(0, 'Giá trị khuyến mãi phải từ 0 trở lên').max(2000000, 'Giá trị tối đa 2.000.000')
                    .test(
                        'divisible-by-1000',
                        'Giá trị phải chia hết cho 1000',
                        (value) => value !== undefined && value % 1000 === 0
                    ),
        }),
    startAt: yup
        .date()
        .required('Phải nhập ngày bắt đầu')
        .min(now, 'Ngày bắt đầu phải từ ngày mai trở đi')
        .test(
            'start-before-end',
            'Ngày bắt đầu phải trước ngày kết thúc',
            function (value) {
                const { endAt } = this.parent;
                if (!value || !endAt) return true;
                return value < endAt;
            }
        ),
    endAt: yup
        .date()
        .required('Phải nhập ngày kết thúc')
        .test(
            'end-after-start',
            'Ngày kết thúc phải sau ngày bắt đầu',
            function (value) {
                const { startAt } = this.parent;
                if (!value || !startAt) return true;
                return value >= startAt;
            }
        ),
    quantity: yup
        .number()
        .required('Phải nhập số lượng')
        .min(1, 'Số lượng phải từ 1 trở lên')
        .max(100000, 'Số lượng ít phải hơn 100000'),

    maxDiscountAmount: yup
        .number()
        .required('Phải nhập giảm tối đa')
        .min(1, 'Giảm tối đa phải từ 1 trở lên'),

    isActivated: yup
        .boolean()
        .required('Phải chọn trạng thái kích hoạt'),
});

async function handleSubmit(formValues: any) {
    const startAt = toVietnamTimezoneISOString(new Date(formValues.startAt), false);
    const endAt = toVietnamTimezoneISOString(new Date(formValues.endAt), true);

    const data = {
        type: formValues.type,
        value: formValues.value,
        startAt: startAt,
        endAt: endAt,
        quantity: formValues.quantity,
        maxDiscountAmount: formValues.maxDiscountAmount,
        minSpendAmount: 0,
        isGlobal: false,
        isActivated: formValues.isActivated,
        code: formValues.code,
    }

    if (props.isPromotionCategory) {
        const dataRequest: PromotionCategoryCreateRequest = {
            ...data,
            categoryId: formValues.id
        }
        await useApiHandler(
            () => createPromotionCategory(dataRequest),
            {
                loading: PROMOTION_CATEGORY_MESSAGE.create,
                success: PROMOTION_CATEGORY_MESSAGE.createSuccess,
                error: PROMOTION_CATEGORY_MESSAGE.createError,
            },
            () => { router.back() },
        )
    } else {
        const dataRequest: PromotionProductCreateRequest = {
            ...data,
            productId: formValues.id
        }
        await useApiHandler(
            () => createPromotionProduct(dataRequest),
            {
                loading: PROMOTION_PRODUCT_MESSAGE.create,
                success: PROMOTION_PRODUCT_MESSAGE.createSuccess,
                error: PROMOTION_PRODUCT_MESSAGE.createError,
            },
            () => { router.back() },
        )
    }
} 
</script>
<template>
    <Form :validation-schema="schema" @submit="handleSubmit" :initial-values="{
        isActivated: true,
    }" class="grid grid-cols-6 gap-6 bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <div v-if="props.options?.length" class="col-span-6 md:col-span-2">
            <label for="id" class="block text-gray-700 font-medium mb-1">
                {{ props.selectLabel }}
            </label>
            <Field id="id" name="id" as="select"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">-- {{ props.placeholderOption }} --</option>
                <option v-for="option in props.options" :key="option.id" :value="option.id">
                    {{ option.name }}
                </option>
            </Field>
            <ErrorMessage name="id" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="startAt" class="block text-gray-700 font-medium mb-1">Bắt đầu</label>
            <Field id="startAt" name="startAt" type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <ErrorMessage name="startAt" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="endAt" class="block text-gray-700 font-medium mb-1">Kết thúc</label>
            <Field id="endAt" name="endAt" type="date"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <ErrorMessage name="endAt" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="type" class="block text-gray-700 font-medium mb-1">Loại khuyến mãi</label>
            <Field id="type" name="type" as="select"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option value="">-- Chọn loại khuyến mãi --</option>
                <option value="FIXED_AMOUNT">Trừ tiền cố định</option>
                <option value="PERCENTAGE">Phần trăm</option>
            </Field>
            <ErrorMessage name="type" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="value" class="block text-gray-700 font-medium mb-1">Giá trị</label>
            <Field id="value" name="value" type="number" min="0" max="2000000" placeholder="Ví dụ: 10%"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <ErrorMessage name="value" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="code" class="block text-gray-700 font-medium mb-1">Mã khuyến mãi</label>
            <Field id="code" name="code" type="text" placeholder="Ví dụ: SALE50"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <ErrorMessage name="code" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="quantity" class="block text-gray-700 font-medium mb-1">Số lượng</label>
            <Field id="quantity" name="quantity" type="number" min="0" max="100000" placeholder="Nhập số lượng"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <ErrorMessage name="quantity" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2">
            <label for="maxDiscountAmount" class="block text-gray-700 font-medium mb-1">
                Giảm tối đa
            </label>
            <Field id="maxDiscountAmount" name="maxDiscountAmount" type="number" min="1" placeholder="VD: 100000"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            <ErrorMessage name="maxDiscountAmount" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-6 md:col-span-2 flex items-center space-x-3">
            <label class="text-gray-700 font-medium">Kích hoạt mã</label>
            <Field name="isActivated" v-slot="{ field }">
                <ElSwitch :model-value="field.value" @update:model-value="field.onChange" />
            </Field>
            <ErrorMessage name="isActivated" class="text-red-500 text-sm mt-1 block" />
        </div>

        <div class="col-span-2 col-start-5 mt-4">
            <PrimaryButton label="Tạo mã khuyến mãi" />
        </div>
    </Form>
</template>