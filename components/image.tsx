/* eslint-disable @typescript-eslint/no-restricted-imports */

import NextImage, { type ImageProps as NextImageProps } from "next/image";
import type { ReactNode } from "react";

interface ImageProps extends Omit<NextImageProps, "loader"> {}

export function Image(props: Readonly<ImageProps>): ReactNode {
	const { alt, ...rest } = props;

	return <NextImage {...rest} alt={alt} />;
}
