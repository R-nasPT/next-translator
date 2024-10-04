export interface CheckboxState {
  selectedItems: Record<string, boolean>;
  handleSelectAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectItem: (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAllSelected: boolean;
  selectedCount: number;
  selectedIds: string[];
  resetSelection: () => void;
}
