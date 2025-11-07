# Cloud Storage Service Objects

## Filtering by time

Filtering by the date when objects where created or when objects were last updated can be done by using *createdTime* or *updatedTime* in the *filter* parameter. These parameters must be specified as unix timestamp in milliseconds.

For example, getting all contact center recordings that were created from 2024-09-01 00:00:00 GMT to 2024-10-01 00:00:00 GMT would look like:

filter=type==callcenterrecording;**createdTime**=ge=1725148800000;**createdTime**=le=1727740800000

or, for getting same recordings but specifying the time when were last updated

filter=type==callcenterrecording;**updatedTime**=ge=1725148800000;**updatedTime**=le=1727740800000

## Work - Unified Communications

### Work Call Recording

filter=type==callrecording

```json
{
  "id": "9984564e-557c-42bf-9b7c-40c7b909d489",
  "type": "callrecording",
  "mimeType": "audio/mpeg",
  "objectName": "ipbx:acmecorp:callrecording:users:117209:1667337742543-1666686434952-117209-+16695555518_E.mp3",
  "checksumType": "MD5",
  "checksum": "c03f27f4b1ca0aefea989f1c1b432d9e",
  "customerId": "0012J00002IZiaKQAT",
  "userId": "2xEVyEt2SFmZfL3v5UuEdw",
  "storedBytes": 28224,
  "createdTime": "2022-11-01T21:22:22",
  "updatedTime": "2022-11-01T21:22:32",
  "objectState": "AVAILABLE",
  "bucketId": "57b3ae7b-da6a-437d-b7eb-8d109f89ef2f",
  "tags": [
    {
      "key": "guid",
      "value": "57b3ae7b-da6a-437d-b7eb-8d109f89ef2f"
    },
    {
      "key": "pbxId",
      "value": "EhS7MdQXSX2zElaIeTt49Q"
    },
    {
      "key": "callId",
      "value": "1666686434952"
    },
    {
      "key": "ipbxid",
      "value": "acmecorp"
    },
    {
      "key": "address",
      "value": "+16695555518"
    },
    {
      "key": "endTime",
      "value": "1667337749032"
    },
    {
      "key": "branchId",
      "value": "ZANgBY7WRyOZq_HYzQ48wQ"
    },
    {
      "key": "duration",
      "value": "3000"
    },
    {
      "key": "userName",
      "value": "Alex Wilber"
    },
    {
      "key": "callLogId",
      "value": "3TYkxslLRn6kquFSYoSOxA1666686434952"
    },
    {
      "key": "direction",
      "value": "OUTBOUND"
    },
    {
      "key": "startTime",
      "value": "1667337742543"
    },
    {
      "key": "userEmail",
      "value": "user@example.com"
    },
    {
      "key": "extensionId",
      "value": "3TYkxslLRn6kquFSYoSOxA"
    },
    {
      "key": "extensionNumber",
      "value": "117209"
    },
    {
      "key": "media-processed",
      "value": "true"
    }
  ],
  "shared": false
}

```

### Work Call Recording Transcript

> 🚧 **This is only available if the user has Conversation IQ.**
>
>

filter=type==transcription;sourceObjectType==callrecordingchannel

There will be 2 objects per call. the speaker tag will identify the party

8x8 user(owner)External Party

```json
"tags": [
  {
    "key": "speaker",
    "value": "owner"
  }
]

```

```json
"tags": [
  {
    "key": "speaker",
    "value": "external"
  }
]

```

### Work Voicemail file

filter=type==voicemail

## 8x8 Contact Center

### Contact Center Call Recording

Call Recording for Contact Center calls. Stereo recordings.

filter=type==callcenterrecording

### Contact Center Call Recording Transcript

filter=type==transcription;sourceObjectType==callcenterrecording

