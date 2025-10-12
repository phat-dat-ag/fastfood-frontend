export const ROUTE_NAMES = {
  AUTH: {
    SIGN_IN: "SignIn",
    SIGN_UP: "SignUp",
    FORGET_PASSWORD: "ForgetPassword",
  },
  GUEST: {
    HOME: "GuestHome",
  },
  USER: {
    HOME: "UserHome",
    PROFILE: "UserProfile",
    EDIT_PROFILE: "EditUserProfile",
    CHANGE_PASSWORD: "ChangeUserPassword",
  },
  STAFF: {
    HOME: "StaffHome",
    PROFILE: "StaffProfile",
    EDIT_PROFILE: "EditStaffProfile",
    CHANGE_PASSWORD: "ChangeStaffPassword",
  },
  ADMIN: {
    HOME: "AdminHome",
    CUSTOMER_MANAGEMENT: "CustomerManagement",
    STAFF_MANAGEMENT: "StaffManagement",
    CATEGORY_MANAGEMENT: "CategoryManagement",
    PRODUCT_MANAGEMENT: "ProductManagement",
  },
} as const;
