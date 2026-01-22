export { AbortError, HttpError, NetworkError, TimeoutError } from "@acdh-oeaw/lib";

export class ForbiddenError extends Error {
	static readonly type = "ForbiddenError";

	static is(error: unknown): error is ForbiddenError {
		if (error instanceof ForbiddenError) {
			return true;
		}

		return error instanceof Error && error.name === ForbiddenError.type;
	}

	constructor(message = "Forbidden", cause?: Error) {
		super(message, { cause });

		this.name = ForbiddenError.type;
	}
}

export class HoneyPotError extends Error {
	static readonly type = "HoneyPotError";

	static is(error: unknown): error is HoneyPotError {
		if (error instanceof HoneyPotError) {
			return true;
		}

		return error instanceof Error && error.name === HoneyPotError.type;
	}

	constructor(message = "Not found", cause?: Error) {
		super(message, { cause });

		this.name = HoneyPotError.type;
	}
}

export class NotFoundError extends Error {
	static readonly type = "NotFoundError";

	static is(error: unknown): error is NotFoundError {
		if (error instanceof NotFoundError) {
			return true;
		}

		return error instanceof Error && error.name === NotFoundError.type;
	}

	constructor(message = "Not found", cause?: Error) {
		super(message, { cause });

		this.name = NotFoundError.type;
	}
}

export class RateLimitError extends Error {
	static readonly type = "RateLimitError";

	static is(error: unknown): error is RateLimitError {
		if (error instanceof RateLimitError) {
			return true;
		}

		return error instanceof Error && error.name === RateLimitError.type;
	}

	constructor(message = "Too many requests", cause?: Error) {
		super(message, { cause });

		this.name = RateLimitError.type;
	}
}

export class SmtpError extends Error {
	static readonly type = "SmtpError";

	static is(error: unknown): error is SmtpError {
		if (error instanceof SmtpError) {
			return true;
		}

		return error instanceof Error && error.name === SmtpError.type;
	}

	constructor(message = "SMTP error", cause?: Error) {
		super(message, { cause });

		this.name = SmtpError.type;
	}
}

export class UnauthorizedError extends Error {
	static readonly type = "UnauthorizedError";

	static is(error: unknown): error is UnauthorizedError {
		if (error instanceof UnauthorizedError) {
			return true;
		}

		return error instanceof Error && error.name === UnauthorizedError.type;
	}

	constructor(message = "Unauthorized", cause?: Error) {
		super(message, { cause });

		this.name = UnauthorizedError.type;
	}
}

export class ValidationError extends Error {
	static readonly type = "ValidationError";

	static is(error: unknown): error is ValidationError {
		if (error instanceof ValidationError) {
			return true;
		}

		return error instanceof Error && error.name === ValidationError.type;
	}

	constructor(message = "Invalid data", cause?: Error) {
		super(message, { cause });

		this.name = ValidationError.type;
	}
}