```json
{
  "id": "6cf3260a-d4f2-4fba-8240-53633634713f",
  "type": "callcenterrecording",
  "mimeType": "audio/mpeg",
  "objectName": "int-1781d39f76d-vFuLcjeUpdFzcAnYOl3nC0Rh0-phone-00-acmecorp01.mp3",
  "checksumType": "MD5",
  "checksum": "27b75edcb0305a6a6a87d60a1e01f1a4-1",
  "customerId": "0012J00002KTQJzzzz",
  "userId": "eqhDvk_OQJWHKP8Qdzzzzz",
  "storedBytes": 3813912,
  "createdTime": "2021-03-10T18:02:08",
  "updatedTime": "2021-03-10T18:02:59",
  "objectState": "AVAILABLE",
  "bucketId": "d53d0b69-936d-42df-8232-ccc86a309eee",
  "tags": [
    {
      "key": "callId",
      "value": "int-1781d39f76d-vFuLcjeUpdFzcAnYOl3nC0Rh0-phone-00-acmecorp01"
    },
    {
      "key": "ipbxid",
      "value": "acmecorp"
    },
    {
      "key": "address",
      "value": "Cell Phone   CA"
    },
    {
      "key": "agentId",
      "value": "eqhDvk_OQJWHKP8Qdzzzzz"
    },
    {
      "key": "branchId",
      "value": "mnvMZsd9Rt6YbInURyVzzzz"
    },
    {
      "key": "calleeId",
      "value": "12025553989"
    },
    {
      "key": "callerId",
      "value": "4085559901"
    },
    {
      "key": "duration",
      "value": "1271000"
    },
    {
      "key": "mediaUrl",
      "value": "R202103101740420023.wav"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    },
    {
      "key": "agentName",
      "value": "Khang Glynn"
    },
    {
      "key": "direction",
      "value": "INBOUND"
    },
    {
      "key": "queueName",
      "value": "Level 3 Support"
    },
    {
      "key": "startTime",
      "value": "1615398042234"
    },
    {
      "key": "calleeName",
      "value": "Khang Glynn"
    },
    {
      "key": "callerName",
      "value": "Cell Phone   CA"
    },
    {
      "key": "channelName",
      "value": "Main Support"
    },
    {
      "key": "queueNumber",
      "value": "1819"
    },
    {
      "key": "holdDuration",
      "value": "0"
    },
    {
      "key": "callSnippetId",
      "value": ""
    },
    {
      "key": "transactionId",
      "value": "10733"
    },
    {
      "key": "extensionNumber",
      "value": "600032"
    },
    {
      "key": "billingTelephoneNumber",
      "value": "14405558010"
    }
  ],
  "shared": false
}

```

### Post Call Survey

The result of the post call survey. Note this data is also available in Post Call Survey API.

filter=type==postcallsurvey

```json
{
  "id": "e8430fd2-bf6e-4b95-a6e7-6229066567c3",
  "type": "postcallsurvey",
  "mimeType": "application/json",
  "objectName": "int-18419b888db-G7VBDUQreh0xPFMLVd8n9uedI-phone-00-acmecorp01",
  "checksumType": "MD5",
  "checksum": "62418dea13bbc7e403b5df4b5c9a672d",
  "customerId": "0012J00002KTQJzzzz",
  "userId": "64oyEUb_Sk6bxVB9P5zzzz",
  "storedBytes": 567,
  "createdTime": "2022-10-27T13:53:54",
  "updatedTime": "2022-10-27T13:54:30",
  "objectState": "AVAILABLE",
  "bucketId": "32c0786c-96c6-405e-bce7-74d1b468a763",
  "tags": [
    {
      "key": "pcsId",
      "value": "int-18419b888db-G7VBDUQreh0xPFMLVd8n9uedI-phone-00-acmecorp01"
    },
    {
      "key": "callId",
      "value": "int-18419b888db-G7VBDUQreh0xPFMLVd8n9uedI-phone-00-acmecorp01"
    },
    {
      "key": "agentId",
      "value": "ag64oyEUb_Sk6bxVB9Pzzzz"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    }
  ],
  "shared": false
}

```

### Post Call Survey Voice Comment Recording

Voice comment left as part of post call survey.

filter=type==voicecommentrecording

