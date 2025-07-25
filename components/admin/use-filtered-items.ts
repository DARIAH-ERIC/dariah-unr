import { useEffectEvent } from "@react-aria/utils";
import { useCallback, useMemo, useState } from "react";

export const EMPTY_FILTER = "_all_";

type FilterFunction<T> = (item: T, filterText: string | null) => boolean;

export function useFilteredItems<T>(
	items: Array<T>,
	filterFn: FilterFunction<T>,
): [Array<T>, (text: string | null) => void] {
	const [filterText, setFilterText] = useState<string | null>(null);

	const filterFunction = useEffectEvent(filterFn);

	const filteredItems = useMemo(() => {
		if (filterText == null || filterText === EMPTY_FILTER || filterText.trim().length === 0) {
			return items;
		}

		return items.filter((item) => {
			return filterFunction(item, filterText);
		});
	}, [items, filterFunction, filterText]);

	const setFilter = useCallback((text: string | null) => {
		setFilterText(text);
	}, []);

	return [filteredItems, setFilter];
}
