import { OrderIdTypes } from "@/types";
import AttachmentSection from "../components/AttachmentSection";
import ConnectionHistorySection from "../components/ConnectionHistorySection";
import DebitNoteSection from "../components/DebitNoteSection";
import DocumentHistorySection from "../components/DocumentHistorySection";
import EditOrderHistorySection from "../components/EditOrderHistorySection";
import FulfillmentsSection from "../components/FulfillmentsSection";

export const ORDER_SECTIONS = [
  {
    Component: AttachmentSection,
    props: (order: OrderIdTypes) => ({ attachments: order?.attachments }),
  },
  {
    Component: DocumentHistorySection,
    props: (order: OrderIdTypes) => ({ id: order?.id }),
  },
  {
    Component: EditOrderHistorySection,
    props: (order: OrderIdTypes) => ({ id: order?.id }),
  },
  {
    Component: DebitNoteSection,
    props: (order: OrderIdTypes) => ({ id: order?.id }),
  },
  {
    Component: ConnectionHistorySection,
    props: (order: OrderIdTypes) => ({ id: order?.id }),
  },
  {
    Component: FulfillmentsSection,
    props: (order: OrderIdTypes) => ({ id: order?.id }),
  },
  // ---- แบบรับหลายๆ props ----
  { 
  Component: SomeComplexSection, 
  props: (order) => ({ 
    id: order?.id, 
    name: order?.name,
    additionalData: order?.someOtherData 
  }) 
}
];
