<script setup lang="ts">
import { ElCard, ElTimeline, ElTimelineItem } from 'element-plus';
import { formatDateTimeString } from '../../../utils/time.utils';
import type { Order } from '../../../types/order.types';
import { computed, type ComputedRef } from 'vue';
import type { OrderNote } from '../../../types/order-note.types';
import { ORDER_NOTE_AUTHOR, ORDER_NOTE_TYPE } from '../../../constants/order-notes';

const props = defineProps<{ order: Order }>();

const userNote: ComputedRef<OrderNote | undefined> = computed(() => {
    return props.order?.orderNotes?.find(
        orderNote =>
            orderNote.authorType === ORDER_NOTE_AUTHOR.USER &&
            orderNote.noteType === ORDER_NOTE_TYPE.USER_NOTE
    );
});

</script>

<template>
    <ElTimeline class="custom-timeline">
        <ElTimelineItem :timestamp="formatDateTimeString(props.order.placedAt)" placement="top">
            <ElCard class="timeline-card">
                <h4 class="timeline-title">Đã đặt hàng</h4>
                <p><span class="customer-name">{{ props.order.user.name }}</span> đã đặt hàng và đang chờ xác nhận.</p>
                <p v-if="userNote" class="user-note">
                    <span class="note-label">Lưu ý:</span> {{ userNote.message }}
                </p>
            </ElCard>
        </ElTimelineItem>

        <ElTimelineItem v-if="props.order.confirmedAt" :timestamp="formatDateTimeString(props.order.confirmedAt)"
            placement="top">
            <ElCard class="timeline-card">
                <h4 class="timeline-title">Đã duyệt</h4>
                <p>
                    Đơn hàng đã được duyệt, nhân viên đang chuẩn bị giao cho
                    <span class="customer-name">{{ props.order.user.name }}</span>.
                </p>
            </ElCard>
        </ElTimelineItem>

        <ElTimelineItem v-if="props.order.deliveringAt" :timestamp="formatDateTimeString(props.order.deliveringAt)"
            placement="top">
            <ElCard class="timeline-card">
                <h4 class="timeline-title">Đang giao</h4>
                <p>Đơn hàng đang trên đường giao đến <span class="customer-name">{{ props.order.user.name }}</span>.</p>
            </ElCard>
        </ElTimelineItem>

        <ElTimelineItem v-if="props.order.deliveredAt" :timestamp="formatDateTimeString(props.order.deliveredAt)"
            placement="top">
            <ElCard class="timeline-card">
                <h4 class="timeline-title">Đã nhận</h4>
                <p><span class="customer-name">{{ props.order.user.name }}</span>. đã nhận hàng thành công</p>
            </ElCard>
        </ElTimelineItem>

        <ElTimelineItem v-if="props.order.cancelledAt" :timestamp="formatDateTimeString(props.order.cancelledAt)"
            placement="top" color="#dc2626">
            <ElCard class="timeline-card cancelled">
                <h4 class="timeline-title">Đã hủy</h4>
                <p>Đơn hàng đã bị hủy</p>
            </ElCard>
        </ElTimelineItem>
    </ElTimeline>
</template>

<style lang="postcss" scoped>
.custom-timeline {
    --el-timeline-node-color: #fb923c;
}

.timeline-card {
    @apply bg-orange-50 border border-orange-200 rounded-xl shadow-sm;
}

.timeline-title {
    @apply font-bold text-orange-600 mb-1;
}

.timeline-card.cancelled {
    @apply bg-red-50 border-red-200;
}

.customer-name {
    font-weight: 600;
    background: linear-gradient(to right, #f59e0b, #fb923c);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
}

.user-note {
    margin-top: 0.75rem;
    padding: 0.6rem 0.8rem;
    background-color: #fff7ed;
    border-left: 4px solid #fb923c;
    border-radius: 0.5rem;
    font-size: 0.9rem;
    font-style: italic;
    color: #78350f;
    transition: all 0.2s ease-in-out;
}

.user-note:hover {
    background-color: #ffedd5;
}

.note-label {
    font-weight: 600;
    color: #c2410c;
    margin-right: 0.25rem;
}
</style>
