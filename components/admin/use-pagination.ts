import { createPagination } from "@acdh-oeaw/lib";
import { useMemo, useState } from "react";

interface UsePaginationParams<T> {
	items: Array<T>;
	initialPage?: number;
}

export function usePagination<T>(params: UsePaginationParams<T>) {
	const { initialPage = 1, items } = params;

	const [currentPage, setCurrentPage] = useState(initialPage);

	const pagination = useMemo(() => {
		const pageSize = 50;
		const pages = Math.ceil(items.length / pageSize);
		const currentItems = items.slice((currentPage - 1) * pageSize, currentPage * pageSize);
		const links = createPagination({ page: currentPage, pages });
		return { pages, pageSize, currentPage, currentItems, links, setCurrentPage };
	}, [items, currentPage, setCurrentPage]);

	return pagination;
}
