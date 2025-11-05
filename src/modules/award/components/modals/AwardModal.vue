<script setup lang="ts">
import * as yup from "yup"
import { ErrorMessage, Field, Form } from 'vee-validate';
import PrimaryButton from '../../../../components/buttons/PrimaryButton.vue';
import SecondaryButton from '../../../../components/buttons/SecondaryButton.vue';
import { ElDialog, ElSwitch } from 'element-plus';
import { ref } from 'vue';
import type { AwardCreateRequest } from "../../../../types/award.types";

const emit = defineEmits(["create-award", "update-award", "close"]);

const isVisible = ref<boolean>(true);

const schema = yup.object({
    type: yup
        .string()
        .required("Vui lòng chọn loại khuyến mãi")
        .oneOf(["FIXED_AMOUNT", "PERCENTAGE"], "Loại khuyến mãi không hợp lệ"),
    minValue: yup
        .number()
        .typeError("Vui lòng nhập giá trị thưởng nhỏ nhất")
        .required("Vui lòng nhập giá trị thưởng nhỏ nhất")
        .min(1, "Giá trị thưởng nhỏ nhất phải từ 1 đến 2.000.000")
        .max(2000000, "Giá trị thưởng nhỏ nhất phải từ 1 đến 2.000.000")
        .when("type", {
            is: "FIXED_AMOUNT",
            then: (schema) =>
                schema.test(
                    "divisible-by-1000",
                    "Giá trị thưởng nhỏ nhất (cố định) phải chia hết cho 1000",
                    (value) => value !== undefined && value % 1000 === 0
                ),
        })
        .when("type", {
            is: "PERCENTAGE",
            then: (schema) =>
                schema
                    .min(1, "Giá trị thưởng phần trăm phải nằm trong khoảng 1–100")
                    .max(100, "Giá trị thưởng phần trăm phải nằm trong khoảng 1–100"),
        }),
    maxValue: yup
        .number()
        .typeError("Vui lòng nhập giá trị thưởng lớn nhất")
        .required("Vui lòng nhập giá trị thưởng lớn nhất")
        .min(1, "Giá trị thưởng lớn nhất phải từ 1 đến 2.000.000")
        .max(2000000, "Giá trị thưởng lớn nhất phải từ 1 đến 2.000.000")
        .when("type", {
            is: "FIXED_AMOUNT",
            then: (schema) =>
                schema.test(
                    "divisible-by-1000",
                    "Giá trị thưởng lớn nhất (cố định) phải chia hết cho 1000",
                    (value) => value !== undefined && value % 1000 === 0
                ),
        })
        .when("type", {
            is: "PERCENTAGE",
            then: (schema) =>
                schema
                    .min(1, "Giá trị thưởng phần trăm phải nằm trong khoảng 1–100")
                    .max(100, "Giá trị thưởng phần trăm phải nằm trong khoảng 1–100"),
        })
        .test("greater-than-min", "Giá trị thưởng lớn nhất phải lớn hơn giá trị nhỏ nhất", function (value) {
            const { minValue } = this.parent;
            if (value == null || minValue == null) return true;
            return Number(value) > Number(minValue);
        }),
    quantity: yup
        .number()
        .typeError("Vui lòng nhập số phần thưởng")
        .required("Vui lòng nhập số phần thưởng")
        .min(1, "Số phần thưởng phải từ 1 đến 1.000.000")
        .max(1000000, "Số phần thưởng phải từ 1 đến 1.000.000"),
    maxDiscountAmount: yup
        .number()
        .typeError("Vui lòng nhập số tiền giảm tối đa")
        .required("Vui lòng nhập số tiền giảm tối đa")
        .min(1, "Số tiền giảm tối đa phải từ 1 đến 2.000.000")
        .max(2000000, "Số tiền giảm tối đa phải từ 1 đến 2.000.000")
        .test(
            "divisible-by-1000",
            "Số tiền giảm tối đa phải chia hết cho 1000",
            (value) => value! % 1000 === 0
        ),
    minSpendAmount: yup
        .number()
        .typeError("Vui lòng nhập điều kiện khuyến mãi")
        .required("Vui lòng nhập điều kiện khuyến mãi")
        .min(1, "Điều kiện khuyến mãi phải từ 1 đến 2.000.000")
        .max(2000000, "Điều kiện khuyến mãi phải từ 1 đến 2.000.000")
        .test(
            "divisible-by-1000",
            "Điều kiện khuyến mãi phải chia hết cho 1000",
            (value) => value! % 1000 === 0
        ),
    isActivated: yup.boolean().required(),
});

