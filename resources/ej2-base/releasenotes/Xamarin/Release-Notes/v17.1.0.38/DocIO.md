## DocIO

### Features
{:#DocIO-features}

* \#225207 - Support has been added to preserve chart while converting a Word document to PDF.
* \#215654, \#215551, \#217709, \#217596, \#213468, \#220078, \#221808, \#218691, \#221806, \#220279, \#218691, \#223653 - Improved text size calculation in Word to PDF conversion.
* \#219302, \#224607, \#224937 - Improved font retrieval and substitution algorithm in Word to PDF conversion.
* \#225752 – Provided support to update unknown type fields in a Word document.
* \#224654 – API has been added to set created date and time for Word document comments.
* \#223907 - API has been added to skip the **Complex format is not supported** exception while opening an incrementally saved DOC format Word document.


### Bug Fixes
{:#DocIO-bug-fixes}

* \#221972 - Text is now highlighted properly while converting a Word document to tagged PDF.
* \#223350 - Table cell is now preserved properly while opening an HTML document.
* \#222922 - Image is now preserved properly while converting a Word document to PDF.
* \#222713 - The **ArgumentException** will no longer be thrown while adding a table.
* \#222608 - Font name is now preserved properly while converting an HTML document to Word document.
* \#222751 - The **StackOverFlowException** will no longer be thrown while converting a Word document to PDF.
* \#222670 - Inline content control text is now preserved properly while converting a Word document to PDF.
* \#222320 - Hyperlink is now preserved properly in inline content control while converting a Word document to PDF.
* \#222345 - The **ArgumentOutOfRangeException** will no longer be thrown while updating TOC in RTF format document.
* \#221260 - Line space preservation issue has been resolved While converting a Word document to PDF.
* \#221153 - Inline content control custom XML data is now preserved properly while converting a Word document to PDF.
* \#221725 - The **ArgumentOutOfRangeException** will no longer be thrown while cloning a Word document.
* \#221611 - The **NullReferenceException** will no longer be thrown while saving a Word document.
* \#220710 - Table row is now preserved properly while converting a Word document to PDF.
* \#220324 - Checkbox content control state is now preserved properly while cloning a Word document.
* \#221119 - List number is now preserved properly while opening an RTF format document.
* \#218943 - List bullet is now preserved properly while opening an RTF format document.
* \#221974 - Gray scale recoloring is now preserved properly while converting a Word document to PDF.
* \#219092 - Merge field before and after text is now preserved properly while executing mail merge.
* \#223340 - The **IndexOutOfRangeException** will no longer be thrown while converting a Word document to PDF.
* \#222852 - Footer content is now preserved properly while merging multiple RTF documents.
* \#223355 - Tab is now preserved properly while converting a cloned Word document to Image.
* \#223510 - Text overlapping issue has been resolved while converting a Word document to PDF.
* \#223931 - The **ArgumentException** will no longer be thrown while converting a Word document to PDF.
* \#222588 - Formula field result is now preserved properly while updating the Word document fields.
* \#224323, \#225518, \#225883 - The **NullReferenceException** will no longer be thrown while calling the GetText API.
* \#224412 - Tab is now preserved properly while converting a Word document to PDF.
* \#224287 - Image is now preserved properly while converting a Word document to PDF.
* \#223508 - Word document instance is now disposed properly while converting a Word document to PDF.
* \#225386 - Page field is now preserved properly while converting a Word document to PDF.
* \#225611, \#225386 - Table content is now preserved properly while converting a Word document to PDF.
* \#218799 - Pagination issue has been resolved while converting a Word document to PDF.
* \#224351, \#224561 - Inline content control's text is now preserved properly while converting a Word document to PDF.
* \#224062, \#226901 - Table border is now preserved properly while converting a Word document as RTF.
* \#226599, \#226243, \#220279 - Table is now preserved properly while converting a Word document to PDF.
* \#226599, \#226243, \#225970, \#225679, \#226352, \#223713, \#223959, \#224412, \#221455 - Hanging issue has been resolved while converting a Word document to PDF.
* \#226243 - Frame content is now preserved properly while converting a Word document to PDF.
* \#227112 - The **NullReferenceException** will no longer be thrown while updating the Word document fields.
* \#224637 - Picture preservation issue has been resolved while converting a Word document to PDF.
* \#225091 - Check box is now preserved properly while converting a Word document to PDF.
* \#225458, \#223134 - Table row border is now preserved properly while converting a Word document to PDF.
* \#225091 - Underline is now preserved properly while converting a Word document to PDF.
* \#224701 - Univers 45 Light font is now preserved properly while converting a Word document to PDF.
* \#225176 - Image is now preserved properly while converting the RTF document to HTML.
* \#226725 - Embedded Microsoft Visio (VSDX) object is now preserved properly in DOCX to DOCX conversion.
* \#220362 - Picture watermark is now preserved properly while resaving the RTF document. 
* \#225947 - Number format is now preserved properly while performing Mail merge.
* \#225062 - Image is now preserved properly while importing a Word document.
* \#218957, \#220198 - The **ArgumentException** will no longer be thrown while converting a Word document to PDF.
* \#225481 - The **NotSupportedException** will no longer be thrown while opening an HTML document.
* \#225481 - Image size is now preserved properly while opening an HTML document.
* \#225481 - Table border is now preserved properly while opening an HTML document.
* \#218799 – Text format is now preserved properly while converting a Word document to PDF.
* \#218799, \#225679 – Text box is now preserved properly while converting a Word document to PDF.
* \#225386 – Table cell is now preserved properly while converting a Word document to PDF.
* \#221089 – Picture watermark is now preserved properly while converting a Word document to PDF.
* \#227058 – **Html contains not well formatted table** will no longer be thrown while opening an HTML document with caption tag.
* \#223350 – Vertical merged cells are now preserved properly while opening an HTML document.
* \#217709, \#231056 – Unicode character '€' is now preserved properly while converting a Word document to PDF.