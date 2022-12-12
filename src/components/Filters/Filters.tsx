import { FilterBar, Filter, FilterType, FilterData } from "@saleor/macaw-ui";
import {
  OrderStatusFilter,
  PaymentChargeStatusEnum,
  useFetchChannelsQuery,
} from "../../../generated/graphql";
import { debounce } from "../../utils";
import styles from "./Filters.module.css";

interface FiltersProps {
  key: number;
  handleFilterChange: (filterData: FilterData[]) => void;
}

export const Filters = ({ handleFilterChange, key }: FiltersProps) => {
  const [{ data: channelsData }] = useFetchChannelsQuery();

  return (
    <div className={styles.container}>
      <FilterBar
        key={key}
        labels={{
          addButton: "Add Filter",
          header: "Additional filters",
          where: "Where",
          and: "and",
          is: "is",
          range: "between",
        }}
        onChange={debounce(handleFilterChange)}
        onClose={() => undefined}
        style={{ boxShadow: "none" }}
      >
        <Filter name="customer" label="Customer" type={FilterType.Text} />
        <Filter
          name="paymentStatus"
          label="Payment status"
          type={FilterType.Choice}
          choices={Object.entries(PaymentChargeStatusEnum).map(([key, value]) => ({
            value,
            label: key,
          }))}
          multiple
        />
        <Filter
          name="orderStatus"
          label="Order status"
          type={FilterType.Choice}
          choices={Object.entries(OrderStatusFilter).map(([key, value]) => ({
            value,
            label: key,
          }))}
          multiple
        />
        <Filter
          name="channel"
          label="Channel"
          type={FilterType.Choice}
          choices={(channelsData?.channels || []).map(({ id, name }) => ({
            value: id,
            label: name,
          }))}
          multiple
        />
      </FilterBar>
    </div>
  );
};
