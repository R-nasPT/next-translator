"use client";

import { Button, InputField, SearchInput } from "@/components/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFulfillmentQuery } from "../services/fetchFulfillment";
import { StatusBadge } from "@/components/common";
import { IoSearchCircleOutline, MdErrorOutline, RePrint } from "@/lib/icons";
import { FulfillmentData } from "@/types";
import { DispatchLabel } from "@/documents";
import { useReactToPrint } from "react-to-print";
import { useCreateFulfillmentDispatch } from "../services/fulfillmentDispatch";
import { useDeliveryorderIds } from "@/services";
import NotificationDialog from "@/components/common/popups/NotificationDialog";
import useNotification from "@/hooks/useNotification";

export default function DispatchProcess() {
  const [batchNumber, setBatchNumber] = useState("");
  const [dispatchBatchNumber, setDispatchBatchNumber] = useState("");
  const [fulfillmentCode, setFulfillmentCode] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enteredFulfillmentCodes, setEnteredFulfillmentCodes] = useState<string[]>([]);
  const [matchedItems, setMatchedItems] = useState<FulfillmentData[]>([]);
  const [submittedItems, setSubmittedItems] = useState<FulfillmentData[]>([]);
  const bathPrintRef = useRef<HTMLDivElement>(null);

  const { data } = useFulfillmentQuery();
  const { mutateAsync } = useCreateFulfillmentDispatch();

  const { notification, showNotification, hideNotification } = useNotification();


  const handleFulfillmentCodeEnter = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && fulfillmentCode.trim() !== "") {
      const matchItem = data?.find((item) =>
          item.code === fulfillmentCode ||
          item.courierTrackingCode === fulfillmentCode
      );

      if (!matchItem)
        showNotification(
          `No matching item found for fulfillment code: ${fulfillmentCode}`,
          "success"
        );

      if (matchItem) {
        if (matchItem.status !== "packed") {
          showNotification(
            `Item with fulfillment code ${fulfillmentCode} cannot be matched because it is already in status "${matchItem.status}".`,
            "info",
          );

        } else if (enteredFulfillmentCodes.includes(fulfillmentCode)) {
          showNotification(
            `Fulfillment code ${fulfillmentCode} has already been entered.`,
            "error"
          );

        } else {
          setEnteredFulfillmentCodes((prev) => [...prev, fulfillmentCode]);

          if (!matchedItems.some((item) => item.id === matchItem.id)) {
            setMatchedItems((prev) => [...prev, matchItem]);
          }
        }

        setFulfillmentCode("");
      }
    }
  };


  return (
    <>

      <NotificationDialog
        message={notification?.message || ""}
        type={notification?.type}
        open={notification?.isOpen || false}
        onClose={hideNotification}
      />
    </>
  );
}
