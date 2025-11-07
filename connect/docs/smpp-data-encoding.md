# SMPP - Data encoding

When sending messages to 8x8 SMPP platform, you must set the correct data encoding values.

* We treat `DCS 0` or `DCS 1` as default `GSM7` encoding
* `DCS 3` is treated as `Latin1 (ISO-8859-1)`
* Use `DCS 8` for Unicode characters
