interface GroupedItem {
  internalCode: string;
  count: number;
  name: string;
  amount: number;
}

interface GroupedOrder {
  accountId: string;
  accountName: string;
  courierId: string;
  items: { [key: string]: GroupedItem };
  ids: string[];
}

interface ResultItem {
  accountId: string;
  accountName: string;
  courierId: string;
  internal: { amount: number; internalCode: string; }[];
  itemName: string[];
  ids: string[];
  quantity: string[];
}

export const groupAndSumOrders = (orders: any[]): ResultItem[] => {
  const groupedOrders: { [key: string]: GroupedOrder } = {};

  orders.forEach((order) => {
    const key = `${order.accountId}_${order.courierId}_${order.items.length}`;

    const itemsKey = order.items
      .map((item: any) => `${item.internalCode}-${item.amount}`)
      .sort()
      .join("|");

    const groupKey = `${key}-${itemsKey}`;

    if (!groupedOrders[groupKey]) {
      groupedOrders[groupKey] = {
        accountId: order.accountId,
        accountName: order.account?.name,
        courierId: order.courierId,
        items: {},
        ids: [],
      };
    }

    groupedOrders[groupKey].ids.push(order.id);

    order.items.forEach((item: any) => {
      const itemKey = `${item.internalCode}-${item.amount}`;
      if (!groupedOrders[groupKey].items[itemKey]) {
        groupedOrders[groupKey].items[itemKey] = {
          internalCode: item.internalCode,
          amount: item.amount,
          name: item.name,
          count: 0,
        };
      }
      groupedOrders[groupKey].items[itemKey].count++;
    });
  });

  const result = Object.values(groupedOrders).map((group) => {
    const internal = Object.values(group.items).map((item) => ({
      amount: item.amount,
      internalCode: item.internalCode
    }));

    const quantity = Object.values(group.items)
      .map((item) => `${item.amount * group.ids.length}`)

      const itemName = Object.values(group.items)
      .map((item) => item.name)

    return {
      accountId: group.accountId,
      accountName: group.accountName,
      courierId: group.courierId,
      itemName,
      internal,
      ids: group.ids,
      quantity,
    };
  });
  
  return result;
};
