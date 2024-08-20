import { useAllAccount } from "@/services";
import { SearchSelectField } from "../ui";

export default function OrderSearch() {
  const { data: account } = useAllAccount();
  console.log(account);
  
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
    <section className="flex justify-between items-center gap-5">
      <input
        className="px-5 py-2 rounded-full border border-[#e0e0e0] focus:outline-none bg-[#fafafa] flex-1"
        type="text"
        placeholder="Search"
      />
      <SearchSelectField
        className="w-[300px]"
        name="Select Search"
        placeholder="Select Search"
        loadOptions={loadOptionsFunction}
        rounded="100px"
      />
      <SearchSelectField
        className="w-[300px]"
        name="merchant"
        placeholder="merchant"
        loadOptions={accountOptions}
        rounded="100px"
      />
    </section>
  );
}
