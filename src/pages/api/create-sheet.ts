import { GoogleSpreadsheet } from "google-spreadsheet";
import { NextApiRequest, NextApiResponse } from "next";
import creds from "../../creds.json";
import { SheetRowData } from "../../types";
import { createRandomSheetName } from "../../utils";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    sheetName?: string;
    orders: SheetRowData[];
  };
}

const handler = async (req: ExtendedNextApiRequest, res: NextApiResponse) => {
  if (!req.body.orders.length) {
    return res.status(400).json({ error: "Can't find orders" });
  }

  try {
    const doc = new GoogleSpreadsheet("YOUR_SHEET_ID");
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    const sheet = await doc.addSheet({
      title: req.body.sheetName ? req.body.sheetName : createRandomSheetName(),
      headerValues: ["Id", "Date", "Customer", "Payment", "Fulfillment status", "Total"],
    });

    await sheet.addRows(
      req.body.orders.map((row) => ({
        Id: row.id,
        Date: row.date,
        Customer: row.customer,
        Payment: row.pamyment,
        "Fulfillment status": row.status,
        Total: row.total,
      }))
    );

    res.status(200).json("Everthing fine");
  } catch (e) {
    res.status(500).json("Something went wrong!");
  }
};

export default handler;
