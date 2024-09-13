import { useAccount } from "@/services";
import { InputField, SearchSelectField } from "../ui";
import { generateOptions } from "@/utils";
import { FilterCondition } from "@/types";
import { useState } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

interface OrderFilterReportProps {
  onSubmit: (formData: {
    dateRange: [Date | null, Date | null];
    merchant: string | null;
    filterConditions: FilterCondition[];
  }) => void;
}

const ClientDateFilter = dynamic(() => import("@/components/common/calendar/DateFilter"), { ssr: false });

export default function OrderFilterReport({
  onSubmit,
}: OrderFilterReportProps) {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [merchant, setMerchant] = useState<string | null>(null);
  const [filterConditions, setFilterConditions] = useState<FilterCondition[]>([]);

  const t = useTranslations();

  const { data: account, isLoading } = useAccount();

  const accountOptions = async (inputValue: string) => {
    if (!account) return [];
    return await generateOptions(account, inputValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      dateRange,
      merchant,
      filterConditions: filterConditions.filter(condition => condition.field && condition.value),
    });
  };

  const searchOptions = [
    { value: "code", label: "Document Code" },
    { value: "reference", label: "Reference" },
    { value: "customerName", label: "Customer Name" },
    { value: "courier/name", label: "Courier" },
  ];

  const addFilterCondition = () => {
    setFilterConditions([...filterConditions, { id: Date.now().toString(), field: '', value: '' }]);
  };

  const removeFilterCondition = (id: string) => {
    setFilterConditions(filterConditions.filter(condition => condition.id !== id));
  };

  const updateFilterCondition = (id: string, field: 'field' | 'value', newValue: string) => {
    setFilterConditions(filterConditions.map(condition =>
      condition.id === id ? { ...condition, [field]: newValue } : condition
    ));
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_0_3px_rgba(0,0,0,0.3)] mb-5">
      <form onSubmit={handleSubmit} className="grid gap-3">
        <div className="grid lg:flex items-center gap-3">
          {isLoading ? (
            <div className="bg-slate-200 p-5 flex-1 rounded-full animate-pulse"></div>
          ) : (
            <SearchSelectField
              className="flex-1"
              name="merchant"
              placeholder={isLoading ? "Loading..." : t("INDEX.MERCHANT")}
              loadOptions={accountOptions}
              isLoading={isLoading}
              onChange={(selectedOption) =>
                setMerchant(selectedOption ? selectedOption.value : null)
              }
            />
          )}
          <ClientDateFilter
            onDateChange={(dates) => setDateRange(dates)}
            rounded="2xl"
            startDate={dateRange[0]}
            endDate={dateRange[1]}
          />
        </div>
        <div className="p-5 border border-[#e0e0e0] rounded-3xl">
          <p className="mb-3 capitalize">{t("INDEX.CONDITION")}</p>
          {filterConditions.map((condition, index) => (
            <>
              <div key={condition.id} className="grid lg:flex gap-3">
                <SearchSelectField
                  className="flex-1"
                  name={`field-${condition.id}`}
                  placeholder={t("INDEX.OTHERS")}
                  options={searchOptions}
                  padding="1.5px 5px"
                  value={searchOptions.find(
                    (option) => option.value === condition.field
                  )}
                  onChange={(selectedOption) =>
                    updateFilterCondition(
                      condition.id,
                      "field",
                      selectedOption ? selectedOption.value : ""
                    )
                  }
                />
                <InputField
                  wrapperStyles="flex-1"
                  className="py-2"
                  labelClassName="top-[8px]"
                  name={`filter-${condition.id}`}
                  placeholder="Value to filter"
                  value={condition.value}
                  onChange={(value) =>
                    updateFilterCondition(condition.id, "value", value)
                  }
                />
                <button
                  type="button"
                  onClick={() => removeFilterCondition(condition.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-300 uppercase"
                >
                  - {t("BUTTON.DEL")}
                </button>
              </div>
              {index < filterConditions.length - 1 && (
                <hr className="border border-[#e0e0e0] my-5" />
              )}
            </>
          ))}
          <button
            type="button"
            onClick={addFilterCondition}
            className="mt-3 border border-[#7649d9] text-[#7649d9] px-2 py-1 rounded-xl hover:bg-[#e9deff] transition-colors duration-300 uppercase"
          >
            + {t("BUTTON.ADD")}
          </button>
        </div>
        <div className="flex gap-2">
          <button
            className={`transition-colors duration-300 px-3 py-2 rounded-full ${
              !dateRange[0] || !dateRange[1]
                ? "bg-[#dedede] text-[#98989a] cursor-not-allowed"
                : "bg-[#1fc7d4] hover:bg-[#2ea5ad] text-white"
            }`}
            type="submit"
            disabled={!dateRange[0] || !dateRange[1]}
          >
            {t("BUTTON.CREATE_PREVIEW")}
          </button>
        </div>
      </form>
    </div>
  );
}
