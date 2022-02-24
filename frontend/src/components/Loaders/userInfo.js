import React from 'react';
import ContentLoader from 'react-content-loader';

const UserInfoSkeleton = (props) => (
	<ContentLoader
		speed={2}
		width={244}
		height={32}
		viewBox="0 0 244 32"
		backgroundColor="#f3f3f3"
		foregroundColor="#ecebeb"
		{...props}>
		<circle cx="226" cy="16" r="16" />
		<rect x="55" y="5" rx="5" ry="5" width="150" height="10" />
		<rect x="5" y="20" rx="5" ry="5" width="200" height="10" />
	</ContentLoader>
);

export default UserInfoSkeleton;
