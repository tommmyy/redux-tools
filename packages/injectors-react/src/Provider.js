import React, { useContext, useMemo } from 'react';
import { mergeDeepWith, flip, or } from 'ramda';
import PropTypes from 'prop-types';
import { Provider as ReactReduxProvider } from 'react-redux';
import { DEFAULT_FEATURE } from '@redux-tools/namespaces';

import { NamespaceContext } from './contexts';

// NOTE: `flip(or)` gives priority to second argument.
const mergeContextValues = mergeDeepWith(flip(or));

const Provider = ({ children, feature, namespace, store, useNamespace }) => {
	const context = useContext(NamespaceContext);

	const nextContext = useMemo(
		() =>
			mergeContextValues(context, {
				// NOTE: Defaulting here is safer than using `Provider.defaultProps`,
				// because passing `null` would not result in a fallback to `DEFAULT_FEATURE`.
				namespaces: { [feature || DEFAULT_FEATURE]: namespace },
				useNamespace,
			}),
		[context, feature, namespace, useNamespace]
	);

	const providerElement = (
		<NamespaceContext.Provider value={nextContext}>{children}</NamespaceContext.Provider>
	);

	return store ? (
		<ReactReduxProvider store={store}>{providerElement}</ReactReduxProvider>
	) : (
		providerElement
	);
};

Provider.propTypes = {
	children: PropTypes.node.isRequired,
	feature: PropTypes.string,
	namespace: PropTypes.string,
	store: PropTypes.object,
	useNamespace: PropTypes.func,
};

export default Provider;
