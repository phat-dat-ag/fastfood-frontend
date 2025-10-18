<script setup lang="ts">
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../components/buttons/SecondaryButton.vue';
import { useRouter } from 'vue-router';
import { toVietnamTimezoneISOString } from '../../../utils/time.utils';

const router = useRouter();

const props = defineProps<{
  isGlobal?: boolean,
  showTargetSelect?: boolean,
  selectLabel?: string,
  placeholderOption?: string,
  options?: { id: number, name: string }[],
  onSubmit: (data: any) => Promise<void>
}>();

const now = new Date();
const promotionTypes = ['FIXED_AMOUNT', 'PERCENTAGE'] as const;

const schema = yup.object({
  id: yup
    .number()
    .when('$showTargetSelect', {
      is: true,
      then: (schema) => schema.required('Phải chọn đối tượng được khuyến mãi').typeError('Phải chọn đối tượng hợp lệ'),
      otherwise: (schema) => schema.optional(),
    }),
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
      then: (schema) => schema.min(1, 'Giá trị khuyến mãi từ 1 đến 100%').max(100, 'Giá trị khuyến mãi từ 1 đến 100%'),
    })
    .when('type', {
      is: 'FIXED_AMOUNT',
      then: (schema) =>
        schema
          .min(0, 'Giá trị khuyến mãi phải từ 0 trở lên')
          .max(2000000, 'Giá trị tối đa 2.000.000')
          .test('divisible-by-1000', 'Giá trị phải chia hết cho 1000', (value) => value !== undefined && value % 1000 === 0),
    }),
  startAt: yup
    .date()
    .required('Phải nhập ngày bắt đầu')
    .min(now, 'Ngày bắt đầu phải từ ngày mai trở đi')
    .test('start-before-end', 'Ngày bắt đầu phải trước ngày kết thúc', function (value) {
      const { endAt } = this.parent;
      if (!value || !endAt) return true;
      return value < endAt;
    }),
  endAt: yup
    .date()
    .required('Phải nhập ngày kết thúc')
    .test('end-after-start', 'Ngày kết thúc phải sau ngày bắt đầu', function (value) {
      const { startAt } = this.parent;
      if (!value || !startAt) return true;
      return value >= startAt;
    }),
  quantity: yup.number().required('Phải nhập số lượng').min(1).max(100000, 'Số lượng ít phải hơn 100000'),
  maxDiscountAmount: yup.number()
    .required('Phải nhập giảm tối đa')
    .min(1, 'Giảm tối đa phải từ 1 trở lên')
    .max(2000000, 'Số tiền tối đa 2.000.000')
    .test(
      'maxDiscountAmount-divisible-by-1000',
      'Số tiền phải chia hết cho 1000',
      (value) => value !== undefined && value % 1000 === 0
    ),
  minSpendAmount: yup.number().when('isGlobal', {
    is: true,
    then: (schema) =>
      schema.required('Phải nhập điều kiện khuyến mãi')
        .min(0, 'Số tiền phải từ 0 trở lên')
        .max(2000000, 'Số tiền tối đa 2.000.000')
        .test(
          'minSpendAmount-divisible-by-1000',
          'Số tiền phải chia hết cho 1000',
          (value) => value !== undefined && value % 1000 === 0
        ),
    otherwise: (schema) => schema.optional(),
  }),
  isGlobal: yup.boolean(),
  isActivated: yup.boolean().required('Phải chọn trạng thái kích hoạt'),
});

async function handleSubmit(formValues: any) {
  const startAt = toVietnamTimezoneISOString(new Date(formValues.startAt), false);
  const endAt = toVietnamTimezoneISOString(new Date(formValues.endAt), true);

  await props.onSubmit({ ...formValues, startAt, endAt });
}
</script>

<template>
  <Form :validation-schema="schema" :initial-values="{ isActivated: true, isGlobal: props.isGlobal }"
    :context="{ showTargetSelect: props.showTargetSelect }" @submit="handleSubmit"
    class="grid grid-cols-6 gap-6 bg-white shadow-md rounded-xl p-6 border border-gray-200">
    <div v-if="props.showTargetSelect && props.options?.length" class="col-span-6 md:col-span-2">
      <label class="block text-gray-700 font-medium mb-1">{{ props.selectLabel }}</label>
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
      <Field id="startAt" name="startAt" type="date" class="input" />
      <ErrorMessage name="startAt" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2">
      <label for="endAt" class="block text-gray-700 font-medium mb-1">Kết thúc</label>
      <Field id="endAt" name="endAt" type="date" class="input" />
      <ErrorMessage name="endAt" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2">
      <label for="type" class="block text-gray-700 font-medium mb-1">Loại khuyến mãi</label>
      <Field id="type" name="type" as="select" class="input">
        <option value="">-- Chọn loại --</option>
        <option value="FIXED_AMOUNT">Trừ tiền cố định</option>
        <option value="PERCENTAGE">Phần trăm</option>
      </Field>
      <ErrorMessage name="type" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2">
      <label for="value" class="block text-gray-700 font-medium mb-1">Giá trị</label>
      <Field id="value" name="value" type="number" placeholder="Ví dụ: 10%" class="input" />
      <ErrorMessage name="value" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2">
      <label for="code" class="block text-gray-700 font-medium mb-1">Mã khuyến mãi</label>
      <Field id="code" name="code" type="text" placeholder="Ví dụ: SALE50" class="input" />
      <ErrorMessage name="code" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2">
      <label for="quantity" class="block text-gray-700 font-medium mb-1">Số lượng</label>
      <Field id="quantity" name="quantity" type="number" placeholder="Nhập số lượng" class="input" />
      <ErrorMessage name="quantity" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2">
      <label for="maxDiscountAmount" class="block text-gray-700 font-medium mb-1">Giảm tối đa</label>
      <Field id="maxDiscountAmount" name="maxDiscountAmount" type="number" placeholder="VD: 100000" class="input" />
      <ErrorMessage name="maxDiscountAmount" class="error" />
    </div>

    <div v-if="props.isGlobal" class="col-span-6 md:col-span-2">
      <label for="minSpendAmount" class="block text-gray-700 font-medium mb-1">Cho đơn hàng từ</label>
      <Field id="minSpendAmount" name="minSpendAmount" type="number" placeholder="VD: 100000" class="input" />
      <ErrorMessage name="minSpendAmount" class="error" />
    </div>

    <div class="col-span-6 md:col-span-2 flex items-center space-x-3">
      <label class="text-gray-700 font-medium">Kích hoạt mã</label>
      <Field name="isActivated" v-slot="{ field }">
        <ElSwitch :model-value="field.value" @update:model-value="field.onChange" />
      </Field>
      <ErrorMessage name="isActivated" class="error" />
    </div>

    <div class="col-span-4 col-start-3 flex gap-4 mt-4">
      <SecondaryButton label="Quay lại" :onClick="() => router.back()" />
      <PrimaryButton label="Tạo mã khuyến mãi" />
    </div>
  </Form>
</template>

<style lang="postcss" scoped>
.input {
  @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400;
}

.error {
  @apply text-red-500 text-sm mt-1 block;
}
</style>
