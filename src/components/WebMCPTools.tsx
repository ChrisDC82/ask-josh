"use client";

import { useEffect } from "react";
import {
  BUILD_PROPERTY_MAINTENANCE_PLAN_TOOL_NAME,
  FIND_MAINTENANCE_SERVICES_TOOL_NAME,
  GET_MAINTENANCE_SERVICE_DETAILS_TOOL_NAME,
  buildPropertyMaintenancePlan,
  buildPropertyMaintenancePlanInputSchema,
  findMaintenanceServices,
  findMaintenanceServicesInputSchema,
  getMaintenanceServiceDetails,
  getMaintenanceServiceDetailsInputSchema,
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

    void modelContext
      .registerTool(
        {
          name: GET_MAINTENANCE_SERVICE_DETAILS_TOOL_NAME,
          title: "Get maintenance service details",
          description:
            "Retrieve structured public details for one specific AskJosh maintenance service. Use after find_maintenance_services when the user asks for more information about a returned service_id. Results are grounded in the current public La Brea catalogue, and cost ranges are indicative rather than quotes.",
          inputSchema: getMaintenanceServiceDetailsInputSchema,
          annotations: {
            readOnlyHint: true,
            untrustedContentHint: false,
          },
          execute: async (input) => getMaintenanceServiceDetails(input),
        },
        { signal: controller.signal },
      )
      .catch(() => {
        // Keep unsupported WebMCP environments silent while preserving normal site behavior.
      });

    void modelContext
      .registerTool(
        {
          name: BUILD_PROPERTY_MAINTENANCE_PLAN_TOOL_NAME,
          title: "Build property maintenance plan",
          description:
            "Create a read-only draft property-maintenance plan from one to five exact AskJosh service IDs. Results are grounded in the current public AskJosh catalogue, use indicative non-binding estimates, and never book services, contact a provider, or claim availability.",
          inputSchema: buildPropertyMaintenancePlanInputSchema,
          annotations: {
            readOnlyHint: true,
            untrustedContentHint: false,
          },
          execute: async (input) => buildPropertyMaintenancePlan(input),
        },
        { signal: controller.signal },
      )
      .catch(() => {
        // Keep unsupported WebMCP environments silent while preserving normal site behavior.
      });

    return () => controller.abort();
  }, []);

  return null;
}
