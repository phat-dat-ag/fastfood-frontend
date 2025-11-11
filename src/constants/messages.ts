interface Message {
  get: string;
  getError: string;
  create: string;
  createSuccess: string;
  createError: string;
  update: string;
  updateSuccess: string;
  updateError: string;
  delete: string;
  deleteSuccess: string;
  deleteError: string;
}

function createEntityMessages(entityName: string): Message {
  return {
    get: `Đang lấy ${entityName}...`,
    getError: `Có lỗi xảy ra khi lấy thông tin ${entityName}`,
    create: `Đang thêm ${entityName}...`,
    createSuccess: `Đã thêm ${entityName}`,
    createError: `Có lỗi xảy ra khi thêm ${entityName}`,
    update: `Đang cập nhật ${entityName}...`,
    updateSuccess: `Đã cập nhật ${entityName}`,
    updateError: `Có lỗi xảy ra khi cập nhật ${entityName}`,
    delete: `Đang xóa ${entityName}...`,
    deleteSuccess: `Đã xóa ${entityName}`,
    deleteError: `Có lỗi xảy ra khi xóa ${entityName}`,
  };
}

export const CUSTOMER_ACCOUNT_MESSAGES = createEntityMessages(
  "tài khoản khách hàng"
);
export const STAFF_ACCOUNT_MESSAGES = createEntityMessages(
  "tài khoản nhân viên"
);
export const CATEGORY_MESSAGES = createEntityMessages("danh mục");
export const PRODUCT_MESSAGES = createEntityMessages("sản phẩm");
export const CART_MESSAGE = createEntityMessages("giỏ hàng");
export const PROMOTION_CATEGORY_MESSAGE = createEntityMessages(
  "mã khuyến mãi theo danh mục"
);
export const PROMOTION_PRODUCT_MESSAGE = createEntityMessages(
  "mã khuyến mãi theo sản phẩm"
);
export const PROMOTION_ORDER_MESSAGE = createEntityMessages(
  "mã khuyến mãi cho đơn hàng"
);
export const ADDRESS_MESSAGE = createEntityMessages("địa chỉ giao hàng");
export const CASH_ON_DELIVERY_ORDER = createEntityMessages(
  "đơn thanh toán khi nhận hàng"
);
export const STRIPE_PAYMENT_ORDER = createEntityMessages(
  "đơn thanh toán qua Stripe"
);
export const STAFF_MANAGEMENT_ORDER_MESSAGE = createEntityMessages(
  "đơn hàng cho nhân viên quản lý"
);
export const STAFF_MANAGEMENT_ORDER_DETAIL_MESSAGE = createEntityMessages(
  "chi tiết đơn hàng cho nhân viên quản lý"
);
export const ORDER_TRACKING_MESSAGE = createEntityMessages(
  "các đơn hàng đang giao"
);
export const ORDER_TRACKING_DETAIL_MESSAGE = createEntityMessages(
  "chi tiết đơn hàng đang giao"
);
export const ORDER_HISTORY_MESSAGE = createEntityMessages("lịch sử giao hàng");
export const ORDER_HISTORY_DETAIL_MESSAGE = createEntityMessages(
  "chi tiết lịch sử giao hàng"
);
export const ORDER_MESSAGE = createEntityMessages("đơn hàng");
export const REVIEW_MESSAGE = createEntityMessages("đánh giá");
export const ALL_PRODUCT_REVIEW_MESSAGE = createEntityMessages(
  "các đánh giá của sản phẩm"
);
export const TOPIC_MESSAGE = createEntityMessages("chủ đề trò chơi");
export const TOPIC_DIFFICULTY_MESSAGE =
  createEntityMessages("độ khó của chủ đề");
export const AWARD_MESSAGE = createEntityMessages("phần thưởng của độ khó");
export const QUESTION_MESSAGE = createEntityMessages("câu hỏi");
export const CHALLENGE_MESSAGE = createEntityMessages("thử thách");
export const CHALLENGE_HISTORY_MESSAGE = createEntityMessages(
  "lịch sử tham gia thử thách"
);
export const CHALLENGE_HISTORY_DETAIL_MESSAGE = createEntityMessages(
  "chi tiết lịch sử tham gia thử thách"
);
