# Getting Started

In object-oriented programming, we use objects with attributes to organize our programs and build our applications. 8x8 SMS API uses the same organization and the SMS you send are also objects with their set of attributes.

**Let’s have a closer look to understand better how it works:**

* The object below represents a message as expected by most common 8x8 SMS API endpoint `https://sms.8x8.com/api/v1/{subAccountId}/single`. We can see that it is composed of the following attributes:

```json
{
  "source": "Developer",
  "destination": "+6512345678",
  "clientMessageId": "MyBd00001",
  "text": "Hello, World!",
  "encoding": "AUTO",
}

```

* We can see that it is composed of the following attributes:

  * **source**
  * **destination**
  * **clientMessageId**
  * **text**
  * **encoding**
* Each of those attributes is linked to the standard parameters used in the telecommunications industry and are understood and expected by mobile carriers around the World.

**Let’s go over the different attributes of an SMS one by one!**

### 1. Source: SMS senderID

* **What is a senderID?**

Also called TPOA (Transmission Path Origin Address), this parameter carries the SMS sender’s number or designation. Depending on the local constraints enforced by the mobile operators, different types of senderIDs may or may not be available on mobile networks across the World.

#### **What types of senderIDs are available?**

#### A) Numeric SenderIDs

* They can be made of up to 16 digits usually representing a phone number in the cases when the SMS invites the user to respond or to call back.
* According to the length and format of the numeric senderIDs, they can be segmented in 3 sub-types.
* **The 3 different types of numeric senderIDs:**

##### Short-code

* Example: *123*
* 3 to 7 digits in length according to the countries
* They are digit sequences shorter than telephone numbers that have been designated to be memorable.
* They are usually used for SMS notifications or value added service based on 2-Way SMS interactions (polls, challenges, information requests, unsubscriptions, etc.).##### Local long-code

* Ex: *91046180* (Local to Singapore)
* Their format varies according to the countries, but are usually between 7 and 12 digits in length.
* They are digit sequences that represent telephone numbers without the international prefix.
* They are usually used in the cases when the senderID must be identified as an active phone number that can be called and messaged (ex: sending SMS notifications with the support phone number of your company).##### International long-code

* Ex: *+6591056180* (Singaporean international long code)
* They can be made of up to 15 digits and should start by a “+” sign.
* They are telephone number in the international format (starting with the international prefix and followed by the local long code stripped from its leading 0).
* They have the same purpose as the local long-code but can be used in an international context and the replies will be routed back correctly to the telephone number even from a different country.

#### B) Alphanumeric SenderIDs

* Ex: *cpaas*
* They can be made of a combination of up to 11 digits and uppercase of lowercase letters and spaces.
* They are used for identifying your service name or brand name to your users and consumers receiving the message: the recipient will see the message as coming from your brand name as if he had registered a name for a number in his phone contacts.
* It is not possible to reply to an alphanumeric senderID, the response will not be routed back to any telephone number. Considering this, alphanumeric senderIDs should be only used with opt-in users who have been given a means to opt-out of your SMS notifications. It is recommended to include a means to opt-out at the end of your message.

*To check the availability of a specific kind of senderID in a country or for a mobile network, please contact [cpaas-support@8x8.com](mailto:cpaas-support@8x8.com) to find out more.*

### 2. Destination: the recipient's phone number

* The destination of an SMS is the phone number it’s being sent to.
* 8x8 CpaaS enables sending SMS to mobile phone numbers in all the countries across the world.
* **What should be the destination format?**
  * A destination phone number is made of an international prefix (ex: +65 for Singapore) and a local phone number (ex: 91046180) concatenated together (ex: +6591046180).
  * *Nb: 8x8 API accept both international and national formats (for national you have to specify the country in the dedicated country field in the API).*

### 3. clientMessageId: the SMS identification code

* MessageIDs formats and rules will differ from one messaging provider to another but they will almost always be used to associate a specific single message with a unique reference that you can store retrieve information about this message later.
* **What kind of messageids are being used on 8x8 CPaaS?**

#### A) 8x8 CPaaS messageids *(automatically generated)*

* By default, for each message, 8x8 will generate a messageid also referred as UMID (unique message ID). These “internal” messageids allow 8x8 to manage the millions of messages that are processed every hour while helping you troubleshoot your integration and routing issues. 8x8 messageids / UMID are the universal message references when using 8x8.

#### B) clientMessageId *(personalized ids)*

* You have the ability to use your own messageids and that is the purpose of the clientMessageId parameter that you can find in the message object.

### 4. Text and encoding: the message contents

#### A) The message text (what you send)

* The message text is the content of your SMS that is being sent to your recipient.

**How long can the message text be?**  

* If your text is being sent with the encoding GSM7bit and is smaller or equal to 160 characters then it accounts for one message part and you will be billed for one message.  

* If your text is being sent with the encoding UNICODE and is smaller or equal to 70 characters then it accounts for one message part and you will be billed for one message.  

* According to the local constraints that apply to the country where you are sending your messages to, it might be possible to send messages longer than the limits mentioned above by concatenating several parts of message in one message. If this is available you have nothing to do: 8x8 CPaaS platform will automatically splits your long message into smaller chunks that will be sent to the recipient handset with a special parameter that allows to reassemble them. This is called SMS concatenation.  

* You can send up to 10 parts of messages in one SMS.

**Consideration about multiparty SMS and lengths:**  

* According to the encoding of the SMS, the number of SMS accounted per message will be proportional to the length of the text:  

* For GMS7 messages:  

* If the total length of the message is inferior or equal to 160 characters then the first and only message part can accomodate 160 characters.  

* If the total length is superior to 160 characters then each message part can contain 153 characters (less characters can be fit into one part as extra data space is taken to concatenate the SMS on the destination handset)  

* For Unicode messages:  

* If the total length of the message is inferior or equal to 70 characters then the first and only message part can accomodate 70 characters.  

* If the total length is superior to 70 characters then each message part can contain 67 characters (less characters can be fit into one part as extra data space is taken to concatenate the SMS on the destination handset)  

* If you send a message with a length equal to x parts of message, you will be billed for x SMS.

#### B) The message encoding (which character set to use)

**Which message encoding formats are supported?**  

8x8 API supports two different encoding formats: GSM7bit and UNICODE (UCS2).

**How do you select the message encoding to apply?**

* When submitting requests to the API to send messages you have a choice between letting 8x8 platform automatically detect the encoding format that should be used for your message or forcing the platform to use one of the two encoding formats above (7-bit GSM or UNICODE).
* Although 8x8 automatic encoding format detection is convenient and will do a great job at ensuring that your contents are delivered to your recipients in an efficient and readable manner, it is a good thing to understand why SMS platforms such as 8x8 allows you to use different encoding formats.

#### About the 7-bit GSM encoding format

* 7-bit GSM is a lightweight but limited encoding format.
* A character is stored in 7 bits which allows for a maximum of 128 distinct combinations.
* The advantage is that 7-bit GSM allows more characters per message part (up to 160 as detailed above).
* The drawback is that the character set is quite limited and will works quite well for plain English content but for example cannot be used for Chinese or Arabic characters.

#### About the Unicode encoding format

* The Unicode encoding format has a much larger character-set (more than 128,000) spread across various languages scripts and symbols sets.
* A character is stored in 16 bits.
* You would want to use the Unicode encoding format when sending messages containing Chinese, Thai or Arabic characters for example.
* The drawback of the Unicode encoding format is that it is much heavier than the 7-bit GSM. Since each character takes 9 more bits, the message parts containing Unicode encoded data are limited to 70 characters versus 160 for 7-bits GSM
