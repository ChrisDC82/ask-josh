"use client";

import { useEffect } from "react";
import {
  FIND_MAINTENANCE_SERVICES_TOOL_NAME,
  findMaintenanceServices,
  findMaintenanceServicesInputSchema,
} from "@/lib/webMcpMaintenanceServices";

export default function WebMCPTools() {
  useEffect(() => {
    const modelContext = document.modelContext;
    if (!modelContext || typeof modelContext.registerTool !== "function") return;

    const controller = new AbortController();

    void modelContext
      .registerTool(
        {
          name: FIND_MAINTENANCE_SERVICES_TOOL_NAME,
          title: "Find maintenance services",
          description:
            "Search the public AskJosh La Brea maintenance-service catalogue for grounded service matches. Use for property maintenance needs such as plumbing leaks, electrical faults, AC repair, painting, pressure washing, lawn care, tree cutting, or general property maintenance. This read-only tool returns only current public catalogue data with indicative, non-binding cost ranges and never confirms availability or coverage outside the supported area.",
          inputSchema: findMaintenanceServicesInputSchema,
          annotations: {
            readOnlyHint: true,
            untrustedContentHint: false,
          },
          execute: async (input) => findMaintenanceServices(input),
        },
        { signal: controller.signal },
      )
      .catch(() => {
        // WebMCP is experimental; unsupported or policy-blocked browsers should keep the normal site quiet.
      });

    return () => controller.abort();
  }, []);

  return null;
}