```json
{
  "id": "1d6005d8-4a25-43cc-baa2-1c32a62d4737",
  "type": "voicecommentrecording",
  "mimeType": "audio/wav",
  "objectName": "int-183e7c02084-Tl4kWT4RnOa5VeOArggrZjBcd-phone-00-acmecorp01-q1.wav",
  "checksumType": "MD5",
  "checksum": "f8c528a23eb15160aaebe6e4faf81750",
  "customerId": "0012J00002KTQJzzz",
  "userId": "ag64oyEUb_Sk6bxVB9P5zzz",
  "storedBytes": 61484,
  "createdTime": "2022-10-17T21:01:51",
  "updatedTime": "2022-10-17T21:01:54",
  "objectState": "AVAILABLE",
  "bucketId": "cfedae99-2010-473b-8530-8c6c1bd74fec",
  "tags": [
    {
      "key": "pcsId",
      "value": "int-183e7c02084-Tl4kWT4RnOa5VeOArggrZjBcd-phone-00-acmecorp01"
    },
    {
      "key": "callId",
      "value": "int-183e7c02084-Tl4kWT4RnOa5VeOArggrZjBcd-phone-00-acmecorp01"
    },
    {
      "key": "agentId",
      "value": "ag64oyEUb_Sk6bxVB9P5zzz"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    },
    {
      "key": "pcsQuestionNumber",
      "value": "1"
    },
    {
      "key": "transcription-processed",
      "value": "true"
    }
  ],
  "shared": false
}

```

### Post Call Survey Voice Comment Recording Transcription

filter=type==transcription;sourceObjectType==voicecommentrecording

```json
{
  "id": "bb94a730-a66c-4c19-af88-cc2395e66da4",
  "type": "transcription",
  "mimeType": "application/json",
  "objectName": "int-183b3b3c9e1-7ippeG63cFx6CqobUd8q69SqO-phone-00-acmecorp01-q9.json",
  "checksumType": "MD5",
  "checksum": "0f267cbdf609350f73af7e5fb452d615",
  "customerId": "0012J00002KTQJzzz",
  "userId": "AQDqmvKiRbG4ekigNSzzz",
  "storedBytes": 486,
  "createdTime": "2022-10-07T18:28:55",
  "updatedTime": "2022-10-07T18:28:57",
  "objectState": "AVAILABLE",
  "bucketId": "11ea975d-bc29-4c61-8c3a-eb8dde5458f1",
  "tags": [
    {
      "key": "pcsId",
      "value": "int-183b3b3c9e1-7ippeG63cFx6CqobUd8q69SqO-phone-00-acmecorp01"
    },
    {
      "key": "callId",
      "value": "int-183b3b3c9e1-7ippeG63cFx6CqobUd8q69SqO-phone-00-acmecorp01"
    },
    {
      "key": "result",
      "value": "ok"
    },
    {
      "key": "agentId",
      "value": "AQDqmvKiRbG4ekigNSzzz"
    },
    {
      "key": "duration",
      "value": "1"
    },
    {
      "key": "language",
      "value": "en-US"
    },
    {
      "key": "provider",
      "value": "voci"
    },
    {
      "key": "sourceId",
      "value": "0b52a701-f20f-4691-b035-e5c8e9cd78af"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    },
    {
      "key": "sourceObjectType",
      "value": "voicecommentrecording"
    },
    {
      "key": "pcsQuestionNumber",
      "value": "9"
    }
  ],
  "shared": false
}

```

### CC Voicemail Recording

filter=type==callcentervoicemail

