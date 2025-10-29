<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import { ElDialog } from "element-plus";
import { loadStripe, type Stripe, type StripeElements } from "@stripe/stripe-js";
import { notifyError, notifySuccess } from "../../../utils/notification.utils";
import { closeLoading, openLoading } from "../../../utils/loading.utils";
import { useRouter } from "vue-router";

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

const props = defineProps<{
    clientSecret: string | null;
}>();

const emit = defineEmits(["close"]);

const isVisible = ref(true);
const stripe = ref<Stripe | null>(null);
const elements = ref<StripeElements | null>(null);

watch(
    () => props.clientSecret,
    async (secret) => {
        if (!secret || !stripePublicKey) return;

        stripe.value = await loadStripe(stripePublicKey);
        if (!stripe.value) return notifyError("Không thể khởi tạo Stripe");

        elements.value = stripe.value.elements();

        const style = {
            base: {
                color: "#32325d",
                fontFamily: "Inter, system-ui, sans-serif",
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#fa755a" },
        };

        const cardNumber = elements.value.create("cardNumber", { style });
        const cardExpiry = elements.value.create("cardExpiry", { style });
        const cardCvc = elements.value.create("cardCvc", { style });

        cardNumber.mount("#card-number");
        cardExpiry.mount("#card-expiry");
        cardCvc.mount("#card-cvc");
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    ["card-number", "card-expiry", "card-cvc"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = "";
    });
});

const router = useRouter();

async function handleSubmit() {
    if (!stripe.value || !elements.value || !props.clientSecret)
        return notifyError("Stripe chưa sẵn sàng!");

    const loading = openLoading("Đang thanh toán");

    try {
        const { paymentIntent, error } = await stripe.value.confirmCardPayment(props.clientSecret, {
            payment_method: {
                card: elements.value.getElement("cardNumber")!,
                billing_details: { name: "Khách hàng test" },
            },
        });

        if (error) {
            notifyError(error.message || "Hãy thử lại", "Thanh toán thất bại");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
            notifySuccess("Thanh toán thành công, hãy theo dõi đơn hàng nhé!");
            isVisible.value = false;
            router.back();
        }
    } catch (error: any) {
        notifyError("Lỗi thanh toán: ", error.messaage);
    } finally {
        closeLoading(loading);
    }
}
</script>

<template>
    <ElDialog v-model="isVisible" title="Thanh toán đơn hàng" width="480px" class="rounded-2xl" @close="emit('close')">
        <form id="payment-form" @submit.prevent="handleSubmit" class="space-y-6">
            <div class="bg-white/90 border rounded-2xl shadow-sm p-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-700">Thông tin thẻ</h3>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-600">Số thẻ</label>
                    <div id="card-number"
                        class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition focus-within:ring-2 ring-blue-500" />
                </div>

                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-600">Ngày hết hạn</label>
                        <div id="card-expiry"
                            class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition focus-within:ring-2 ring-blue-500" />
                    </div>
                    <div class="space-y-2">
                        <label class="block text-sm font-medium text-gray-600">Mã CVC</label>
                        <div id="card-cvc"
                            class="p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition focus-within:ring-2 ring-blue-500" />
                    </div>
                </div>
            </div>

            <button type="submit"
                class="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold py-3 rounded-xl shadow hover:opacity-90 transition disabled:opacity-60">
                <span>Thanh toán ngay</span>
            </button>
        </form>
    </ElDialog>
</template>

<style scoped>
:deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
}
</style>
