import { useEffect, useState } from "react";

export function useObjectUrl(buffer: ArrayBufferLike | undefined) {
	const [url, setUrl] = useState<string | undefined>(undefined);

	useEffect(() => {
		if (buffer == null) {
			setUrl(undefined);
			return;
		}

		const blob = new Blob([buffer]);
		const src = URL.createObjectURL(blob);
		setUrl(src);
		return () => {
			URL.revokeObjectURL(src);
		};
	}, [buffer]);

	return url;
}
