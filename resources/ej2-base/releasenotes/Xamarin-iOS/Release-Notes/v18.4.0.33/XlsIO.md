## XlsIO

### Bug Fixes
{:#xlsio-bug-fixes}

* \#304124 - Cell text with accounting format is now rendered properly for the cell with indent level.
* \#307537 - Conditional format number value is now correct when changing the system culture.
* \#306110 - Row format is now correct while refreshing data in the table.
* \#301881 - Exception is no longer thrown while resaving the Excel document when duplicate styles exist.
* \#305006 - Performance is improved and sparklines are now preserved properly when deleting the row.
* \#305477 - Cell color is now updated properly for databar in Excel to HTML conversion.
* \#302479 - Excel document is no longer corrupted while resaving with pivot table.
* Conditional format applied to EntireColumn is now preserved properly while resaving the XLSX file in XLS format.