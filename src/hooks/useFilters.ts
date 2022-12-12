import { Dayjs } from "dayjs";
import { useCallback, useState } from "react";
import { OrderStatusFilter, PaymentChargeStatusEnum } from "../../generated/graphql";

export interface FiltersData {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  sheetName: string;
  paymentStatus: PaymentChargeStatusEnum[];
  orderStatus: OrderStatusFilter[];
  channel: string[];
  customer: string;
}

const initialState = {
  startDate: null,
  endDate: null,
  sheetName: "",
  paymentStatus: [],
  orderStatus: [],
  channel: [],
  customer: "",
};

export const useFilters = () => {
  const [filters, setFilters] = useState<FiltersData>(initialState);

  const reset = useCallback(() => {
    setFilters(initialState);
  }, []);

  const onChange = <T>(name: keyof FiltersData, value: T) => {
    setFilters((filters) => ({
      ...filters,
      [name]: value,
    }));
  };

  return {
    filters,
    onChange,
    reset,
  };
};
