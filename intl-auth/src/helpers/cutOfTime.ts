import { DRJL_GROUP, MARKETPLACE } from "@/constants";
import generateTimeRanges from "./generateTimeRanges";
import { TimeRangeKey } from "@/types";

type DayOfWeek = "default" | "saturday" | "sunday" | "monday";
type TimeRangePair = [TimeRangeKey, TimeRangeKey];

type TimeRangesByDay = {
  [key in DayOfWeek]: TimeRangePair;
};

const messengerCourierIds = [
  "PBC.WH.SUK",
  "Siam_Outlet_Messenger",
  "Siam_Outlet_Messenger_PayAtDestination",
];
const tiktokDelivery = [
  "TH.TikTok.Pickup_Flash",
  "TH.TikTok.Pickup_JnT",
  "TH.TikTok.Pickup_Kerry",
  "TH.TikTok.Pickup_Ninja",
  "TH.TikTok.DropOff_Flash",
  "TH.TikTok.DropOff_JnT",
  "TH.TikTok.DropOff_Kerry",
  "TH.TikTok.DropOff_Ninja",
  "TH.TikTok.Pickup",
];

export const filterCutOffTimes = (
  data: any[],
  selectedFilter: string,
  currentTime: Date
) => {
  const midnight = new Date(currentTime).setHours(24, 0, 0, 0);
  const cutOffTimes = generateTimeRanges(currentTime);
  const day = currentTime.getDay();

  const checkTimeRange = (createdDate: Date,timeRanges: Partial<TimeRangesByDay>): boolean => {
    const defaultRange = timeRanges.default;
    const range = (day === 6 ? timeRanges.saturday :
                   day === 0 ? timeRanges.sunday :
                   day === 1 ? timeRanges.monday :
                   defaultRange) || defaultRange;

    if (!range) {
      return false;
    }

    if (selectedFilter === "0") {
      return createdDate > cutOffTimes[range[0]] && createdDate <= cutOffTimes[range[1]];
    } else if (selectedFilter === "1") {
      return createdDate > cutOffTimes[range[1]];
    }
    return false;
  };

  return data.filter((item) => {
    const dueDate = new Date(item.dueDate).getTime();
    const createdDate = new Date(item.createdDate);
    const isDRJL = DRJL_GROUP.includes(item.accountId);
    const isMarketplace = MARKETPLACE.includes(item.courierId);
    const isMessenger = messengerCourierIds.includes(item.courierId);

    const isDueToday = dueDate <= midnight;
    const hasRequiredInfo =
      ["0CF", "0DH", "0DI", "0DJ", "0B4"].includes(item.accountId) ||
      item.note ||
      !isMarketplace ||
      item.courierTrackingCode;

    const isDRJLWithMSGR = isDRJL && isMessenger && checkTimeRange(createdDate, {
      default: ["yesterday15PM", "today15PM"]
    });

    const isOtherMerchantWithMSGR = !isDRJL && isMessenger && checkTimeRange(createdDate, {
      saturday: ["yesterday15PM", "today14PM"],
      sunday: ["yesterday14PM", "today14PM"],
      monday: ["yesterday14PM", "today15PM"],
      default: ["yesterday15PM", "today15PM"]
    });

    const isDRJLWithOtherCourier = isDRJL && !isMessenger && !isMarketplace && checkTimeRange(createdDate, {
      default: ["yesterday13PM", "today13PM"]
    });

    const isOtherMerchantWithOtherCourier = !isDRJL && !isMessenger && !isMarketplace && checkTimeRange(createdDate, {
      saturday: ["yesterday10PM", "today8PM"],
      sunday: ["yesterday8PM", "today8PM"],
      monday: ["yesterday8PM", "today10PM"],
      default: ["yesterday10PM", "today10PM"]
    });

    const isDRJLWithMKP = isDRJL && isMarketplace && checkTimeRange(createdDate, {
      default: ["yesterday10PM", "today10PM"]
    });

    const isOtherMerchantWithMKP = !isDRJL && isMarketplace && checkTimeRange(createdDate, {
      saturday: ["yesterday10PM", "today8PM"],
      sunday: ["yesterday8PM", "today8PM"],
      monday: ["yesterday8PM", "today10PM"],
      default: ["yesterday10PM", "today10PM"]
    });

    const is0CSNonMKP = item.accountId === '0CS' && !isMarketplace && checkTimeRange(createdDate, {
      saturday: ["yesterday11PM", "today9PM"],
      sunday: ["yesterday9PM", "today9PM"],
      monday: ["yesterday9PM", "today11PM"],
      default: ["yesterday11PM", "today11PM"]
    });

    const is0G4WithTikTok = item.accountId === '0G4' && item.courierId.includes('TikTok') && checkTimeRange(createdDate, {
      default: ["yesterday12PM", "today12PM"]
    });

    const is0G4NonTikTok = item.accountId === '0G4' && !item.courierId.includes('TikTok') && checkTimeRange(createdDate, {
      default: ["yesterday10PM", "today10PM"]
    });

    // ใช้เงื่อนไขทั้งหมด
    const isValidOrder = isDRJLWithMSGR || isOtherMerchantWithMSGR || isDRJLWithOtherCourier ||
                         isOtherMerchantWithOtherCourier || isDRJLWithMKP || isOtherMerchantWithMKP ||
                         is0CSNonMKP || is0G4WithTikTok || is0G4NonTikTok;

    return isDueToday && hasRequiredInfo && isValidOrder;
  });
};

// การใช้ Partial<T> ใน TypeScript เป็นวิธีการสร้างประเภทที่อนุญาตให้คุณสมบัติทั้งหมดของ T เป็นอ็อปชันนัล (optional)
// สมมติว่าคุณมีประเภทที่กำหนดดังนี้:
// type TimeRangesByDay = {
//   monday: string[];
//   tuesday: string[];
//   wednesday: string[];
//   thursday: string[];
//   friday: string[];
//   saturday: string[];
//   sunday: string[];
// };

// ถ้าคุณใช้ Partial<TimeRangesByDay> คุณสามารถเรียกใช้ checkTimeRange ได้ดังนี้:
// checkTimeRange(createdDate, {
//   saturday: ["yesterday15PM", "today14PM"], <-- ไม่จำเป็นต้องระบุให้ครบทุกวัน คือความสามารถของ Partial
// });
