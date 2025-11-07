import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "category",
      label: "Authentication",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/createaccesstoken",
          label: "Creates a new access token that can be used for API access.",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "WebHooks",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getwebhooks",
          label: "Retrieves all customer webhooks based on the associated token information.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createwebhook",
          label: "Creates a new customer webhook.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getwebhookbyid",
          label: "Get webhook by Id.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatewebhook",
          label: "Updates the full webhook resource by Id.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletewebhookbyid",
          label: "Deletes the webhook by Id.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/verifywebhook",
          label: "The endpoint used to validate that the webhook is working and reachable.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getwebhooks-1",
          label: "Retrieves all customer webhooks based on the associated token information.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createwebhook-1",
          label: "Creates a new customer webhook.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getwebhookbyid-1",
          label: "Get webhook by Id.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatewebhook-1",
          label: "Updates the full webhook resource by Id.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletewebhookbyid-1",
          label: "Deletes the webhook by Id.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/verifywebhook-1",
          label: "The endpoint used to validate that the webhook is working and reachable.",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "JwkKeys",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getjwkpublickey",
          label: "Returns the public JWK.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/getjwkpublickey-1",
          label: "Returns the public JWK.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Channels",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getchatapichannels",
          label: "Retrieves all customer Chat API channels.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createchatapichannel",
          label: "Creates a channel.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getchatapichannel",
          label: "Get ChatAPI channel by Id.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatechatapichannel",
          label: "Update ChatAPI channel by Id.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletechatapichannelbyid",
          label: "Delete ChatAPI channel by Id.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/getchatapichannels-1",
          label: "Retrieves all customer Chat API channels.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createchatapichannel-1",
          label: "Creates a channel.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getchatapichannel-1",
          label: "Get ChatAPI channel by Id.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatechatapichannel-1",
          label: "Update ChatAPI channel by Id.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletechatapichannelbyid-1",
          label: "Delete ChatAPI channel by Id.",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "Conversations",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getcctransactions",
          label: "Returns all conversations belonging to the customer.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createcctransaction",
          label: "Creates a new conversation.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcctransaction",
          label: "Retrieves conversation details.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/getparticipantsforcctransaction",
          label: "Retrieve the conversation participants.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/customerparticipantleavecctransaction",
          label: "Customers leaves conversation.",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/getmessagesforcctransaction",
          label: "Retrieves the conversation messages.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/sendmessagetocctransaction",
          label: "Send a message.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcctransactions-1",
          label: "Returns all conversations belonging to the customer.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createcctransaction-1",
          label: "Creates a new conversation.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/putcctransaction",
          label: "Update a conversation details.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "actions-events/reference/patchcctransaction",
          label: "Patch a conversation details.",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcctransaction-1",
          label: "Retrieves conversation details.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/getccinteractions",
          label: "Returns all conversations belonging to the customer.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createpostagentassignment",
          label: "Creates a post agent assignment for a conversation.",
          className: "api-method post",
        },
      ],
    },
    {
      type: "category",
      label: "Campaign Control",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/changecampaignstatus",
          label: "The change status for an existing campaign.",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Record Management",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/addcustomer",
          label: "Add a new customer to an existing campaign",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletecustomer",
          label: "This method deletes customers from an existing campaign.",
          className: "api-method delete",
        },
      ],
    },
    {
      type: "category",
      label: "chat",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/sendmessageusingpost",
          label: "Send a message to a public chat room.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getmessagesusingget-1",
          label: "Fetches messages for a room. Defaults to `CHAPI sandbox` room.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "health",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getping",
          label: "Returns status 200",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/gethealth",
          label: "Returns the health of the service",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Participants",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getparticipantsforcctransaction-1",
          label: "Retrieve the conversation participants.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/userparticipantleavecctransaction",
          label: "User leaves conversation.",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Messages",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getmessagesforcctransaction-1",
          label: "Retrieves the conversation messages.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/sendmessagetocctransaction-1",
          label: "Send a message.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getmessagebyidforcctransaction",
          label: "Retrieves the conversation messages.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Attachments",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getconversationattachments",
          label: "Get attachments in Conversation.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/addconversationattachments",
          label: "Add an attachment.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getconversationattachment",
          label: "Get an attachment from Conversation.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/downloadattachmentforchatapiconversation",
          label: "Download attachment.",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Agent status",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getagentsstatus",
          label: "Obtain the status for tenant agents. Agents can be filtered by group. Pagination is currently not available.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/setagentsstatuses",
          label: "The bulk operation for setting the status for multiple agents.",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getagentstatus",
          label: "Obtains the status for a specific agent.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/setagentstatus",
          label: "Sets the agent status for a specific agent.",
          className: "api-method put",
        },
      ],
    },
    {
      type: "category",
      label: "Webhook Fax Event Notification Controller",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getcustomerdidfaxeventswebhooks",
          label: "Gets all fax event webhook configurations specific for DIDs",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createconfigurationforfaxeventdidwebhook",
          label: "Create a new fax event webhook configurations for a customer's DID",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcustomerdefaultfaxeventswebhooks",
          label: "Gets all default fax event webhook configurations",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createconfigurationforfaxeventdefaultwebhook",
          label: "Create a new default fax event webhook configurations",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/deleteconfigurationforfaxeventdidwebhook",
          label: "Deletes a customer's DID fax event webhook configuration by ID",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/updateconfigurationforfaxeventdidwebhook",
          label: "Update an existent customer's DID fax event webhook configuration by customer's webhook ID and DID",
          className: "api-method patch",
        },
        {
          type: "doc",
          id: "actions-events/reference/deleteconfigurationforfaxeventdefaultwebhook",
          label: "Deletes a default fax event webhook configuration by ID",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/updateconfigurationforfaxeventdefaultwebhook",
          label: "Update an existent customer's default fax event webhook configuration by webhook ID",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Phones Controller",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getcustomerassociateddidsinfo",
          label: "List the DIDs associated with the Customer",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Webhook Controller",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getcustomerwebhooks",
          label: "Get all webhooks information",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/createcustomerwebhook",
          label: "Creates a new webhook",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcustomerwebhook",
          label: "Get webhook detail by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletecustomerwebhook",
          label: "Deletes a webhook by ID",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatecustomerwebhookconfiguration",
          label: "Updates a webhook details by ID",
          className: "api-method patch",
        },
      ],
    },
    {
      type: "category",
      label: "Faxes Controller",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getcustomerfaxlist",
          label: "Get customer's current fax list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/sendfax",
          label: "Send a fax using the provided parameters",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/cancelfax",
          label: "Cancel a currently ongoing outbound fax by ID",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletemultiplefaxes",
          label: "Deletes multiple existent faxes by list of IDs",
          className: "api-method post",
        },
        {
          type: "doc",
          id: "actions-events/reference/getfaxinformation",
          label: "Get fax information details by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/deletefax",
          label: "Delete a fax by ID",
          className: "api-method delete",
        },
        {
          type: "doc",
          id: "actions-events/reference/getfaxfile",
          label: "Get the fax pdf file by ID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcustomerunreadfaxlist",
          label: "Get customer's current unread fax list",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcustomerdidfaxlist",
          label: "Get customer's current fax list by DID",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/getcustomerdidunreadfaxlist",
          label: "Get customer's current unread fax list by DID",
          className: "api-method get",
        },
      ],
    },
    {
      type: "category",
      label: "Cards",
      items: [
        {
          type: "doc",
          id: "actions-events/reference/getcardsforcctransaction",
          label: "Retrieves the list of conversation message cards.",
          className: "api-method get",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatecardactionsubmit",
          label: "Sends the adaptive card action submit.",
          className: "api-method put",
        },
        {
          type: "doc",
          id: "actions-events/reference/updatecardactionexecute",
          label: "Sends the adaptive card action execute.",
          className: "api-method put",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;
