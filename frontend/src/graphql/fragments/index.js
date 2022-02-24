// import { gql } from '@apollo/client';
//
//
// const PROFILE_FRAGMENT = gql`
// 	${IMAGE_FRAGMENT}
// 	${CLOUDINARY_VIDEO_FRAGEMENT}
// 	fragment ProfileFragment on ProfileType {
// 		occupation
// 		id
// 		birthdate
// 		gender
// 		biography
// 		tags
// 		avatar {
// 			...ImageFragment
// 		}
// 		mediaUnion {
// 			__typename
// 			...CloudinaryVideoFragment
// 			...ImageFragment
// 		}
// 		age
// 		birthdate
// 	}
// `;
//
// export const Fragments = {
// 	// PROFILE_FRAGMENT,
// };
