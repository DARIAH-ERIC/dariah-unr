/**
 * Since react 19, the global jsx namespace intentionally no longer points to react,
 * however not all of the ecosystem has caught up yet.
 */

import type * as runtime from "react/jsx-runtime";

declare global {
	namespace JSX {
		type ElementType = runtime.JSX.ElementType;
		interface Element extends runtime.JSX.Element {}
		interface ElementClass extends runtime.JSX.ElementClass {}
		interface ElementAttributesProperty extends runtime.JSX.ElementAttributesProperty {}
		interface ElementChildrenAttribute extends runtime.JSX.ElementChildrenAttribute {}
		type LibraryManagedAttributes<C, P> = runtime.JSX.LibraryManagedAttributes<C, P>;
		interface IntrinsicAttributes extends runtime.JSX.IntrinsicAttributes {}
		interface IntrinsicClassAttributes<T> extends runtime.JSX.IntrinsicClassAttributes<T> {}
		interface IntrinsicElements extends runtime.JSX.IntrinsicElements {}
	}
}
