import { createManifestHandler } from "@saleor/app-sdk/handlers/next";
import { AppManifest } from "@saleor/app-sdk/types";

import packageJson from "../../../package.json";

export default createManifestHandler({
  async manifestFactory(context) {
    const manifest: AppManifest = {
      name: packageJson.name,
      tokenTargetUrl: `${context.appBaseUrl}/api/register`,
      appUrl: context.appBaseUrl,
      permissions: ["MANAGE_ORDERS"],
      id: "saleor.app",
      version: packageJson.version,
      webhooks: [
        /**
         * Configure webhooks here. They will be created in Saleor during installation
         * Read more
         * https://docs.saleor.io/docs/3.x/developer/api-reference/objects/webhook
         */
      ],
      extensions: [
        {
          label: "New Export orders to Google Sheet",
          mount: "NAVIGATION_ORDERS",
          permissions: ["MANAGE_ORDERS"],
          target: "APP_PAGE",
          url: "/",
        },
      ],
    };

    return manifest;
  },
});
