export class ForbiddenError extends Error {
	private static readonly type = "ForbiddenError";

	static is(error: unknown): error is ForbiddenError {
		if (error instanceof ForbiddenError) {
			return true;
		}

		return error instanceof Error && error.name === ForbiddenError.type;
	}

	constructor(request: Request, cause: Error, message = "Not authorized") {
		super(message, { cause });

		this.name = ForbiddenError.type;
	}
}

export class RateLimitError extends Error {
	private static readonly type = "RateLimitError";

	static is(error: unknown): error is RateLimitError {
		if (error instanceof RateLimitError) {
			return true;
		}

		return error instanceof Error && error.name === RateLimitError.type;
	}

	constructor(cause: Error, message = "Rate limit exceeded") {
		super(message, { cause });

		this.name = RateLimitError.type;
	}
}
