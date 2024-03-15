## XlsIO

### Features
{:#xlsio-features}

* \#189521 - Support to get cell's precedents and dependents is provided.

### Breaking Changes
{:#xlsio-breaking-changes}

* \#189521 - `GetDependents()`, `GetPrecedents()` methods are added in `IRange` interface to get cell's precedents and dependents.
* \#192482 - 'RangeIndexerMode' is added in 'IApplication' interface to include indexer behavior of Interop.
* `IWorksheet` interface is implemented with IEnumerable<T>.

### Bug fixes
{:#xlsio-bug-fixes}

* \#194195 - Corruption issue while add copying the worksheet with JPG image is resolved.
* \#190466 - Cell value with thousand separator is now properly detected as number in German culture.
* \#192875 - Performance issue while converting Excel document with embedded fonts is fixed.
* \#193873 - Excel workbook with duplicate comments can be resaved successfully without corruption.
* \#193832 - File name with space is truncated in HTTP response is resolved.
* \#193301 - Characters with Chinese fonts are rendered properly in Excel to PDF conversion.
* \#192726 - Issue with `DisplayText` property when cell formulas involve TODAY() function is fixed.
* \#193646 - Freeze panes is now properly updated while deleting row.
* \#193301 - Issue with Chinese fonts in Excel to PDF conversion is fixed.
* \#193315 - Exception is no longer thrown while setting calculated column formula using table from another worksheet.
* \#192964, \#192961 - Binary Excel document with improper column value for image can be opened successfully without exception.
* \#193193 - Exception is no longer thrown with invalid pivot table column name in Excel to PDF conversion.
* \#192558 - Issue with hyperlink address is changed on resave is resolved.
* \#192558 - Borders and text alignment are copied properly between workbooks.
* \#191260 - Pivot table layout is improper while having one or more fields with same name is fixed.
* \#191561 - Application hangs while setting `ShowTotals` to false for the table having hyperlink is fixed.
* \#192241 - Issue while adding multiple SVG images to an Excel document is fixed.
* \#191657 - Formatting issue while add copying the worksheets is fixed.
* \#191673 - Hanging and corruption issues while resaving binary Excel document with rich text stream record is fixed.
* \#191958 - Issue with table header cell string while accessing 'DisplayText' is fixed.
* \#191745 - Issue with group shapes hyperlinks on resave is fixed.
* \#191723 - Chart number formats will be preserved properly on resave.
* \#189288 - Issue with row height for different font sizes is fixed.
* \#191316 - Issue with template marker default variable type action is fixed.
* \#191358 - Issue with conditional format when formula has space in Excel to PDF conversion is fixed.
* \#188006 - Border line style issue while getting cell style is resolved.
* \#190663 - Template marker performance is improved while copying conditional formats.
* \#190031 - Excel document without table name can be opened successfully without argument exception.
* \#190343, \#191860 - Formula with external workbook reference value is incorrect on resave is fixed.
* \#189712 - ArgumentOutOfRange exception while copying cells between different workbooks is fixed.
* \#190381 - Excel document no longer gets corrupted while creating chart with `EnterDirectValues()`.
* \#190229 - Decimal separator is now recognized properly while setting formula in Czech and German cultures.
* \#190232 - Issue with display text when the number formats ends with white-space is fixed.
* \#189693 - Excel document is no longer corrupted when creating new sheets in macro-enabled workbook.
* \#189681 - Excel document with empty preset dash value can be opened without XML exception.
* \#189308 - Issue with cell styles and formatting applied to the excluded hidden ranges is fixed.
* \#189191 - InvalidOperation exception is no longer thrown while saving Excel.
* \#189351 - Issue with display unit applied axis labels in chart to image conversion is fixed.
* \#191133, \#194961 - Excel document is no longer corrupted while resaving Excel document with pivot table.
* \#194356 - Excel document gets corrupted while downloading XlsIO resaved file from Internet Explorer browser is fixed.
* Issue with `RefersToRange` for table named ranges is fixed.
* Image class conflict between Compression and XlsIO is resolved.
* Issue with position of dynamically added combo boxes in first column is fixed.
* Text with left alignment gets clipped in Excel to PDF conversion is fixed.
* Excel document with Scatter chart can be resaved properly.
* Embedded chart with image format header/footer can now be viewed without corruption and exception.
* Issue with incorrect row count in table column formula is fixed.
* Image from embedded chart header/footer can be accessed now.
* Chart series are now plotted properly in chart to image conversion.
* Charts with automatic chart title is now converted properly in chart to image conversion.
* Issue with fill settings for Doughnut and Column charts in chart to image conversion is fixed.
* Issue with exploded Pie Charts is out of bounds in chart to image conversion is fixed.
* Corruption issue when resaving Excel document with continuous external named ranges is fixed.
* Corruption issue when resaving Excel document with charts is fixed.