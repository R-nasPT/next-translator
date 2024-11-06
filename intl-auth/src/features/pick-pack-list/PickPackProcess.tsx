"use client";

import { Button, InputField, Switch } from "@/components/ui";
import { useRouter } from "@/navigation";
import { useReactMediaRecorder } from "react-media-recorder";
import { useDeliveryOrdersId } from "@/services";
import { useEffect, useState } from "react";
import { Item } from "@/types";
import VideoRecordingSection from "./VideoRecordingSection";
interface PickPackProcessProps {
  orderId: string;
}

interface TrackedItem extends Item {
  pickedAmount: number;
}

interface PackedItem extends TrackedItem {
  packedAmount: number; // เพิ่ม field ใหม่เพื่อเก็บจำนวนที่แพ็คในแต่ละครั้ง
}

interface PackedBox {
  items: PackedItem[];
  boxCode: string;
  trackingNumber: string;
  weight: number;
}

export default function PickPackProcess({ orderId }: PickPackProcessProps) {
  const router = useRouter();
  const [productBarcode, setProductBarcode] = useState("");
  const [boxCode, setBoxCode] = useState("");
  const [totalWeight, setTotalWeight] = useState("");
  const [trackedItems, setTrackedItems] = useState<TrackedItem[]>([]);
  const [packedBoxes, setPackedBoxes] = useState<PackedBox[]>([]);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const { data: orders } = useDeliveryOrdersId(orderId);
  console.log(orders);
  const {
    status,
    startRecording,
    stopRecording,
    previewStream,
    mediaBlobUrl,
    clearBlobUrl,
  } = useReactMediaRecorder({
    audio: false,
    video: { width: 1280, height: 720, frameRate: 24 },
    // blobPropertyBag: { type: "video/mp4" },
  });

  const isAllItemsPicked = trackedItems.every(
    (item) => item.pickedAmount === item.amount
  );

  const handleStartRecording = () => {
    setStartTime(new Date());
    setEndTime(null);
    startRecording();
  };

  const handleStopRecording = () => {
    stopRecording();
    setEndTime(new Date());
    // router.push(`/pick-pack-list?batchNumber=${orders?.properties.launchpadBatchNumber}`)
  };

  const handleBarcodeSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const foundItem = trackedItems.find(
        (item) => item.barcode === productBarcode
      );

      if (!foundItem) {
        console.log("ไม่พบสินค้าที่มี Barcode นี้ในรายการ");
      } else if (foundItem.pickedAmount >= foundItem.amount) {
        console.log(
          `สินค้า ${foundItem.name} ได้หยิบครบจำนวนแล้ว (${foundItem.amount} ชิ้น)`
        );
      } else if (foundItem.pickedAmount < foundItem.amount) {
        setTrackedItems((prevItems) =>
          prevItems.map((item) =>
            item.barcode === productBarcode && item.pickedAmount < item.amount
              ? { ...item, pickedAmount: item.pickedAmount + 1 }
              : item
          )
        );

        const updatedItem = trackedItems.find(
          (item) => item.barcode === productBarcode
        );
        if (
          updatedItem &&
          updatedItem.pickedAmount + 1 === updatedItem.amount
        ) {
          console.log(`หยิบสินค้า ${foundItem.name} ครบจำนวนแล้ว!`);
        }
      }

      setProductBarcode("");
    }
  };

  const handlePrintBox = () => {
    if (isSwitchOn || isAllItemsPicked) {
      // คำนวณจำนวน packedAmount สำหรับแต่ละ item
      const itemsToPack = trackedItems
        .filter((item) => item.pickedAmount > 0)
        .map((item) => {
          // หาผลรวมของ packedAmount ที่เคยแพ็คไปแล้วสำหรับ item นี้
          const totalPackedAmount = packedBoxes.reduce((sum, box) => {
            const packedItem = box.items.find(
              (packed) => packed.barcode === item.barcode
            );
            return sum + (packedItem?.packedAmount || 0);
          }, 0);

          // คำนวณจำนวนที่จะแพ็คในครั้งนี้ (pickedAmount ปัจจุบัน - จำนวนที่เคยแพ็คไปแล้ว)
          const amountToPackThisTime = item.pickedAmount - totalPackedAmount;

          return {
            ...item,
            packedAmount: amountToPackThisTime,
          };
        })
        .filter((item) => item.packedAmount > 0); // เอาเฉพาะ items ที่มีจำนวนที่ต้องแพ็คมากกว่า 0

      if (itemsToPack.length > 0) {
        const newBox: PackedBox = {
          items: itemsToPack,
          boxCode,
          // boxCode: "BOX-L",
          trackingNumber: `THK${Math.random().toString().slice(2, 14)}`,
          weight: Number(totalWeight),
          // weight: 1000,
        };

        setPackedBoxes((prev) => [...prev, newBox]);
      }
    }
  };

  const canPrintBox = () => {
    const itemsToPack = trackedItems
      .filter((item) => item.pickedAmount > 0)
      .map((item) => {
        const totalPackedAmount = packedBoxes.reduce((sum, box) => {
          const packedItem = box.items.find(
            (packed) => packed.barcode === item.barcode
          );
          return sum + (packedItem?.packedAmount || 0);
        }, 0);

        const amountToPackThisTime = item.pickedAmount - totalPackedAmount;

        return {
          ...item,
          packedAmount: amountToPackThisTime,
        };
      })
      .filter((item) => item.packedAmount > 0);
      
    return !isAllItemsPicked && (!isSwitchOn || itemsToPack.length === 0);
  };


  useEffect(() => {
    if (orders?.items) {
      setTrackedItems(
        orders.items.map((item) => ({
          ...item,
          pickedAmount: 0,
        }))
      );
    }
  }, [orders?.items]);

  return (
    <div className="p-5 flex">
      <VideoRecordingSection
        orders={orders}
        status={status}
        startRecording={handleStartRecording}
        stopRecording={handleStopRecording}
        previewStream={previewStream}
      />

      <section className="w-1/2 pl-3">
        <div className="flex gap-4 mb-3">
          <Switch onChange={(checked) => setIsSwitchOn(checked)} />
          <InputField
            wrapperClassName="flex-1"
            name="Barcode สินค้า"
            placeholder="Barcode สินค้า"
            value={productBarcode}
            onChange={(e) => setProductBarcode(e.target.value)}
            onKeyDown={handleBarcodeSubmit}
          />
          <Button
            colorScheme="cyan"
            className="px-3 rounded-xl"
            onClick={handlePrintBox}
            disabled={canPrintBox()}
          >
            พิมพ์ใบปะหน้ากล่อง
          </Button>
        </div>
        <div className="flex gap-3 mb-3">
          <InputField
            wrapperClassName="flex-1"
            name="ขนาดกล่อง"
            placeholder="ขนาดกล่อง"
            value={boxCode}
            onChange={(e) => setBoxCode(e.target.value)}
          />
          <InputField
            wrapperClassName="flex-1"
            name="น้ำหนักรวม"
            placeholder="น้ำหนักรวม"
            type="number"
            value={totalWeight}
            onChange={(e) => setTotalWeight(e.target.value)}
          />
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="text-[#3a3a3a] font-normal text-left p-2">
                รหัสสินค้า
              </th>
              <th className="text-[#3a3a3a] font-normal text-left p-2">
                BARCODE
              </th>
              <th className="text-[#3a3a3a] font-normal p-2 whitespace-nowrap">
                หยิบ/จำนวน
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-300">
              <td className="p-2">FD0013TEST-TEST MultiBox-1///</td>
              <td className="p-2">0CG00460</td>
              <td className="p-2 text-center">20 / 20</td>
            </tr>
            <tr className="bg-[#ffa829] border-b border-[#c38529]">
              <td className="p-2">BTZ010TEST-TEST MultiBox-2///</td>
              <td className="p-2">0CG00474</td>
              <td className="p-2 text-center">5 / 12</td>
            </tr>
            {trackedItems.map((item) => (
              <tr
                key={item.code}
                className={`border-b ${
                  item.pickedAmount < item.amount
                    ? "bg-[#ffa829] border-[#c38529]"
                    : "border-gray-300"
                }`}
              >
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.barcode}</td>
                <td className="p-2 text-center">
                  {item.pickedAmount} / {item.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {packedBoxes.map((box) => (
          <div
            key={box.trackingNumber}
            className="mt-7 space-y-5 bg-gray-200 border border-gray-300 p-4 rounded-xl"
          >
            <p className="text-lg">แพ็คแล้ว</p>
            <table className="w-full">
              <thead>
                <tr className="border-b border-black">
                  <th className="text-[#3a3a3a] font-normal text-left p-2">
                    รหัสสินค้า
                  </th>
                  <th className="text-[#3a3a3a] font-normal text-left p-2">
                    BARCODE
                  </th>
                  <th className="text-[#3a3a3a] font-normal p-2">จำนวน</th>
                </tr>
              </thead>
              <tbody>
                {box.items.map((item) => (
                  <tr key={item.code} className="border-b border-black">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.barcode}</td>
                    <td className="p-2 text-center">{item.packedAmount}</td>
                  </tr>
                ))}
                <tr className="border-b border-black">
                  <td className="p-2">FD0013TEST-TEST MultiBox-1///</td>
                  <td className="p-2">0CG00460</td>
                  <td className="p-2 text-center">20</td>
                </tr>
                <tr className="border-b border-black">
                  <td className="p-2">BTZ010TEST-TEST MultiBox-2///</td>
                  <td className="p-2">0CG00474</td>
                  <td className="p-2 text-center">5</td>
                </tr>
              </tbody>
            </table>
            <div className="flex gap-3 py-2">
              <p>รหัสกล่อง : {box.boxCode}</p>
              <p>เลขแทรค : {box.trackingNumber}</p>
              <p>น้ำหนักสุทธิ : {box.weight} g</p>
            </div>
            <div className="flex gap-3 py-2">
              <p>รหัสกล่อง : BOX-L</p>
              <p>เลขแทรค : THK1233012041204012041042</p>
              <p>น้ำหนักสุทธิ : 1000 g</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
