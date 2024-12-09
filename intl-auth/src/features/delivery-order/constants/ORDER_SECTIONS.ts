import { OrderIdTypes } from "@/types";
import AttachmentSection from "../components/AttachmentSection";
import ConnectionHistorySection from "../components/ConnectionHistorySection";
import DebitNoteSection from "../components/DebitNoteSection";
import DocumentHistorySection from "../components/DocumentHistorySection";
import EditOrderHistorySection from "../components/EditOrderHistorySection";
import FulfillmentsSection from "../components/FulfillmentsSection";

type SectionComponent = React.ComponentType<any>;

interface SectionConfig {
  Component: SectionComponent;
  props: (order: OrderIdTypes) => Record<string, any>;
}

export const ORDER_SECTIONS: SectionConfig[] = [
  {
    Component: AttachmentSection,
    props: (order) => ({ attachments: order?.attachments }),
  },
  {
    Component: DocumentHistorySection,
    props: (order) => ({ id: order?.id }),
  },
  {
    Component: EditOrderHistorySection,
    props: (order) => ({ id: order?.id }),
  },
  {
    Component: DebitNoteSection,
    props: (order) => ({ id: order?.id }),
  },
  {
    Component: ConnectionHistorySection,
    props: (order) => ({ id: order?.id }),
  },
  {
    Component: FulfillmentsSection,
    props: (order) => ({ id: order?.id }),
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
