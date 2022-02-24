export const AuthURLConstant = {
	LOGIN: '/login',
	// PASSWORD_RESET: '/password-reset',
	// PASSWORD_RESET_NEW: '/password-reset/:token',
	//
	// REGISTER: '/register',
	// REGISTER_OTP_VERIFICATION: '/register/otp-verification',
	// REGISTER_USER_DETAIL: '/register/user-detail',
	// REGISTER_CREATE_PASSWORD: '/register/create-password',
	// REGISTER_UPLOAD_AVATAR: '/register/upload-avatar',
};

export const AppURLConstant = {
	DASHBOARD: '/app/dashboard',
	USERS: '/app/users',
	SETTINGS: '/app/settings',
	GROUPS: '/app/groups',
};

export const URLConstant = {
	...AuthURLConstant,
	...AppURLConstant,

	HOME: '/',
	// footer links
	// FAQ: '/faq',
	// TERMS: '/terms',
	// PRIVACY: 'privacy',
};