const handleSubmit = (formValues: any) => {
    const formData: AwardCreateRequest = {
        type: formValues.type,
        minValue: formValues.minValue,
        maxValue: formValues.maxValue,
        quantity: formValues.quantity,
        maxDiscountAmount: formValues.maxDiscountAmount,
        minSpendAmount: formValues.minSpendAmount,
        isActivated: formValues.isActivated,
    }
    emit('create-award', formData);
    emit('close');
}
</script>

<template>
    <ElDialog v-model="isVisible" title="Thêm phần thưởng cho độ khó" width="800px" @close="emit('close')">
        <Form :validation-schema="schema" @submit="handleSubmit" :initial-values="{ isActivated: true }"
            class="grid grid-cols-3 gap-4 items-start">
            <div>
                <label for="type" class="block text-gray-700 font-medium mb-1">Loại khuyến mãi</label>
                <Field id="type" name="type" as="select" class="input">
                    <option value="">-- Chọn loại --</option>
                    <option value="FIXED_AMOUNT">Trừ tiền cố định</option>
                    <option value="PERCENTAGE">Phần trăm</option>
                </Field>
                <ErrorMessage name="type" class="error" />
            </div>

            <div>
                <label for="minValue" class="block text-gray-700 font-medium mb-1">Giá trị thưởng nhỏ nhất</label>
                <Field id="minValue" name="minValue" type="number" min="1" max="2000000" class="input"></Field>
                <ErrorMessage name="minValue" class="error"></ErrorMessage>
            </div>


            <div>
                <label for="maxValue" class="block text-gray-700 font-medium mb-1">Giá trị thưởng lớn nhất</label>
                <Field id="maxValue" name="maxValue" type="number" min="1" max="2000000" class="input"></Field>
                <ErrorMessage name="maxValue" class="error"></ErrorMessage>
            </div>

            <div>
                <label for="quantity" class="block text-gray-700 font-medium mb-1">Số phần thưởng</label>
                <Field id="quantity" name="quantity" type="number" min="1" max="1000000" class="input"></Field>
                <ErrorMessage name="quantity" class="error"></ErrorMessage>
            </div>

            <div>
                <label for="maxDiscountAmount" class="block text-gray-700 font-medium mb-1">Số tiền giảm tối đa</label>
                <Field id="maxDiscountAmount" name="maxDiscountAmount" type="number" min="1" max="2000000"
                    class="input"></Field>
                <ErrorMessage name="maxDiscountAmount" class="error"></ErrorMessage>
            </div>

            <div>
                <label for="minSpendAmount" class="block text-gray-700 font-medium mb-1">Áp dụng cho đơn từ</label>
                <Field id="minSpendAmount" name="minSpendAmount" type="number" min="1" max="2000000" class="input">
                </Field>
                <ErrorMessage name="minSpendAmount" class="error"></ErrorMessage>
            </div>

            <div>
                <label class="block text-gray-700 font-medium mb-1">Kích hoạt phần thưởng</label>
                <Field name="isActivated" v-slot="{ field }">
                    <ElSwitch :model-value="field.value" @update:model-value="field.onChange" />
                </Field>
                <ErrorMessage name="isActivated" class="error" />
            </div>

            <div class="col-start-3 flex justify-end space-x-2">
                <SecondaryButton :onClick="() => emit('close')" label="Hủy" />
                <PrimaryButton label="Lưu" />
            </div>
        </Form>
    </ElDialog>
</template>

<style lang="postcss" scoped>
.input {
    @apply w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400;
}

.error {
    @apply text-red-500 text-sm mt-1 block;
}
</style>
