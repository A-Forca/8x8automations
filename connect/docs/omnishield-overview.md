# Omni Shield

## Overview

Omni Shield is 8x8's solution to protect enterprises and their customers from fraudulent SMS activities, such as toll or international revenue share fraud.

The Omni Shield solution offers comprehensive monitoring, real-time traffic analysis, and automatic detection and cancellation of messages from known fraudulent numbers.

Its benefits include reducing Artificial Inflation of Traffic (AIT) attacks, decreasing monthly messaging expenses, and providing real-time alerts and automatic detection of potential fraud.

## How Omni Shield Works?

Omni Shield Consists of two primary components:

* **Traffic Anomaly Detector:** Analyse live traffic on abnormal trends using machine learning
* **Phone Number Intelligence (Launching Soon):** Verify that a number is valid and responsive before sending an SMS

The diagram below adds more context into how Omni Shield fits within the context of sending SMS traffic:

![Omnishield](../images/bc73c12-Omnishield.drawio_5.png)

### Recommendations To Mitigate SMS Fraud Attacks

While Omni Shield can help prevent fraud attacks, we believe in a shared responsibility model between 8x8 and you as a customer.

Please see the following [page](/connect/docs/recommendations-to-mitigate-sms-fraud-attacks) for recommendations that should be implemented on your end to mitigate fraud attacks.

### Glossary

**Operator Share**: A metric based on the known distribution of mobile subscribers across different carriers within a country. Each mobile operator typically maintains a relatively stable percentage of the total mobile market in their country. For example, if an operator normally handles 30% of a country's mobile traffic but suddenly accounts for 60% of your application's traffic, this deviation from the expected operator share may indicate an AIT attack.

**Country Share**: The distribution of your SMS traffic across different countries, which typically follows consistent patterns based on your user base and business operations. Unless you've recently expanded into new markets, significant changes in the proportion of traffic from a specific country can signal potential AIT attacks, as fraudsters often target one geographic region at a time.

**Volume Spike**: An anomalous increase in SMS traffic to a specific mobile operator compared to typical patterns for that day and time of week. These spikes are analyzed in context of historical traffic patterns, taking into account normal variations due to time of day, day of week, and seasonal factors.

**Conversion Rate**: The percentage of sent OTP (One-Time Password) messages that are successfully verified by users. A typical legitimate user flow involves requesting an OTP and then entering it to verify their identity. During AIT attacks, fraudsters often trigger large volumes of OTP messages without completing the verification step, resulting in an unusually low conversion rate compared to normal user behavior. This metric serves as a key indicator of potential fraudulent activity.

**PNI (Phone Number Intelligence)**: 8x8 collects OTP Conversion history of a number and also checks to see if the number is flagged as suspicious by 3rd party.

### Managing Traffic Suspensions

When Omni Shield detects suspicious patterns indicating an AIT attack targeting a specific operator, you can temporarily suspend message delivery to prevent further fraudulent activity. This immediate response helps protect against mounting costs while minimizing disruption to legitimate users.

Key Suspension Guidelines:

* Every suspension executed from 8x8 Connect has a defined expiration period to prevent accidental permanent traffic blocks
* Work with our service team to analyze patterns, identify fraud sources, and develop preventive measures
* Before lifting a suspension, verify the fraud source has been removed and traffic patterns have normalized
* Remove the suspension promptly once resolved to restore service to legitimate users

### FAQ

| Question | Answer |
| --- | --- |
| How do I enable Omni Shield? | Omni Shield is for existing Verificaition API Customers. If you would like to enable it for your 8x8 subaccount, reach out to your account manager. Verif8 traffic has Omni Shield enabled by default. |
| Does Omni Shield work only for OTP traffic? | Yes, Omni Shield is typically enabled to detect AIT attacks in OTP traffic only. This is because OTP traffic comprises of the overwhelming majority of AIT attacks. |
| Does Omni Shield automatically block messages? | Only when the service team has been given permission in advance.<br>Otherwise, you will be notified by e-mail, and you can decide whether to block the traffic on the operator level on 8x8 Connect. |
| How does Omni Shield use historical data to determine the risk of a number (and whether to block) | Omni Shield uses a few data points including:<br>- How often an OTP converts from said number (across our platform, which means it could be coming from various brands)<br>- 3rd party data source on how risky the number |
| Can we see information about messages banned by Omni Shield on the dashboard? | This is planned within 1H 2024. For customer who need the stats today, they can be derived from the log with message status & error code. |
| Can Omni Shield Protect Against all SMS Fraud? | Omni Shield is designed to curb AIT fraud specifically, but it is a shared responsibility between 8x8 and our customers using our APIs to send SMS traffic.<br>We strongly advise you to see our section below on what you can do to prevent SMS fraud for advice to secure your platform against Fraud attacks. |
| What error code is sent in an API call if a message is blocked? Will a webhook also be sent? | The message status will be "Rejected by 8x8", the error code is 99. |
| In the case of number porting from one operator to another will blocking still happen? | Once a number is ported the likelihood of it being part of AIT decreases so chances are we won't block it. |
