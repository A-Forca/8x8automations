# Post Call Survey

> 📘 **Post-call survey reporting has moved under the umbrella of Contact Center reporting.**
>
> For general access and structure guidelines, please refer to the documentation on the [CC Historical Analytics Summary Reports](/analytics/docs/cc-historical-analytics-summary-report)  and the [CC Historical Analytics Detailed Reports](/analytics/docs/cc-historical-analytics-detailed-report).
>
> The [API specification](/analytics/reference/cc-historical-report-create) is also available.
>
>

## Creating reports

Post-call survey data is available via the CC API (v7 only) in either summary or detailed form:

| Report name | Type | Description |
| --- | --- | --- |
| surveys-summary | Summary | Overall metrics for the time period, grouped together by time according to the `granularity` parameter, and by an additional `groupBy` parameter. |
| survey-questions-summary | Summary | Question-by-question aggregates for one or more surveys. |
| detailed-reports-survey | Detailed | Tabulated individual survey response data. |

Full details are available at the [`GET /report-types` endpoint](/analytics/reference/cc-historical-analytics-report-types).

Please see the corresponding documentation for the [CC Historical Analytics Summary Reports](/analytics/docs/cc-historical-analytics-summary-report)  and the [CC Historical Analytics Detailed Report](/analytics/docs/cc-historical-analytics-detailed-report) respectively for more specific documentation on how to create reports using these endpoints, and how to collect the data they specify.

> ❗️ **Post-call survey data is only available in CC API version 7 or later**
>
>

## Fields and terms

### Survey lifecycle metrics

Surveys go through many states as customers interact with them. We track those states, and report the data in the survey-summary report using this vocabulary:

| Field name | Definition |
| --- | --- |
| Offered | The survey/question was presented to the user by IVR |
| OptedIn | The user affirmatively interacted with the IVR to start the survey |
| Started | Some amount of the survey/question audio was presented to the user |
| Completed | The user has completed the question interaction, or in the context of a survey, completed all questions and any final script segments |

> 📘 **Agent-assisted surveys**
>
> For agent assisted surveys and standalone surveys (surveys with no IVR component), we are not able to offer metrics for `Offered` or `OptedIn`, because there was no IVR interaction, which is how we detect these states.
>
>

### Question metrics

In the question-summary report, we collect data on how users specifically interact with individual questions.

| **Field name** | **Definition** |
| --- | --- |
| Answered | The user submitted a response to the question |
| Skipped | The user did not submit a response to the question before a timeout |
| HungUp | The user ended the call during the question audio or response period |

This report also has a notion of `valid` and `invalid` inputs, and aggregates the keypad user input received in the survey in these separate categories.

### Score metrics

| Field Name | Definition |
| --- | --- |
| achievableScore | The maximum score for a question. Or, in the case of a summary context, the sum of all maximum scores in the aggregation. |
| actualScore | The score provided by the customer in response to the question. Or, in the case of a summary context, the sum of all provided scores in the aggregation |
| score | the ratio of `actualScore / achievableScore` |

This report also has a notion of `valid` and `invalid` inputs, and aggregates the keypad user input received in the survey in these separate categories.

### Detail metrics

Detailed data for surveys and questions is available via our detailed reports API. Below, the fields the response may contained are described in more detail:

| **Field name** | **Description** |
| --- | --- |
| AgentIds | Ids of agents that participated in the associated call |
| AgentNames | Names of agents from `agentIds` field |
| AnswerDigit | In the case of a keypad input question with a response, the digit pressed; otherwise, null |
| AnswerType | one of "Recorded", "Skipped", "Valid", "Invalid" |
| CallerName | Caller ID name for non-agent member of the associated call |
| CallerNumber | Caller ID number for non-agent member of the associated call |
| EndTime | Timestamp for the end of the survey |
| InteractionIds | Interactions associated with this survey or question |
| QuestionId | Unique identifier for a particular question |
| QuestionTitle | Title of a particular question |
| QuestionType | One of "scale", "yesNo", "voiceComment" |
| QueueIds | Queue ids that the associated call interacted with |
| QueueNames | Names of the queues from the `queueIds` field |
| ScaleMax | Maximum valid score for a question |
| ScaleMin | Minimum valid score for a question |
| StartTime | Timestamp for the start of the survey |
| SurveyDuration | Duration of the survey |
| SurveyId | ID of the survey |
| SurveyName | Name of the survey |
| SurveyScorePercentage | ratio of the user's inputted score over the total achievable score for numeric questions |
| SurveyType | One of "stayOnCall", "callback" |
| TransactionIds | List of transaction ids associated with a particular survey or question. For more information about transaction IDs, [please review the documentation.](https://support.8x8.com/contact-center/8x8-contact-center/agents/how-to-get-transaction-ids-in-8x8-contact-center) |

### Grouping and filtering

Survey-summary PCS reports are automatically grouped by survey, and question-summary reports are similarly grouped by survey and additionally by question. These grouped results can be filtered by providing survey ids, queue ids, or agent ids as specified by the documentation (link) in an additional `filters` array placed inside the `groupBy` object.
