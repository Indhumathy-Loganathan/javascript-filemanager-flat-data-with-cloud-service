## XlsIO

### Bug Fixes
{:#xlsio-bug-fixes}

* \#251321 - Exception is no longer thrown while converting Excel document with large range as print title.
* \#250406 - `XmlException` is no longer thrown on parsing the Excel workbook.
* \#252776 - Add copying the worksheet with `ParseOnDemand` option no longer hides the columns in the saved Excel document.
* \#254666 - Transparency is now set properly for AutoShapes.
* \#251345 - Text is no longer cropped when the length exceeds the cell width in Excel to PDF conversion.
* \#250406 - Exception is no longer thrown on parsing the cell style name with empty name or name length greater than 255.
* \#254623 - External data properties are now preserved properly while resaving the Excel document.
* \#253078 - Excel file is no longer corrupted while copying worksheets with more number formats from different workbooks.
* \#255064 - Timeout exception is no longer thrown while refreshing the query table.
* \#F148410 - Japanese characters are now rendered properly in Excel to PDF conversion.
* Conditional format is now applied properly while using different case for text in Excel to PDF conversion.
* Error display text is now proper in Excel to PDF conversion.