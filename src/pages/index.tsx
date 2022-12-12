import { NextPage } from "next";
import { Button, FilterData, Alert, AlertVariant, Notification } from "@saleor/macaw-ui";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import { useFetchOrdersQuery, FetchOrdersQuery } from "../../generated/graphql";
import { prepareApiData, prepareQueryVariables } from "../utils";
import { TextField, Card, Typography } from "@material-ui/core";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Grid from "@mui/material/Grid";
import { FiltersData, useFilters } from "../hooks/useFilters";
import { Filters } from "../components/Filters/Filters";
import styles from "./index.module.css";

interface AlertData {
  type: AlertVariant;
  message: string;
}

const IndexPage: NextPage = () => {
  const [isQueryPaused, setIsQueryPaused] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showAlert, setShowAlert] = useState<AlertData | null>(null);
  const [filterRestartKey, setFilterRestartKey] = useState(Date.now());

  const { filters, onChange, reset } = useFilters();

  const [{ data, error, fetching }] = useFetchOrdersQuery({
    pause: isQueryPaused,
    variables: prepareQueryVariables(filters),
  });

  const handleCreateSheet = useCallback(
    async (data: FetchOrdersQuery) => {
      if (!data.orders?.edges.length) {
        setIsExporting(false);
        setIsQueryPaused(true);
        setShowAlert({
          type: "warning",
          message: "There are not orders for given filters!",
        });

        return;
      }

      try {
        const res = await fetch("/api/create-sheet", {
          method: "POST",
          body: JSON.stringify(prepareApiData(data, filters.sheetName)),
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Something went wrong");
        }

        setShowAlert({ type: "success", message: "Orders have been exported!" });
        reset();
        setFilterRestartKey(Date.now());
      } catch (e) {
        setShowAlert({
          type: "error",
          message: "Something went wrong! We could not export your orders.",
        });
      } finally {
        setIsQueryPaused(true);
        setIsExporting(false);
      }
    },
    [filters.sheetName, reset]
  );

  useEffect(() => {
    if (isExporting && isQueryPaused) {
      setIsQueryPaused(false);
    }

    if (isExporting && !isQueryPaused && !fetching) {
      handleCreateSheet(data!);
    }
  }, [isExporting, isQueryPaused, fetching]);

  const handleFilterChange = (filterData: FilterData[]) => {
    filterData.forEach((data) => {
      onChange(data.name as keyof FiltersData, data.name === "customer" ? data.value : data.values);
    });
  };

  const startExportingOrders = async () => {
    setIsExporting(true);
  };

  if (error) {
    return <h1>Something went wrong! We could not export your orders.</h1>;
  }

  return (
    <Card className={styles.card}>
      {showAlert && (
        <div className={styles.notification}>
          <Notification
            type={showAlert.type}
            title=""
            content={showAlert.message}
            onClose={() => setShowAlert(null)}
          />
        </div>
      )}

      <Typography variant="h3" className={styles.heading}>
        Export your orders to Google Sheets
      </Typography>

      <Alert variant="warning" close>
        If you not provide any filters, all order will be fetched
      </Alert>

      <Grid container spacing={1} className={styles.inputContainer}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Custom sheet name</Typography>
        </Grid>
        <Grid item xs={2}>
          <TextField
            id="outlined-multiline-flexible"
            label="Name"
            value={filters.sheetName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              onChange("sheetName", e.target.value);
            }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={1} className={styles.inputContainer}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Select date range:</Typography>
        </Grid>
        <Grid item xs={2}>
          <DatePicker
            className={styles.datepicker}
            label="Start date"
            value={filters.startDate}
            onChange={(newValue: any) => {
              onChange("startDate", newValue);
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </Grid>

        <Grid item xs={2}>
          <DatePicker
            className={styles.datepicker}
            label="End date"
            value={filters.endDate}
            onChange={(newValue: any) => {
              onChange("endDate", newValue);
            }}
            renderInput={(params: any) => <TextField {...params} />}
          />
        </Grid>
      </Grid>

      <div className="mt5" />

      <Filters key={filterRestartKey} handleFilterChange={handleFilterChange} />

      <Button
        className="mt5"
        variant="primary"
        onClick={startExportingOrders}
        disabled={isExporting || fetching}
      >
        {isExporting ? "Loading..." : "Export your orders"}
      </Button>
    </Card>
  );
};

export default IndexPage;
