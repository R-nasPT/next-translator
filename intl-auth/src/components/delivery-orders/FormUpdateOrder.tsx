import { FaPlus, RiDeleteBin6Fill } from "@/libs/icons";
import { InputField, SearchSelectField } from "../ui";
import StatusBadge from "./StatusBadge";
import OrderActionButtons from "./OrderActionButtons";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useCourier, useSku } from "@/services";
import { OrderIdTypes } from "@/types";
import { generateOptions } from "@/utils";

interface formProps {
  orders: OrderIdTypes;
  openCancel: (orderCode: string) => void;
}

export default function FormUpdateOrder({ orders, openCancel }: formProps) {
  const t = useTranslations("BUTTON");
  const { data: couriers, isLoading: crsLoading } = useCourier();
  const { data: sku, isLoading: skuLoading } = useSku();
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ mode: "all" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    if (orders) {
      setValue("reference", orders.reference);
      setValue("representativeName", orders.representativeName);
      setValue("customerName", orders.customerName);
      setValue("couriers", {
        value: orders.courier.id,
        label: orders.courier.name,
      });
      setValue("cod", orders.cod);
      setValue("address", orders.deliveryAddress.address);
      setValue("subdistrict", orders.deliveryAddress?.subdistrict);
      setValue("district", orders.deliveryAddress?.district);
      setValue("province", orders.deliveryAddress.province.name);
      setValue("postalCode", orders.deliveryAddress.postalCode);
      setValue("country", orders.deliveryAddress.country.name);
      setValue("mobile", orders.customerPhone);
      setValue("note", orders.note);
      setValue(
        "items",
        orders.items.map((item) => ({
          sku: { value: item.sku.name, label: item.sku.name },
          internalCode: item.internalCode,
          quantity: item.amount,
        }))
      );
      // orders.items.forEach((item, index) => {
      //   setValue(`items.${index}.sku`, item.sku.name);
      //   setValue(`items.${index}.internalCode`, item.internalCode);
      //   setValue(`items.${index}.quantity`, item.amount);
      // });
    }
  }, [orders, setValue]);

  const onHandleSubmit: SubmitHandler<any> = async (data) => {
    console.log(data);
  };

  const courierOptions = async (inputValue: string) => {
    if (!couriers) return [];
    return await generateOptions(couriers, inputValue);
  };

  const skuOptions = async (inputValue: string) => {
    if (!sku) return [];
    return await generateOptions(sku, inputValue, undefined, 1000);
  };

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      <div className="py-5 px-7 lg:px-10 overflow-auto">
        <header className="lg:flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl text-[#280d5f] font-medium">
              {orders?.code}
            </h1>
            <StatusBadge status={orders?.status!} />
          </div>
          <p className="text-[#7a6eaa] text-lg">{orders?.account.name}</p>
        </header>
        <hr className="border border-gray-200 my-5" />
        <section>
          <h2 className="text-2xl text-[#6134bd] font-semibold pb-5">
            Order Detail
          </h2>
          <div className="grid lg:grid-cols-2 gap-3 p-5 bg-gray-50 rounded-2xl">
            <InputField
              name="reference"
              placeholder="reference"
              register={register}
              errors={errors}
            />
            <InputField
              name="representativeName"
              placeholder="Representative Name"
              register={register}
              errors={errors}
              required={false}
            />
            <InputField
              name="customerSocialName"
              placeholder="Customer Social Name"
              register={register}
              errors={errors}
            />
            <InputField
              name="customerName"
              placeholder="Customer Name"
              register={register}
              errors={errors}
              required={false}
            />
            {crsLoading ? (
              "loading..."
            ) : (
              <SearchSelectField
                name="couriers"
                placeholder="Couriers"
                control={control}
                errors={errors}
                loadOptions={courierOptions}
                showArrow={false}
                clearIndicator={false}
                isLoading={crsLoading}
              />
            )}
            <InputField
              name="cod"
              placeholder="COD"
              register={register}
              errors={errors}
            />
            <InputField
              name="address"
              placeholder="Address"
              className="lg:col-span-2"
              register={register}
              errors={errors}
            />
            <InputField
              name="subdistrict"
              placeholder="Subdistrict"
              register={register}
              errors={errors}
              required={false}
            />
            <InputField
              name="district"
              placeholder="District"
              register={register}
              errors={errors}
              required={false}
            />
            <InputField
              name="province"
              placeholder="Province"
              register={register}
              errors={errors}
            />
            <InputField
              name="postalCode"
              placeholder="Postal Code"
              type="number"
              register={register}
              errors={errors}
            />
            <InputField
              name="country"
              placeholder="Country"
              register={register}
              errors={errors}
            />
            <InputField
              name="mobile"
              placeholder="Mobile"
              register={register}
              errors={errors}
            />
          </div>
        </section>
        <section>
          <div className="flex justify-between items-center pr-4">
            <h2 className="text-2xl text-[#6134bd] font-semibold py-5">SKUs</h2>
            <button
              className="flex justify-center items-center gap-2 text-green-400 text-lg px-4 py-1 border border-green-500 rounded-xl hover:bg-green-400 hover:text-white transition-colors duration-300  uppercase"
              type="button"
              onClick={() =>
                append({ sku: "", internalCode: "", quantity: "" })
              }
            >
              {t("ADD")} <FaPlus className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 rounded-2xl">
            {fields.map((fields, index) => (
              <div
                key={fields.id}
                className="grid lg:flex gap-3 bg-gray-50 px-5 py-3 rounded-2xl"
              >
                <SearchSelectField
                  name={`items.${index}.sku`}
                  placeholder="SKU"
                  control={control}
                  errors={errors}
                  loadOptions={skuOptions}
                  isLoading={skuLoading}
                  className="lg:w-[230px]"
                />
                <div className="flex gap-3">
                  <InputField
                    name={`items.${index}.internalCode`}
                    placeholder="Internal Code"
                    register={register}
                    errors={errors}
                  />
                  <InputField
                    name={`items.${index}.quantity`}
                    placeholder="Quantity"
                    type="number"
                    register={register}
                    errors={errors}
                  />
                </div>
                <div className="flex items-center gap-3">
                  <button
                    className="text-red-500 px-4 py-1 border border-red-500 rounded-xl hover:bg-red-400 hover:text-white transition-colors duration-300 uppercase"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    {t("DEL")} -
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl text-[#6134bd] font-semibold py-5">
            Special Instruction
          </h2>
          <InputField
            name="changeAmount"
            placeholder="Change Amount"
            type="number"
            register={register}
            errors={errors}
          />
        </section>
        <section>
          <h2 className="text-2xl text-[#6134bd] font-semibold py-5">Note</h2>
          <InputField
            name="note"
            placeholder="Note"
            register={register}
            errors={errors}
          />
        </section>
        {["draft", "pending", "printed", "packed", "dispatched"].includes(
          orders?.status!
        ) && (
          <button
            className="py-2 mt-4 text-white flex justify-center items-center gap-3 bg-red-500 hover:bg-red-400 rounded-xl w-full transition-colors duration-300"
            type="button"
            onClick={() => openCancel(orders?.id!)}
          >
            <RiDeleteBin6Fill />
            {t("CANCEL")}
          </button>
        )}
      </div>
      <OrderActionButtons status={orders?.status!} display="view" />
    </form>
  );
}
