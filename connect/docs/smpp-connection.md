# SMPP - Connection

8x8 SMPP environment has multiple servers. To benefit from our fault-tolerant, high availability platform we prefer SMPP customers to connect directly to our hostname. Based on location and traffic load your application will be automatically connected to the best server.

> 📘
>
> You should connect to 8x8 SMPP servers using SMPP version 3.4.
>
>

Below are the connection details required to connect:

| Setting | Value |
| --- | --- |
| IP address | smpp.8x8.com |
| Port | 2775 |
| Port for SSL/TLS | 2776 (TLS v1.2) |
| system\_id | your username |
| password | your password |

## Server Regions

**List of server URLs:**

To ensure the use of the correct data center region, it is necessary to modify the base URL to correspond with the provisioned region of your account. Refer to the table below for the appropriate base URL associated with each data center region:

| API Region | Base URL |
| --- | --- |
| Singapore (default) | smpp.8x8.com |
| Europe | smpp.8x8.uk |

### Username and Password

Your sub-account Id (username) will be provided by your account manager. Due to the sensitivity and resource requirements of SMPP, you are required to have a dedicated account manager for SMPP connectivity. Please contact us if you have not been allocated to someone directly.

### Binding

#### SMPP Connection

You can connect to 8x8 SMPP servers using `bind_receiver` and `bind_transmitter` or `bind_transceiver`. Typically we provide one account id with multiple sub-account ids; for different routing, products or services.

> 🚧
>
> 8x8 SMPP platform allows a maximum of 4 binds per subAccountId. Your bind will be rejected if your try to exceed this value.
>
>

For relaying DLR back to your platform, 8x8 servers will send back `deliver_sm` to any bind connected with the same `systemId` of the originating `submit_sm` PDU. This includes if you are sending from multiple sites; we will send to any active bind.

#### Throughput

Throughput is tailored to each customer’s requirement during our onboarding process. In most cases for each bind connected to 8x8 SMPP servers, you will be able to submit a maximum of 50 messages per second. You can check with your account manager about specific requirements.

#### PDUs

The following PDUs are supported by 8x8 SMPP servers:

* `bind_receiver`
* `bind_transmitter`
* `bind_transceiver`
* `submit_sm`
* `enquire_link`
* `deliver_sm_resp`
* `unbind`

> 📘
>
> You should send PDUs in the format as required by SMPP Protocol Specification v3.4.
>
>
