## DocIO

### Features
{:#docio-features}

* \#147526 – Added Read and Write support for WordprocessingML documents.

### Bug fixes
{:#docio-bug-fixes} 

* \#151174 - Relative position properties are now preserved properly while opening and saving the Word DOCX format document.
* \#155024 - ArgumentOutOfRangeException is no longer thrown while saving the Word document with charts.
* \#154762 - Text box internal margins are now preserved properly while saving the Word DOCX format document.
* \#154762 - Cell width for the table containing misaligned cells are now preserved properly in Word to HTML conversion.
* \#154762 - Line breaks are now preserved properly during Word to HTML conversion.
* \#153445 - Check box size and size type is now properly preserved during Word to HTML conversion and vice versa.
* \#151329 - Line spacing is now preserved properly for paragraphs in HTML to Word conversion.
* \#153445, * \#151329 - Paragraph properties such as contextual spacing, keep lines together, keep with next, auto spacing before and after are now preserved properly during Word to HTML conversion and vice versa.
* \#154702 - IndexOutOfRangeException is no longer thrown while executing Mail merge using DocIO.
* \#154730, * \#154864 - Null reference exception is no longer thrown while retrieving bookmark content.
* \#156444 - OLE object is now properly preserved while opening a particular DOCX format document.
* \#155252 - Checkbox size is now properly preserved in Word to HTML conversion.
* \#152738 – Text contents are now preserved properly while resaving a particular DOCX format document
* \#156982 - Page orientation now preserved properly while modifying and resaving the Word document.
* \#155820 - Consecutive text with same format are now properly preserved as single span element in Word to HTML conversion
* \#153104 - Section break issue has been resolved in DOCX conversion
* \#157676 - Spaces are now preserved properly in HTML to Word conversion.
* \#156622 - File corruption issue after resaving the Word document as Doc format is resolved
* \#156372 - TOC paragraph’s formatting is now preserved properly.
* \#151329 - List left indent is now preserved properly in Word to HTML and HTML to Word conversion.
* \#157924 - Field code is now retrieved properly while accessing `WField.FieldCode` property.
* \#154988 - The words count in the document will be updated properly
* \#154681 – Chart title text is now preserved properly without formatting loss while modifying and resaving the Word document.
* \#156461 – IndexOutOfRangeException is no longer thrown while resaving the RTF document.
* \#156651 – Title field is now preserved properly while updating document fields.
* \#156713 – Symbols are now preserved properly while resaving a particular DOCX format document.
* \#157702 – DocIO toolbox icon is now shown properly in Visual Studio toolbox filter.
* \#158331 – `WCharacterFormat.ClearFormatting()` is now clears the formatting properly.
* \#158521 - File corruption issue while opening the generated DOCX document in Word 2007 application.