import { useAccount } from "@/services";
import { SearchSelectField } from "../ui";
import { useTranslations } from "next-intl";

interface OrderSearchProps {
  handleMerchantChange: (newPerPage: string) => void;
  handleSearchChange: (newSearch: string) => void;
  handleFieldChange: (newField: string) => void;
}

export default function OrderSearch({
  handleMerchantChange,
  handleSearchChange,
  handleFieldChange,
}: OrderSearchProps) {
  const t = useTranslations("INDEX");
  const { data: account, isLoading } = useAccount();
  
  const loadOptionsFunction = async (inputValue: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const allOptions = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      { value: "option3", label: "Option 3" },
    ];

    const filteredOptions = allOptions.filter((option) =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return filteredOptions;
  };

  // interface Option {
  //   value: string;
  //   label: string;
  // }

  // const accountOptions = (inputValue: string): Promise<Option[]> => {
  //   return new Promise((resolve) => {
  //     // ตรวจสอบว่า data มีค่าหรือไม่
  //     if (!account) {
  //       resolve([]);
  //       return;
  //     }

  //     // กรองและแปลงข้อมูล
  //     const filteredOptions = account
  //       .filter(item => 
  //         item.name.toLowerCase().includes(inputValue.toLowerCase())
  //       )
  //       .map(item => ({
  //         value: item.id,
  //         label: item.name
  //       }));

  //     resolve(filteredOptions);
  //   });
  // };
  
  const accountOptions = async (inputValue: string) => {
    const filteredOptions = account?.filter(account =>
      account.name.toLowerCase().includes(inputValue.toLowerCase())
    ).map(account => ({
      label: account.name,
      value: account.id,
    })) || [];

    return Promise.resolve(filteredOptions);
  };

  // const accountOptions = async (inputValue: string) => {
  //   if (!account || account.length === 0) {
  //     console.log("No account data available or account is empty");
  //     return [];
  //   }

  //   const allOptions = account.map((acc) => ({
  //     value: acc.id,
  //     label: acc.name,
  //   }));

  //   const filteredOptions = allOptions.filter((option) =>
  //     option.label.toLowerCase().includes(inputValue.toLowerCase())
  //   );

  //   return filteredOptions;
  // };

  return (
    <section className="flex flex-col lg:flex-row justify-between lg:items-center gap-2 lg:gap-5">
      <input
        className="px-5 py-2 rounded-full border border-[#7b6a9d] focus:outline-none flex-1"
        type="search"
        placeholder={t("ORDER_SEARCH_FIELD")}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchChange(e.currentTarget.value);
          }
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
          rounded="100px"
          padding="1.5px 5px"
          onChange={(selectedOption) =>
            handleFieldChange(selectedOption?.value!)
          }
        />
      )}
      {isLoading ? (
        <div className="bg-slate-200 p-5 flex-1 rounded-full animate-pulse"></div>
      ) : (
        <SearchSelectField
          className="flex-1"
          name="merchant"
          placeholder={isLoading ? "Loading" : t("MERCHANT")}
          loadOptions={accountOptions}
          isLoading={isLoading}
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
