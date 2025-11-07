# Platform Deployment Regions

At 8x8 CPaaS, we understand that data latency and residency compliance are critical to delivering top-notch cloud communications. Our infrastructure leverages leading public cloud providers to store data in multiple regions, ensuring low latency and allowing you to select a location that best serves your customer base. Additionally, our geographically diverse infrastructure helps businesses meet regulatory requirements by keeping sensitive data within prescribed jurisdictions, giving you peace of mind and streamlined compliance.

## 8x8 CPaaS Platform locations

| Platform Region | Description |
| --- | --- |
| **Asia Pacific** (default) | Our primary data center is in Singapore, delivering reliable performance across the region. |
| **Europe** (EMEA) | Based in Europe to help mitigate risks associated with transferring personal data outside the UK/EEA. This facility assists businesses in complying with the GDPR, UK DPA, and offers enhanced control over data, including for the Middle East and Africa with improved latency. [More details](https://gdpr-info.eu/). |
| **North America** | Our North American data center provides robust performance and low latency across the region, while helping customers comply with U.S. data protection standards and local regulatory requirements. |
| **Indonesia** | Located in Indonesia to meet local regulatory requirements (GR 71 of 2019). This facility supports data protection, security mandates, and content regulations mandated for Electronic System Operators. [Learn more](https://www.dataguidance.com/notes/indonesia-data-protection-overview) . |

## Setting your Platform region

* **New Account creation.** The most relevant data center to your location is automatically preselected during the new account creation process. However, we understand that your business needs may vary, so we provide you with the flexibility to modify the data center selection during that process. This empowers you to choose the location that would best align with and benefit your specific business requirements.
* **Migrate existing account** *(available only to Enterprise accounts)*. Customers that have long–term contracts, account managed (enterprise) or purchase a significant amount of credits every month*(USD 10,000/month or more)* can email their account managers or our [support team](mailto:cpaas-support@8x8.com) to request a migration of account data to another geographical region.

## API Endpoints and Platform Region

To ensure optimal API performance, it is essential to select the appropriate base URL for API calls corresponding to the data center region where your account is provisioned.

**The key advantages of correctly specifying the data center region include**:

* **Latency/Network Advantages:** Reduced latency in API calls is achieved when your server, initiating the API calls, is geographically closer to the selected data center region of your account.
* **Data Isolation:** Complying with data residency requirements is facilitated by using the appropriate URL for your API calls, ensuring that data and logs associated with the API calls are stored in the designated region.

Here is a list of available regions and their corresponding base URLs. Replace `{product}` with the relevant product name you are using. The `{product}` placeholder supports several subdomains: `sms`, `verify`, `smpp`, `lookup`, `contacts`.

| Platform Region | API Base URL |
| --- | --- |
| Asia Pacific (default) | https://{product-name}.**8x8.com** |
| Europe | https://{product-name}.**8x8.uk** |
| North America | https://{product-name}.**us.8x8.com** |
| Indonesia | https://{product-name}.**8x8.id** |

For example, if your account is provisioned in the Indonesian region, use `https://sms.8x8.id` for your SMS API calls instead of the default `https://sms.8x8.com` which will ensure you are connecting to the Indonesian data center region directly.
