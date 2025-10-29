<script setup lang="ts">
import { ElCard, ElTimeline, ElTimelineItem } from 'element-plus';
import { formatDateTimeString } from '../../../utils/time.utils';
import type { Order } from '../../../types/order.types';

const props = defineProps<{
    order: Order;
}>()
</script>

<template>
    <ElTimeline>
        <ElTimelineItem :timestamp="formatDateTimeString(props.order.placedAt)" placement="top">
            <ElCard>
                <h4 class="font-bold">Đã đặt hàng</h4>
                <p>{{ props.order.user.name }} đã đặt hàng và đang chờ xác nhận</p>
            </ElCard>
        </ElTimelineItem>
        <ElTimelineItem v-if="props.order.confirmedAt" :timestamp="formatDateTimeString(props.order.confirmedAt)"
            placement="top">
            <ElCard>
                <h4 class="font-bold">Đã duyệt</h4>
                <p>Đơn hàng đã được duyệt, nhân viên đang chuẩn bị giao cho bạn</p>
            </ElCard>
        </ElTimelineItem>
        <ElTimelineItem v-if="props.order.deliveringAt" :timestamp="formatDateTimeString(props.order.deliveringAt)"
            placement="top">
            <ElCard>
                <h4 class="font-bold">Đang giao</h4>
                <p>Đơn hàng đang trên đường giao đến {{ props.order.user.name }}</p>
            </ElCard>
        </ElTimelineItem>
        <ElTimelineItem v-if="props.order.deliveredAt" :timestamp="formatDateTimeString(props.order.deliveredAt)"
            placement="top">
            <ElCard>
                <h4 class="font-bold">Đã nhận</h4>
                <p>{{ props.order.user.name }} đã nhận hàng thành công</p>
            </ElCard>
        </ElTimelineItem>
        <ElTimelineItem v-if="props.order.cancelledAt" :timestamp="formatDateTimeString(props.order.cancelledAt)"
            placement="top">
            <ElCard>
                <h4 class="font-bold">Đã hủy</h4>
                <p>Đơn hàng đã bị hủy</p>
            </ElCard>
        </ElTimelineItem>
    </ElTimeline>
</template>