// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';

const useDidMountEffect = (func, deps) => {
	const didMount = useRef(false);

	useEffect(() => {
		if (didMount.current) func();
		else didMount.current = true;
		// eslint-disable-next-line
	}, deps);
};

export default useDidMountEffect;