```json
{
  "id": "10b17f97-baff-4610-8f19-70f3f2c0abc9",
  "type": "callcentervoicemail",
  "mimeType": "audio/mpeg",
  "objectName": "int-1843bd9685e-x5zrSPDXGaiqinf9oMFkpUbau-vmail-00-acmecorp01.mp3",
  "checksumType": "MD5",
  "checksum": "6f9ccf8d85a6e21296757ae001d70490",
  "customerId": "0012J00002KTzzzz",
  "userId": "aiYxR4vVSuCcfajOqwzzzz",
  "storedBytes": 539712,
  "createdTime": "2022-11-09T16:30:52",
  "updatedTime": "2022-11-09T16:31:36",
  "objectState": "AVAILABLE",
  "bucketId": "c62f39e5-da8f-4ff7-8f47-da44578e0d31",
  "tags": [
    {
      "key": "callId",
      "value": "int-1843bd9685e-x5zrSPDXGaiqinf9oMFkpUbau-vmail-00-acmecorp01"
    },
    {
      "key": "ipbxid",
      "value": "acmecorp"
    },
    {
      "key": "address",
      "value": "DEF"
    },
    {
      "key": "agentId",
      "value": "aiYxR4vVSuCcfajOqwzzzz"
    },
    {
      "key": "branchId",
      "value": "mnvMZsd9Rt6YbInURyzzzz"
    },
    {
      "key": "calleeId",
      "value": ""
    },
    {
      "key": "callerId",
      "value": ""
    },
    {
      "key": "duration",
      "value": "67000"
    },
    {
      "key": "mediaUrl",
      "value": "094e5cf7-85d4-4f6d-a6a2-b8c8aaa1633e_1663085857.wav"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    },
    {
      "key": "agentName",
      "value": ""
    },
    {
      "key": "direction",
      "value": "INBOUND"
    },
    {
      "key": "queueName",
      "value": "Sales Voice Mail"
    },
    {
      "key": "startTime",
      "value": "1668011452227"
    },
    {
      "key": "agentEmail",
      "value": ""
    },
    {
      "key": "calleeName",
      "value": ""
    },
    {
      "key": "callerName",
      "value": "DEF"
    },
    {
      "key": "channelName",
      "value": "13125555066"
    },
    {
      "key": "queueNumber",
      "value": "571"
    },
    {
      "key": "holdDuration",
      "value": ""
    },
    {
      "key": "callSnippetId",
      "value": ""
    },
    {
      "key": "transactionId",
      "value": "874"
    },
    {
      "key": "originalCallId",
      "value": "int-18337a3bdfa-WawHeGWwrRIvpTdmz2p027kdj-phone-00-acmecorp01"
    },
    {
      "key": "extensionNumber",
      "value": ""
    },
    {
      "key": "billingTelephoneNumber",
      "value": ""
    }
  ],
  "shared": false
}

```

### CC Voicemail Recording Transcript

filter=type==transcription;sourceObjectType==callcentervoicemail

