# Supported Messaging Apps Content Types

This page describes the supported messaging apps content types, along with their character limits

## Supported Content Types by Channel

| Channel                    | Channel type value | Text | Template | Image | Video | Button | File | Location | Interactive Messages | Rich Card | Rich Card Carousel |
| :------------------------- | :----------------- | :--- | :------- | :---- | :---- | :----- | :--- | :------- | :------------------- | :-------- | :----------------- |
| SMS                        | `sms`              | ✅    | ❌        | ❌     | ❌     | ❌      | ❌    | ❌        | ❌                    | ❌         | ❌                  |
| WhatsApp                   | `whatsapp`         | ✅    | ✅        | ✅     | ✅     | ✅      | ✅    | ✅        | ✅                    | ✅         | ✅                  |
| Viber                      | `viber`            | ✅    | ✅        | ✅     | ✅     | ✅      | ✅    | ❌        | ❌                    | ❌         | ❌                  |
| Zalo Notification Service  | `ZaloNotification` | ✅    | ✅        | ✅     | ❌     | ✅      | ❌    | ❌        | ❌                    | ❌         | ❌                  |
| LINE Official Notification | `LineNotification` | ✅    | ✅        | ❌     | ❌     | ✅      | ❌    | ❌        | ❌                    | ❌         | ❌                  |
| Google RCS                 | GoogleRCS          | ✅    | ❌        | ✅     | ✅     | ✅      | ✅    | ✅        | ✅                    | ❌         | ❌                  |

***

## Whatsapp

- Whatsapp requires templates to be approved before they can be sent as a business-initiated message. However, for replies to customer-initiated conversations, templates are not mandatory and freeform text is supported.
- Supported **File** formats are:

| File Type | File Formats                                      | Max File Size |
| :-------- | :------------------------------------------------ | :------------ |
| Document  | .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt | 100 MB        |
| Image     | .jpeg, .png                                       | 5 MB          |
| Audio     | .aac, .m4a, .amr, .mp3, .ogg, .opus               | 16 MB         |
| Video     | .mp4, .3gp                                        | 16 MB         |

#### Character Limit

| Component                                                        | Character Limit |
| :--------------------------------------------------------------- | :-------------- |
| Text Message                                                     | 4,096           |
| Interactive Message Button Title                                 | 20              |
| Interactive Message List Button                                  | 20              |
| Interactive Message List Row Title                               | 24              |
| Interactive Message List Row Description                         | 72              |
| Interactive Message List Section Title                           | 24              |
| Template Header (text type)                                      | 60              |
| Template Body (with other components)                            | 1,024           |
| Footer (various message types, for example opt-out instructions) | 60              |
| Media Message Image Caption                                      | 1,024           |
| Flows Message CTA                                                | 20              |

***

## RCS Business Messaging

Supported **File** formats are:

| Category          | Extensions / MIME types                                                                                                                                                                | Notes                                    |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| **Images**        | `.jpeg` / `.jpg` (`image/jpeg`), `.png` (`image/png`), `.gif` (`image/gif`)                                                                                                            | Supported in rich cards & media messages |
| **Video**         | `.h263` (`video/h263`), `.m4v` (`video/m4v`), `.mp4` (`video/mp4`, `video/mpeg4`), `.mpeg` (`video/mpeg`), `.webm` (`video/webm`)                                                      | Supported in rich cards & media messages |
| **Audio**         | `.aac` (`audio/aac`), `.mp3` (`audio/mp3`, `audio/mpeg`, `audio/mpg`), `.mp4` (`audio/mp4`, `audio/mp4-latm`), `.3gp` (`audio/3gpp`), `.ogx` / `.ogg` (`application/ogg`, `audio/ogg`) | Media messages only                      |
| **Documents**     | `.pdf` (`application/pdf`)                                                                                                                                                             | Media messages (not rich cards)          |
| **File size cap** | Up to **100 MB** per attachment                                                                                                                                                        |                                          |

#### Limits

| Message element / field            | Limit                                |
| ---------------------------------- | ------------------------------------ |
| **Plain text message**             | 3 072 characters                     |
| **Rich-card title**                | 200 characters                       |
| **Rich-card description**          | 2 000 characters                     |
| **Suggested-reply text**           | 25 characters                        |
| **Suggested-action text**          | 25 characters                        |
| **Suggestion chips per message**   | Up to 11 chips (4 in-card + 7 extra) |
| **Carousel cards per message**     | Up to 10 cards                       |
| **Text caption with media**        | 2 000 characters                     |
| **Postback data** (per suggestion) | 2 048 characters                     |
| **Rich-card payload size**         | 250 KB                               |

***

## Viber

- Viber templates are only available in Russia, Ukraine, and Belarus.
- Supported **File** formats are:

| File Type   | File Formats                                                  | Max File Size |
| :---------- | :------------------------------------------------------------ | :------------ |
| Image       | .png, .jpg, .gif                                              | 1 MB          |
| Video       | .mp4 (recommended), .3gp                                      | 200 MB        |
| PDF         | .pdf, .xps, .pdax, .eps                                       | 200 MB        |
| Documents   | .doc, .docx, .rtf, .dot, .dotx, .odt ,odf, .fodt, .txt, .info | 200 MB        |
| Spreadsheet | .xls, .xlsx, .ods, .fods, .csv, .xlsm, .xltx                  | 200 MB        |

#### Character Limit

| Component    | Character Limit |
| :----------- | :-------------- |
| Text Body    | 1,000           |
| Button Label | 30              |

***

## Zalo Notification Service

- Zalo Notification Service (ZNS) is strictly for one-way messaging and requires templates to be approved before they can be sent.
- ZNS template's character limit is 400 characters

***

## LINE Official Notification

- LINE Official Notification (LON) is strictly for one-way messaging and requires templates to be approved before they can be sent.
- LON template's character limit is 500 characters
