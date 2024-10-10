"use client";

import confetti, { type Options } from "canvas-confetti";
import { type ReactNode, useEffect } from "react";

interface ConfettiProps {
	isEnabled: boolean;
}

export function Confetti(props: ConfettiProps): ReactNode {
	const { isEnabled } = props;

	useEffect(() => {
		if (!isEnabled) return;

		fire(0.25, {
			spread: 26,
			startVelocity: 55,
		});
		fire(0.2, {
			spread: 60,
		});
		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
		});
		fire(0.1, {
			spread: 120,
			startVelocity: 45,
		});
	}, [isEnabled]);

	return null;
}

const count = 200;

const defaults = {
	origin: { y: 0.7 },
};

/** @see https://www.kirilv.com/canvas-confetti/#realistic */
function fire(particleRatio: number, opts: Options) {
	void confetti({
		...defaults,
		...opts,
		particleCount: Math.floor(count * particleRatio),
	});
}