```json
{
  "id": "6a3ba4d7-c221-4c23-8d50-7e9e5fdb7625",
  "type": "transcription",
  "mimeType": "application/json",
  "objectName": "int-18729fc3e63-3siHRMg9PX50ZpArizpitQOIQ-vmail-00-supertenantcsm01.json",
  "checksumType": "MD5",
  "checksum": "9a5006469effa23d4489e8ee2f969f8b",
  "customerId": "0012J00002KTQJaaaa",
  "userId": "AopPWJ1BR82b9UZwKDaaaa",
  "storedBytes": 2062,
  "createdTime": "2023-03-28T21:10:41",
  "updatedTime": "2023-03-28T21:10:45",
  "objectState": "AVAILABLE",
  "bucketId": "71870394-33ac-4f82-b6a7-8e6f59f8fc09",
  "tags": [
    {
      "key": "callId",
      "value": "int-18729fc3e63-3siHRMg9PX50ZpArizpitQOIQ-vmail-00-supertenantcsm01"
    },
    {
      "key": "ipbxid",
      "value": "acmecorp"
    },
    {
      "key": "result",
      "value": "ok"
    },
    {
      "key": "address",
      "value": "M,DENNIS"
    },
    {
      "key": "agentId",
      "value": "agAopPWJ1BR82b9UZwKDaaaa"
    },
    {
      "key": "branchId",
      "value": "IhKgvB0kQb6Jvv1pbG1Apg"
    },
    {
      "key": "calleeId",
      "value": ""
    },
    {
      "key": "callerId",
      "value": ""
    },
    {
      "key": "duration",
      "value": "18"
    },
    {
      "key": "language",
      "value": "en-US"
    },
    {
      "key": "mediaUrl",
      "value": "c6ae7dfd-f81d-4eac-8949-94279f50b548_1680036586.wav"
    },
    {
      "key": "provider",
      "value": "voci"
    },
    {
      "key": "sourceId",
      "value": "f0f1b23c-a8e5-4cf7-9d6e-05e2b4cf2562"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    },
    {
      "key": "agentName",
      "value": ""
    },
    {
      "key": "direction",
      "value": "INBOUND"
    },
    {
      "key": "queueName",
      "value": "Marketing Voicemail"
    },
    {
      "key": "startTime",
      "value": "1680037811842"
    },
    {
      "key": "agentEmail",
      "value": ""
    },
    {
      "key": "calleeName",
      "value": ""
    },
    {
      "key": "callerName",
      "value": "M,DENNIS"
    },
    {
      "key": "channelName",
      "value": "CVFP Main Number"
    },
    {
      "key": "queueNumber",
      "value": "480"
    },
    {
      "key": "holdDuration",
      "value": ""
    },
    {
      "key": "callSnippetId",
      "value": ""
    },
    {
      "key": "transactionId",
      "value": "1868"
    },
    {
      "key": "originalCallId",
      "value": "int-18729fb4334-vxp1mdHa16jYDAv7UP3HxmXTe-phone-00-acmecorp01"
    },
    {
      "key": "extensionNumber",
      "value": ""
    },
    {
      "key": "sourceObjectType",
      "value": "callcentervoicemail"
    },
    {
      "key": "billingTelephoneNumber",
      "value": ""
    }
  ],
  "shared": false
}

```

### CC Screen Recording

filter=type==screenrecording

```json
{
  "id": "9e58ab51-360e-46db-b508-6e5ba6bc3700",
  "type": "screenrecording",
  "mimeType": "video/mp4",
  "objectName": "int-1845ea47cdb-7uK6Uj2BHUMubNY7OOKsgiyjM-phone-00-acmecorp01.mp4",
  "checksumType": "MD5",
  "checksum": "619924e1c5202f83340b149d14f6d1d4",
  "customerId": "0012J00002KTQJYaaa",
  "userId": "whzJ0NOwTdWid_JP6DpFYw",
  "storedBytes": 3907847,
  "createdTime": "2022-11-09T23:15:12",
  "updatedTime": "2022-11-09T23:15:18",
  "objectState": "AVAILABLE",
  "bucketId": "a06fef64-3160-4b87-93bb-83ec67fb983b",
  "tags": [
    {
      "key": "callId",
      "value": "int-1845ea47cdb-7uK6Uj2BHUMubNY7OOKsgiyjM-phone-00-acmecorp01"
    },
    {
      "key": "agentId",
      "value": "agwhzJ0NOwTdWid_JP6zzzz"
    },
    {
      "key": "duration",
      "value": "542000"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    },
    {
      "key": "startTime",
      "value": "1668035167650"
    },
    {
      "key": "startedBy",
      "value": "vcc-agui"
    },
    {
      "key": "identifier",
      "value": "NA12_acmecorp01"
    },
    {
      "key": "transactionId",
      "value": "7434"
    },
    {
      "key": "recording_start_time",
      "value": "20221109T230607"
    }
  ],
  "shared": false
}

```

### CC Agent Notes

Notes added to transactions by agents. Object contains text.

filter=type==agentnotes

