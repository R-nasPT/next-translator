import { useAccount } from "@/services";
import { SearchInput, SearchSelectField } from "../ui";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { generateOptions } from "@/utils";
import { useSearchParams } from "next/navigation";
import DateFilter from "../common/calendar/DateFilter";

interface OrderSearchProps {
  handleMerchantChange: (newPerPage: string) => void;
  handleSearchChange: (newSearch: string) => void;
  handleFieldChange: (newField: string) => void;
  onDateChange: (dates: [Date | null, Date | null]) => void;
}

export default function OrderSearch({
  handleMerchantChange,
  handleSearchChange,
  handleFieldChange,
  onDateChange,
}: OrderSearchProps) {
  const t = useTranslations("INDEX");
  const { data: account, isLoading } = useAccount();
  const [searchValue, setSearchValue] = useState<string>("");
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const field = searchParams.get("field");
  const merchant = searchParams.get("merchant");
  
  const searchOptions = [
    { value: "code", label: "Document Code" },
    { value: "reference", label: "Reference" },
    { value: "customerName", label: "Customer Name" },
    { value: "courier/name", label: "Courier" },
  ];

  const selectedFieldOption = searchOptions.find(option => option.value === field) || undefined;

  const accountOptions = async (inputValue: string) => {
    if (!account) return [];
    return await generateOptions(account, inputValue);
  };

  const getMerchantLabel = (value: string | null): string => {
    const merchantMap = account?.reduce((acc, item) => {
      acc[item.id] = item.name;
      return acc;
    }, {} as Record<string, string>);

    return value && merchantMap ? merchantMap[value] || value : "";
  };

  const selectedMerchantOption = merchant
  ? { value: merchant, label: getMerchantLabel(merchant) }
  : undefined;

  return (
    <section className="flex flex-col md:grid md:grid-cols-2 lg:flex lg:flex-row justify-between lg:items-center gap-2 lg:gap-5">
      <SearchInput
        icon
        placeholder={t("ORDER_SEARCH_FIELD")}
        value={searchQuery}
        onChange={(newValue) => setSearchValue(newValue)}
        onEnterPress={() => handleSearchChange(searchValue)}
        onClearClick={() => {
          setSearchValue("");
          handleSearchChange("");
        }}
      />
      {isLoading ? (
        <div className="bg-slate-200 p-5 flex-1 rounded-full animate-pulse"></div>
      ) : (
        <SearchSelectField
          className="flex-1"
          name="field"
          placeholder={t("OTHERS")}
          options={searchOptions}
          value={selectedFieldOption}
          rounded="100px"
          padding="1.5px 5px"
          onChange={(selectedOption) =>
            handleFieldChange(selectedOption?.value!)
          }
        />
      )}
      <DateFilter onDateChange={onDateChange} />
      {isLoading ? (
        <div className="bg-slate-200 p-5 flex-1 rounded-full animate-pulse"></div>
      ) : (
        <SearchSelectField
          className="flex-1"
          name="merchant"
          placeholder={isLoading ? "Loading" : t("MERCHANT")}
          loadOptions={accountOptions}
          isLoading={isLoading}
          value={selectedMerchantOption}
          rounded="100px"
          padding="1.5px 5px"
          onChange={(selectedOption) =>
            handleMerchantChange(selectedOption?.value!)
          }
        />
      )}
    </section>
  );
}
