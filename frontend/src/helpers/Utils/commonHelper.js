import _ from 'lodash';
import { AuthURLConstant } from 'constants/index';

export const capitalizeFLetter = (string) => {
	return string[0].toUpperCase() + string.slice(1);
};

export const isValidEmail = (value) => {
	return value && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(value);
};

export const formatPhoneNumber = (phone) => {
	return phone.replace(/[^+\d]+/g, '');
};

export const idGenerator = () => {
	return Math.floor(Math.random() * 100000);
};

export const isAuthURL = (url) => {
	const regex = /\/password-reset\/.*/gm;
	return regex.test(url) || _.includes(_.values(AuthURLConstant), url);
};

// export const linkify = (inputText) => {
// 	var replacedText, replacePattern1, replacePattern2, replacePattern3;
//
// 	//URLs starting with http://, https://, or ftp://
// 	replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gim;
// 	replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');
//
// 	//URLs starting with "www." (without // before it, or it'd re-link the ones done above).
// 	replacePattern2 = /(^|[^\\/])(www\.[\S]+(\b|$))/gim;
// 	replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');
//
// 	//Change email addresses to mailto:: links.
// 	replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z0-9\\-]+?(\.[a-zA-Z]{2,6})+)/gim;
// 	replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');
//
// 	return replacedText;
// };

export const geValidUrl = (url, ubSecureUrl = false) => {
	if (!url.match(/^[a-zA-Z]+:\/\//)) {
		if (ubSecureUrl) {
			return 'http://' + url;
		}
		return 'https://' + url;
	}

	return url;
};

export const randomColor = () => {
	let hex = Math.floor(Math.random() * 0xffffff);
	return '#' + hex.toString(16);
};

/**
 * Check if the given url can be found
 * in one of the given parent's children
 *
 * @param parent
 * @param url
 * @returns {boolean}
 */
export const isUrlInChildren = (parent, url) => {
	if (!parent.children) {
		return false;
	}

	for (let i = 0; i < parent.children.length; i++) {
		if (parent.children[i].children) {
			if (isUrlInChildren(parent.children[i], url)) {
				return true;
			}
		}

		if (parent.children[i].link === url || url.includes(parent.children[i].link)) {
			return true;
		}
	}

	return false;
};
