# Branches

> 🚧 **[BETA]**
>
> This product is currently in early access. Please reach out to your account manager to get more information.
>

A branch is a specific type of step, allowing you to split your workflow definition, based on a condition.
Here is an example of branch:

```json
{
    "id": "step_1",
    "stepType": "Branch",
    "selectNextStep": {
        "branch1": "{{isCountryCode(data.payload.user.msisdn, 'SG')}}",
        "branch2": "{{isCountryCode(data.payload.user.msisdn, 'US')}}",
        "branch3": null
    }
}
```

As you can see, the *stepType* is *Branch*.

In this case, you need to define the next steps and the condition.
This can be done using *selectNextStep* and by listing the branches.
You can use any branch name (here we used the names *branch1*, *branch2* and *branch3*).

The branch names defined here will be used as the step id for the following steps.
In the example above the next step will start with "id": "branch1",

Inside each branch, you need to define a condition, for more detail, see the **Scripting** section below.

In the example above, we are creating the following logic:

- branch1 will be selected if the source number has a Singapore country code
- branch2 will be selected if the source number has a US country code
- branch3 will be selected otherwise

| Property   | Description                                                                                                                      | Type   |
|------------|----------------------------------------------------------------------------------------------------------------------------------|--------|
| id         | Unique id of the step.                                                                                                           | string |
| stepType   | Step type.                                                                                                                       | string |
| inputs     | Wait step supports the following input parameters.<br> - **minutes**: Number of minutes to wait before executing the next step.  | object |
| selectNextStep | Step ids of the branches and the conditions.                                                                                     | string |
