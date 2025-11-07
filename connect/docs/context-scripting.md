# Context & Scripting

> 🚧 **[BETA]**
>
> This product is currently in early access. Please reach out to your account manager to get more information.
>

## Context

Workflow context captures the scope in which a workflow is run. Workflow context persists data between steps that you can read from or write to at runtime. Workflow context exposes two state variables **data** and **step. data** is where all workflow-level data is stored. **step** is where all the step-level data is stored. When the step has completed execution, step data is automatically cleared. So, if you want to capture data from a step to use at a later time, you need to save it to **data**. You can interact with the workflow context using the inputs and outputs in the step definitions.

Suppose you have a property in a step A called **status** which you want to use in a branch step later on. In order for the branch step to access this value, you need to output the value from step A to workflow context like

```json
{
  "outputs": {
    "custom_status": "{{step.status}}"
  }
}
```

Now, your workflow **data** has a property named **custom_status** that you access from any other step like

```json
{
  "selectNextStep": {
    "branchA": "{{data.custom_status == 'OK'}}",
    "branchB": null
  }
}
```

**data** can also store complex objects. For example, a workflow triggered by an outbound message may have nested properties like

```json
{
  "payload": {
    "status": {
      "code": 1001,
      "errors": ["first error", "second error"]
    }
  }
}
```

and you can access this code in your workflow context by using **data.payload.status.code** and first error by using **data.payload.status.errors[0]**.

## Scripting

Automation service has rich support for scripting with JavaScript (supports most features of ECMAScript 2023) via input and output pipelines in the workflow context like member access operators (**data.member**, **data&lsqb;'test'&rsqb;&lsqb;'key'&rsqb;**), binary and tertiary operators like **x == y ? 1 : 0;** and the following functions we have defined for you.

- Check country code of a phone number using **isCountryCode(phoneNumber, countryCode)**. For example, **isCountryCode('+6512345678', 'SG')** evaluates to **true**.

- Check if text contains a substring using  **stringContains(source,value,ignoreCase)** For example, **stringContains("hello, world","wor",true)** evaluates to **true**.  The **ignoreCase** param will ignore case-sensitivity is set to true. If **ignoreCase** is not set then the default is **false** which means it will be case-sensitive.

- Check if a timestamp falls within some time of the day for the specified time zone using **isTimeOfDayBetween(timestamp, timeFrom, timeTo, timezone)**. For example, **isTimeOfDayBetween('2020-10-15T14:40:15+07:00', ‘09:00:00', ‘18:00:00’, 'Singapore Standard Time’) ** evaluates to **true**. Refer to Time Zones resource for supported timezones.  
  To check if a timestamp falls outside a specific time interval you can either specify it as two time intervals chained with an** \|\| **(logical OR) condition or a negation** ! **(logical NOT) on a single time interval. For example, **!isTimeOfDayBetween('2020-10-15T14:40:15+07:00', ‘09:00:00', ‘18:00:00’, 'Singapore Standard Time’)** is logically equivalent to**isTimeOfDayBetween('2020-10-15T14:40:15+07:00', ‘00:00:00', ‘08:59:59’, 'Singapore Standard Time’) || isTimeOfDayBetween('2020-10-15T14:40:15+07:00', ‘18:00:01', ‘23:59:59’, 'Singapore Standard Time’)  
  **

- Check the day of the week of a date using **isDayOfWeek(date, day)**. For example, **isDayOfWeek('2021-05-25', 'Tuesday')** evaluates to true. The date can be a simple date or a full datetime in the ISO8601 format. Supported days are Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. The days are not case sensitive. Any of Monday, monday, MONDAY is acceptable.

Scripts must be enclosed in double curly brackets like **{{data.msisdn == 6500000000}}**. The preceding statement will access the `msisdn` property from workflow context at runtime and check that it equals to 6500000000.

Scripts for populating strings can be defined like **"{{'umid: ' + data.umid}}"** or **"umid: {{data.umid}}"**.

Following restrictions are placed on scripts for security reasons:

- Maximum length of scripts is 1000 characters.

- Assignments, allocations and type declarations are forbidden.

- Recursive functions are forbidden.

- Scripts that take more than 500 milliseconds to execute are forbidden (configurable).
