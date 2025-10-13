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

export const ACCOUNT_MESSAGES = createEntityMessages(
  "tài khoản khách hàng và nhân viên"
);
export const CATEGORY_MESSAGES = createEntityMessages("danh mục");
export const PRODUCT_MESSAGES = createEntityMessages("sản phẩm");
export const CART_MESSAGE = createEntityMessages("giỏ hàng");
