import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Report Access",
      items: [
        {
          type: "doc",
          id: "analytics/reference/cc-historical-report-create",
          label: "Create Report",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-historical-report-details-by-id",
          label: "Report Details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-historical-report-status-by-id",
          label: "Report Status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-historical-report-data-by-id",
          label: "Report Data",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-historical-report-download-by-id",
          label: "Report Download",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-historical-report-links-by-id",
          label: "Report Links",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-detailed-report-create",
          label: "Create Detailed Report",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-detailed-report-data-by-id",
          label: "Detailed Report Data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Agents",
      items: [
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-agents-metrics-by-queue",
          label: "Agent Statistics by Queue",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-agent-metrics-by-queue-by-id",
          label: "Individual Agent Statistics by Queue",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-agents-metrics-by-group",
          label: "Agent Statistics by Group",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-agent-metrics-by-group-by-id",
          label: "Individual Agent Statistics by Group",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/getagentsinqueue",
          label: "Retrieve realtime metrics for all agents in multiple queues.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/all-tenant-agents-metrics",
          label: "Retrieve all agents with all specified metrics within a tenant.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/get-pbx-agents",
          label: "Returns the list of agents for the given pbx.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Queues",
      items: [
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-queues-metrics",
          label: "Queue Statistics",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-queue-metrics-by-id",
          label: "Individual Queue Metrics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Groups",
      items: [
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-groups-metrics",
          label: "Group Statistics",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-real-time-get-group-metrics-by-id",
          label: "Individual Group Statistics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Audit",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-audit-records",
          label: "Get audit records.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Objects",
      items: [
        {
          type: "doc",
          id: "analytics/reference/searchobject",
          label: "The list of all objects that meet the filter rule criteria.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/getobject",
          label: "Find an object by it's ID.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/downloadmetadata",
          label: "Download content for the given metadata.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/downloadobject",
          label: "Download content for the given metadata.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Bulk Downloads",
      items: [
        {
          type: "doc",
          id: "analytics/reference/removecontent",
          label: "Remove existing objects.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "analytics/reference/cancelbulkdownload",
          label: "Cancel a running bulk download job by zip file name.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "analytics/reference/cleardownloads",
          label: "Removes tasks from a download request.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "analytics/reference/startdownload",
          label: "Start bulk download.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "analytics/reference/downloadstatuses",
          label: "Returns the status of all bulk download job requests.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/downloadstatus",
          label: "Returns the status of a single bulk download job request by zip filename.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/downloadbulk",
          label: "Request bulk download by .zip filename.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Buckets",
      items: [
        {
          type: "doc",
          id: "analytics/reference/searchbucket",
          label: "Search all buckets.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/getbucket",
          label: "Returns the content of a specified bucket.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Users",
      items: [
        {
          type: "doc",
          id: "analytics/reference/users-count",
          label: "Query user count",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/users",
          label: "Query user details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/supervisors",
          label: "Query supervisor values",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/trainers",
          label: "Trainer values.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/user-details",
          label: "User details.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Interactions",
      items: [
        {
          type: "doc",
          id: "analytics/reference/interactions-count",
          label: "Interaction count.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/interactions",
          label: "The Interaction collection",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/delete-interaction",
          label: "Deletes a single interaction.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "analytics/reference/purge-interaction",
          label: "This method purges a single interaction.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "analytics/reference/update-custom-field",
          label: "This method updates custom fields.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "analytics/reference/deletes-the-custom-field",
          label: "Deletes custom field data",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "analytics/reference/interaction-transcription",
          label: "This method queries a single interaction transcription record.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/topics",
          label: "Queries a single interaction for matched topics",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/labels",
          label: "Query a single interaction attached label",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/notes",
          label: "Query the attached notes for a single interaction",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/interaction-media-file",
          label: "The requested interaction media file download",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/webpage-redirect",
          label: "Webpage redirect",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Evaluations",
      items: [
        {
          type: "doc",
          id: "analytics/reference/evaluations-count",
          label: "The evaluation count",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/evaluations",
          label: "Evaluation collection",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/evaluation-details",
          label: "The evaluation details specified by ID.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Speech Analytics",
      items: [
        {
          type: "doc",
          id: "analytics/reference/categories-count",
          label: "The Speech Analytics category count",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/list",
          label: "The Speech Analytics category list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/topics-count",
          label: "The Speech Analytics topic count",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/topics-list",
          label: "The Speech Analytics topics list",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Report Defintions",
      items: [
        {
          type: "doc",
          id: "analytics/reference/cc-historical-analytics-report-types",
          label: "List Report Types",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/cc-historical-analytics-report-type-by-type",
          label: "Report Format Details",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Queue Agent Activity",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-agent-queue-activity",
          label: "Get Agent Activity Metrics per Queues",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Agent Activity",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-agent-activity",
          label: "Get Agent Activity Metrics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Call Queue Metrics",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-queue-metrics",
          label: "Get Call Queue Metrics",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Call Queue Data Table",
      items: [
        {
          type: "doc",
          id: "analytics/reference/aggregated-3",
          label: "Get Aggregated Calls",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Call Details",
      items: [
        {
          type: "doc",
          id: "analytics/reference/detailed",
          label: "Get Call Details",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Pbxes",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-pbxes",
          label: "Returns all pbxes of a customer",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Sites",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-pbx-sites",
          label: "Returns the list of sites of a pbx",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Queues Per Site",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-pbx-site-queues",
          label: "Returns the list of queues for the given pbx and site.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Queues per PBX",
      items: [
        {
          type: "doc",
          id: "analytics/reference/get-pbx-queues",
          label: "Returns the list of queues for the given pbx.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Authentication",
      items: [
        {
          type: "doc",
          id: "analytics/reference/authentication-1",
          label: "Authentication",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Analytics",
      items: [
        {
          type: "doc",
          id: "analytics/reference/call-detail-record-legs",
          label: "Call Detail Record Legs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/call-detail-records",
          label: "Call Detail Records",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/company-summary",
          label: "Company Summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/extension-summary-v-2",
          label: "Extension Summary v2",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/ring-group-summary",
          label: "Ring Group Summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/ring-group-members-summary",
          label: "Ring Group Member Summary",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/extension-summary-deprecated",
          label: "(DEPRECATED) Extension Summary v1",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/call-detail-record-deprecated",
          label: "(DEPRECATED) Call Detail Record Legs",
          className: "menu__list-item--deprecated api-method get",
        },
        {
          type: "doc",
          id: "analytics/reference/ring-group-summary-deprecated",
          label: "(DEPRECATED) Ring Group Summary",
          className: "menu__list-item--deprecated api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
