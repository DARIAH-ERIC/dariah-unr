"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import type { usePagination } from "@/components/admin/use-pagination";
import { IconButton } from "@/components/ui/icon-button";
import { createKey } from "@/lib/create-key";

interface PaginationProps {
	pagination: ReturnType<typeof usePagination>;
}

export function Pagination(props: PaginationProps) {
	const { pagination } = props;

	return (
		<ul className="flex gap-x-1">
			<li>
				<IconButton
					isDisabled={pagination.currentPage === 1}
					onPress={() => {
						pagination.setCurrentPage((page) => {
							if (page > 1) return page - 1;
							return page;
						});
					}}
				>
					<ChevronLeftIcon className="size-4 shrink-0" />
				</IconButton>
			</li>

			{pagination.links.map((link, index) => {
				if (link.type === "ellipsis") {
					return <span key={createKey(link.type, index)}>...</span>;
				}

				return (
					<li key={link.page}>
						<IconButton
							isDisabled={link.page === pagination.currentPage}
							onPress={() => {
								pagination.setCurrentPage(link.page);
							}}
						>
							<span>{link.page}</span>
						</IconButton>
					</li>
				);
			})}

			<li>
				<IconButton
					isDisabled={pagination.currentPage === pagination.pages}
					onPress={() => {
						pagination.setCurrentPage((page) => {
							if (page < pagination.pages) return page + 1;
							return page;
						});
					}}
				>
					<ChevronRightIcon className="size-4 shrink-0" />
				</IconButton>
			</li>
		</ul>
	);
}
