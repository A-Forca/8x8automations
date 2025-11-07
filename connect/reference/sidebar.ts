import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Send Message API",
      items: [
        {
          type: "doc",
          id: "connect/reference/send-message",
          label: "Send message",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/send-message-many",
          label: "Send message batch",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/send-lon-message",
          label: "Send Line Notification message",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/send-lon-messages",
          label: "Send Line Notification message batch",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-scheduled-message-1",
          label: "Cancel the scheduled message",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-many-chat-apps-messages",
          label: "Cancel batch of scheduled message",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Management API",
      items: [
        {
          type: "doc",
          id: "connect/reference/mark-message-read",
          label: "Mark message as read",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-whatsapp-templates",
          label: "Get WhatsApp templates",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/add-whatsapp-template",
          label: "Add WhatsApp template",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/remove-wa-template",
          label: "Remove WhatsApp template",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/tokens",
          label: "Token creation",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Reporting API",
      items: [
        {
          type: "doc",
          id: "connect/reference/start-log-export-job-1",
          label: "Start log export job",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-log-export-job-result-1",
          label: "Get log export job result",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-log-export-job-1",
          label: "Cancel the log export job ",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-chatapps-message-details",
          label: "Retrieve message details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/start-log-export-job",
          label: "Start SMS log export job",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-log-export-job-result",
          label: "Get log export job result",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-log-export-job",
          label: "Cancel the log export job ",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-sms-message-details",
          label: "Retrieve SMS details",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/delete-pii",
          label: "Remove Personally Identifiable Information (PII)",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-price-list",
          label: "Get SMS price list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-account-balance",
          label: "Get account balance",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/call-log",
          label: "Call Logs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/call-detail",
          label: "Detail call",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/retrieve-image",
          label: "Retrieve Image",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/start-voice-log-export-job",
          label: "Start log export job",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-voice-log-export-job-result",
          label: "Get log export job result",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-voice-log-export-job",
          label: "Cancel the log export job ",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Webhook Configuration API",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-webhooks-1",
          label: "Get all Webhooks for Account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/add-webhooks-1",
          label: "Create or Replace webhooks",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-webhooks-1",
          label: "Delete webhooks",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-webhooks-2",
          label: "Get all Webhooks for Account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/add-webhooks-2",
          label: "Create or Replace webhooks",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-webhooks-2",
          label: "Delete webhooks",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "File Upload API",
      items: [
        {
          type: "doc",
          id: "connect/reference/upload-file",
          label: "Upload file",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/download-file",
          label: "Download file",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Webhooks Configuration API",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-webhooks",
          label: "Get all Webhooks for Account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/add-webhooks",
          label: "Create or Replace webhooks",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-webhooks",
          label: "Delete webhooks",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Contacts API",
      items: [
        {
          type: "doc",
          id: "connect/reference/contact-search",
          label: "Search contacts",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-contact",
          label: "Create contact",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/blacklist-msisdn",
          label: "Blacklist msisdn for a specific account",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-contact-by-id",
          label: "Get contact information by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/delete-single-contact",
          label: "Delete single contact",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/update-contact",
          label: "Update contact information",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Number Lookup API",
      items: [
        {
          type: "doc",
          id: "connect/reference/phone-number-lookup",
          label: "Get phone number lookup data",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Send SMS API",
      items: [
        {
          type: "doc",
          id: "connect/reference/send-sms-single",
          label: "Send SMS",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/send-many-sms",
          label: "Send SMS batch",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-many-sms-messages",
          label: "Cancel batch of scheduled SMS",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/api-sms-feedback",
          label: "SMS Success Feedback",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/cancel-scheduled-message",
          label: "Cancel the scheduled SMS",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Engage API",
      items: [
        {
          type: "doc",
          id: "connect/reference/survey-send",
          label: "Send SMS Engage survey",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/survey-send-many",
          label: "Send SMS Engage surveys as batch",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Verification API",
      items: [
        {
          type: "doc",
          id: "connect/reference/verify-request-v-2",
          label: "Initiate verification",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/code-validation-v-2",
          label: "Validate verification",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/sma-coverage-check",
          label: "SMA coverage check",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Voice Messaging",
      items: [
        {
          type: "doc",
          id: "connect/reference/send-callflow",
          label: "Send Callflow",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "IVR",
      items: [
        {
          type: "doc",
          id: "connect/reference/ivr-send-callflow",
          label: "Send Callflow",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Voice Profile API",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-voice-profile-information",
          label: "Get speech profiles for your account",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Webhooks API",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-webhooks-information",
          label: "Get webhook information for your account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-a-new-webhook",
          label: "Create a new webhook",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-a-specific-type-of-webhook",
          label: "Delete a specific type of webhook",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-webhooks-information-1",
          label: "Get webhook information for your account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-a-new-webhook-1",
          label: "Create a new webhook",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-a-specific-type-of-webhook-1",
          label: "Delete a specific type of webhook",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Recording API",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-recording-push-config-information",
          label: "Get recording push config for your account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-a-new-recording-push-config",
          label: "Create a new recording push config",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-recording-push-config",
          label: "Delete recording push config",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-recording-status-information",
          label: "Get recording status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-recording-push-config-information",
          label: "Get recording push config for your account",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-a-new-recording-push-config",
          label: "Create a new recording push config",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-recording-push-config",
          label: "Delete recording push config",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/get-recording-status-information",
          label: "Get recording status",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Virtual Number Management API",
      items: [
        {
          type: "doc",
          id: "connect/reference/number-health-service",
          label: "Get My Virtual Numbers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/check-virtual-number",
          label: "Check Virtual Number",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-virtual-numbers",
          label: "Get My Virtual Numbers",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/check-virtual-number",
          label: "Check Virtual Number",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Workflow Definition Management",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-all-definitions",
          label: "Retrieve a list of active workflow definitions.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-definition",
          label: "Create a new workflow definition",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-specific-definition",
          label: "Retrieve the version history of a workflow definition.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/update-existing-definition",
          label: "Update workflow definition",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "connect/reference/delete-definitions",
          label: "Delete workflow definition",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/start-workflow-instance",
          label: "Test workflow definition",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Workflow Instance Management",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-workflow-instances",
          label: "Retrieve a list of workflow instances",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-instance-status",
          label: "Retrieve workflow instance status",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/patch-workflow-instance",
          label: "Update workflow instance status",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "connect/reference/get-instance-errors",
          label: "Retrieve a list of errors for a workflow instance",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Workflow Triggers",
      items: [
        {
          type: "doc",
          id: "connect/reference/http-request-trigger",
          label: "Trigger workflows using an external event",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Miscellaneous",
      items: [
        {
          type: "doc",
          id: "connect/reference/get-timezones",
          label: "Retrieve a list of supported time zones",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-functions",
          label: "Retrieve a list of supported JavaScript functions",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-usage",
          label: "Retrieve the allowed workflow counts and current usage",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-usage-history",
          label: "Retrieve a list of executed workflow counts by yearly",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Groups API",
      items: [
        {
          type: "doc",
          id: "connect/reference/search-groups",
          label: "Search for groups",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/create-group",
          label: "Create a group",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-group-by-id",
          label: "Get group information by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/delete-group",
          label: "Delete group",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "connect/reference/update-group",
          label: "Update group information",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "connect/reference/add-contacts-to-group",
          label: "Add a contact to a group",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/delete-contacts-from-group",
          label: "Remove contacts from a group",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Batch API",
      items: [
        {
          type: "doc",
          id: "connect/reference/batch-upload-contacts",
          label: "Batch create contacts",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/batch-delete-contacts",
          label: "Batch delete contacts",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/batch-copy-contacts",
          label: "Copy contacts between groups",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/batch-move-contacts",
          label: "Move contacts between groups",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/batch-delete-groups",
          label: "Batch delete groups",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "connect/reference/get-batch-by-id",
          label: "Get batch information by id",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "connect/reference/get-batch-job-list",
          label: "Get batch job list",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "connect/reference/oas-file-for-common-models-dont-remove-dont-publish",
          label: "OAS file for common models, don't remove, don't publish!",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