```json
{
  "id": "c5381c7d-28b5-4bbd-9f87-cbb47adc613e",
  "type": "agentnotes",
  "mimeType": "text/plain",
  "objectName": "int-18486b7d9b9-9rNMbf8CSyBum7opdCSIsgFdr-phone-00-supertenantcsm01.agentnotes",
  "checksumType": "MD5",
  "checksum": "76ede5ffb605855281abb5173e1da70a",
  "customerId": "0012J00002Kzzzzzzz",
  "userId": "AD21EBR1RhuV2TNDizzzz",
  "storedBytes": 39,
  "createdTime": "2022-11-17T17:51:46",
  "updatedTime": "2022-11-17T17:54:01",
  "objectState": "AVAILABLE",
  "bucketId": "26572b1c-e844-4c44-a6b6-3bd8a2df7dff",
  "tags": [
    {
      "key": "callId",
      "value": "int-18486b7d9b9-9rNMbf8CSyBum7opdCSIsgFdr-phone-00-acmecorp01"
    },
    {
      "key": "ipbxid",
      "value": "acmecorp"
    },
    {
      "key": "tenantId",
      "value": "acmecorp01"
    }
  ],
  "shared": false
}

```

### AI/ML Sentiment Analysis Scores

Getting sentiment scores from AI/ML sentiment analysis.

filter=type==sentimentScore

```json
{
    "id": "daa0b61e-c36c-402c-90f3-a3f3fdf1139b",
    "type": "sentimentScore",
    "mimeType": "application/json",
    "objectName": "int-1924c64e00a-zMCJ1IqScHpzxu2uMdOcDVwH8-phone-03-acmecorp01.json",
    "checksumType": "MD5",
    "checksum": "5b643ff0678e10ab643e21e6b7b2a251",
    "customerId": "0012J00002Kzzzzzzz",
    "userId": "AD21EBR1RhuV2TNDizzzz",
    "storedBytes": 2732,
    "createdTime": "2024-10-02T08:44:30",
    "updatedTime": "2024-10-02T08:44:30",
    "objectState": "AVAILABLE",
    "bucketId": "58252ded-dd6d-4453-a4c4-994bc4b21ace",
    "tags": [
        {
            "key": "callId",
            "value": "int-1924c64e00a-zMCJ1IqScHpzxu2uMdOcDVwH8-phone-03-acmecorp01"
        },
        {
            "key": "ipbxid",
            "value": "acmecorp"
        },
        {
            "key": "tenantId",
            "value": "acmecorp01"
        },
        {
            "key": "sourceObjectType",
            "value": "transcription"
        },
        {
            "key": "contentObjectType",
            "value": "callcenterrecordingchannel"
        },
        {
            "key": "sentimentProcessed",
            "value": "true"
        }
    ],
    "shared": false
}

```

### AI/ML summary

Getting an AI/ML generated summary from a transcript (voice or digital)

filter=type==summary

```json
{  
    "id": "651dc994-27aa-43cc-8f43-301fa6458639",  
    "type": "summary",  
    "mimeType": "application/json",  
    "objectName": "int-1921de567b1-7zrCRtowKo5rmiXNVI0G4PLOE-phone-03-acmecorp01.json",  
    "checksumType": "MD5",  
    "checksum": "54007f2dc30d9d6df5628e18d996ba3a",  
    "customerId": "0012J00002Kzzzzzzz",  
    "userId": "AD21EBR1RhuV2TNDizzzz",  
    "storedBytes": 571,  
    "createdTime": "2024-09-23T08:02:10",  
    "updatedTime": "2024-09-23T08:02:16",  
    "objectState": "AVAILABLE",  
    "bucketId": "34c8c69e-8a43-4ea0-9996-51ada9e06c25",  
    "tags": [  
        {  
            "key": "callId",  
            "value": "int-1921de567b1-7zrCRtowKo5rmiXNVI0G4PLOE-phone-03-acmecorp01"  
        },  
        {  
            "key": "result",  
            "value": "ok"  
        },  
        {  
            "key": "tenantId",  
            "value": "acmecorp01"  
        },  
        {  
            "key": "sourceObjectId",  
            "value": "8d1bfa3c-3519-4823-a131-646bde4cd271"  
        },  
        {  
            "key": "sourceObjectType",  
            "value": "transcription"  
        },  
        {  
            "key": "contentObjectType",  
            "value": "callcenterrecordingchannel"  
        }  
    ],  
    "shared": false  
}

```
