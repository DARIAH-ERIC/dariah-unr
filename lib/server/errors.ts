export class ForbiddenError extends Error {
	name = "Forbidden";
}

export class RateLimitError extends Error {
	name = "RateLimit";
}
