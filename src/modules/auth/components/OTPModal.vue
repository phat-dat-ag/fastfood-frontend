<script setup lang="ts">
import * as yup from 'yup';
import { Form, ErrorMessage, Field, type FormContext } from 'vee-validate';
import PrimaryButton from '../../../components/buttons/PrimaryButton.vue';
import TextButton from '../../../components/buttons/TextButton.vue';

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
        @update:model-value="(val: boolean) => emit('update:toggleOTPModal', val)" width="480"
        class="rounded-xl shadow-lg" align-center>
        <template #header>
            <h2 class="text-2xl font-bold text-center text-orange-600">Xác nhận OTP</h2>
        </template>

        <div class="text-center text-gray-600 space-y-1 mb-4">
            <p>Chúng tôi đã gửi mã xác nhận đến số điện thoại của bạn.</p>
            <p>Vui lòng nhập mã gồm <span class="font-semibold text-orange-600">6 chữ số</span> để hoàn tất.</p>
        </div>

        <div class="flex justify-center mt-4">
            <Form :key="props.toggleOTPModal ? 1 : 0" :validation-schema="schema"
                @submit="(values, formContext) => onSubmit(values, formContext)" class="w-full max-w-xs space-y-3">
                <div>
                    <Field name="otp" type="text" maxlength="6"
                        class="w-full border border-gray-300 rounded-lg text-center text-lg tracking-widest px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                        placeholder="Nhập OTP" />
                    <ErrorMessage name="otp" class="text-center text-red-500 text-sm mt-1 block" />
                </div>
                <div class="flex justify-center">
                    <PrimaryButton label="Xác nhận" />
                </div>
            </Form>
        </div>
        <template #footer>
            <div class="text-center w-full">
                <p v-if="props.remainingTime > 0" class="text-gray-500 text-sm">
                    Gửi lại mã sau
                    <span class="font-semibold text-orange-600">
                        {{ Math.floor(remainingTime / 60) }}:
                        {{ remainingTime % 60 >= 10 ? remainingTime % 60 : `0${remainingTime % 60}` }}
                    </span>
                </p>
                <TextButton v-else :onClick="resendOTP" label="Gửi lại mã" />
            </div>
        </template>
    </el-dialog>
</template>