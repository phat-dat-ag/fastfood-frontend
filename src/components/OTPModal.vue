<script setup lang="ts">
import * as yup from 'yup';
import { Form, ErrorMessage, Field, type FormContext } from 'vee-validate';

interface OTPModalProps {
    toggleOTPModal: boolean;
    remainingTime: number;
    checkOTP: (otp: string) => Promise<string>;
    resendOTP: () => Promise<void>;
}

interface OTPData {
    otp: string;
}

const schema = yup.object({
    otp: yup.string().required("Vui lòng nhập mã OTP").matches(/^\d{6}$/, "Mã OTP gồm 6 ký tự số"),
})

const props = defineProps<OTPModalProps>();
const emit = defineEmits(["update:toggleOTPModal"]);

async function onSubmit(values: any, formContex: any) {
    const formData: OTPData = values;
    const ctx: FormContext<OTPData> = formContex;

    const message: string = await props.checkOTP(formData.otp);
    if (message)
        ctx.setFieldError("otp", message);
}

</script>
<template>
    <el-dialog :model-value="props.toggleOTPModal"
        @update:model-value="(val: boolean) => emit('update:toggleOTPModal', val)" title="Nhập mã xác nhận" width="500"
        center>
        <p class="text-center">Chúng tôi vừa gửi mã xác nhận đến số điện thoại quý khách</p>
        <p class="text-center">Vui lòng nhập mã xác nhận để hoàn tất</p>
        <div class="flex justify-center mt-4">
            <Form :key="props.toggleOTPModal ? 1 : 0" :validation-schema="schema"
                @submit="(values, formContex) => onSubmit(values, formContex)">
                <div class="mb-2">
                    <Field name="otp" type="text"
                        class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Mã OTP gồm 6 ký tự số" />
                    <ErrorMessage name="otp" class="text-center text-red-500 text-sm mt-1 block" />
                </div>

                <button
                    class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200 font-semibold">Xác
                    nhận</button>
            </Form>
        </div>
        <template #footer>
            <p v-if="props.remainingTime > 0">
                Gửi mã lại sau {{ Math.floor(remainingTime / 60) }}:
                {{ remainingTime % 60 >= 10 ? remainingTime % 60 : `0${remainingTime % 60}` }}
            </p>
            <p v-else class="hover:underline hover:text-blue-500" @click="resendOTP">Gửi lại mã</p>
        </template>
    </el-dialog>
</template>