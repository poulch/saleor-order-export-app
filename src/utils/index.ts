import { FetchOrdersQuery } from "../../generated/graphql";
import { SheetRowData } from "../types";
import dayjs from "dayjs";
import { FiltersData } from "../hooks/useFilters";

export const createRandomSheetName = () => {
  return `exported-orders-${Date.now()}`;
};

export const prepareApiData = (
  data: FetchOrdersQuery | undefined,
  sheetName?: string
): { sheetName?: string; orders: SheetRowData[] } => {
  if (!data) {
    return {
      orders: [],
    };
  }

  return {
    sheetName,
    orders:
      data.orders?.edges.map(({ node }) => ({
        id: node.id,
        date: dayjs(node.created, "YYYY-MM-DD").toString(),
        customer: `${node.billingAddress?.firstName} ${node.billingAddress?.lastName}`,
        pamyment: node.paymentStatus,
        status: node.status,
        total: `${node.total.gross.amount} ${node.total.gross.currency}`,
      })) || [],
  };
};

export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export const prepareQueryVariables = (filters: FiltersData) => ({
  first: 100,
  filter: {
    created: {
      gte: filters.startDate?.format("YYYY-MM-DD"),
      lte: filters.endDate?.format("YYYY-MM-DD"),
    },
    paymentStatus: filters.paymentStatus,
    status: filters.orderStatus,
    channels: filters.channel,
    customer: filters.customer,
  },
});
