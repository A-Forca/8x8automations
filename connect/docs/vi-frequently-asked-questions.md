# FAQ (Frequently Asked Questions)

This page contains Frequently Asked Questions regarding Video Interaction.

| Question | Answer |
| --- | --- |
| What is the data retention period for logs? | 75 Days by default. |
| What is the retention period for recordings? | 24 hours by default, increasable up to 96 hours on ticket request. We will retry sending the recordings to your SFTP/S3 Bucket up till that time. |
| What is the API Key used for Video Interaction? | This is the same API Key that is on 8x8 Connect. |
| What are the whitelisting requirements to embed VI? | Please see the Network Requirements subsection of this documentation. |
| What is the Video streaming quality for the Video Interaction? | The default camera resolution is 720p. |
| Where are the Video Interaction Servers located? | Currently Video Interaction is hosted in Singapore. If you have differing geolocation requirements reach out to your 8x8 account manager. |
| How many participants in a single video room are supported? | Video Interaction is designed for one-to-one conversations so it is designed for 2 participants (customer and agent). |
| How big the file size of a 3 minute recording for VI? | Roughly 31 MB |
| What is the quality of the video recording? | 1080p (1920x1080 resolution) |
| What is the format of the recording file? | MP4 file format |
| Recommended Bandwidth | **Upstream Bandwidth Recommended**<br>Roughly 3mbps for video<br>40kbps for audio**Total is 3040kbps****Downstream Bandwidth Recommended**<br>2.5mbps for onstage video<br>500kbps for one incoming stream at the lowest quality<br>200kbps per thumbnail stream<br>40kbps for audio**Total is 3240kbps** |
| What are the supported browsers? | Please see [this](https://jitsi.github.io/handbook/docs/user-guide/supported-browsers/) Jitsi link for supported browsers  |
| When are recordings available to the customer? | Once the call is completed, 8x8 will send a **RECORDING_ENDED** and **RECORDING_UPLOADED** webhook that will allow you to download a recording file. This recording available shortly after the call has ended, usually within 1 minute of the call completing. |
| What are the file sizes/resolution of the images being saved as a screenshot by Video Interaction? | The resolution and size is dependent on the phone screen. It will usually range from 300-700 Kilobytes. |
