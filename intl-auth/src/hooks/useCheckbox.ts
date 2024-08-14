import { useCallback, useMemo, useState } from "react";

interface Item {
  id: string;
}

const useCheckbox = (items: Item[]) => {
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});

  const handleSelectAll = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      const newSelectedItems: Record<string, boolean> = {};
      items.forEach((item) => {
        newSelectedItems[item.id] = isChecked;
      });
      setSelectedItems(newSelectedItems);
    },
    [items]
  );

  const handleSelectItem = useCallback((id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const isChecked = e.target.checked;
      setSelectedItems((prev) => ({ ...prev, [id]: isChecked }));
    }, []);

  const isAllSelected = useMemo(() => 
    items.length > 0 && items.every((item) => selectedItems[item.id]),
    [items, selectedItems]
  );

  const selectedCount = useMemo(() => 
    Object.values(selectedItems).filter(Boolean).length,
    [selectedItems]
  );

  const selectedIds = useMemo(() => 
    Object.entries(selectedItems)
      .filter(([_, isSelected]) => isSelected)
      .map(([id, _]) => id),
    [selectedItems]
  );

  const resetSelection = useCallback(() => {
    setSelectedItems({});
  }, []);

  return {
    selectedItems,
    handleSelectAll,
    handleSelectItem,
    isAllSelected,
    selectedCount,
    selectedIds,
    resetSelection,
  };
}

export default useCheckbox
