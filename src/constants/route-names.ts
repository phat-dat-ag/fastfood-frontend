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
    CATEGORY_MANAGEMENT: "CategoryManagement",
  },
} as const;
