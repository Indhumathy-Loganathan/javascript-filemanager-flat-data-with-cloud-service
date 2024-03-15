## SfRichTextBoxAdv

### Features
{:#sfrichtextboxadv-features}
* \#243464 - Added `OptimizeRtfFileSize` property in `ExportSettings` class to reduce the resultant file size while saving the document as RTF.
* \#239227 - Provided support to preserve the empty cell mark paragraph after nested table with zero height (hidden), like Microsoft Word.

### Bug Fixes
{:#sfrichtextboxadv-bug-fixes}
* \#241353 - Table cell shading is now rendered properly.
* \#243443 - Remove hyperlink option now works properly after opening HTML file with hyperlink.
* \#241663 - Right border of a vertical merged cell is now rendered properly.
* \#239574 - Exception will no longer be thrown while performing select all (Ctrl + A) and delete contents using backspace key.
* \#244036, \#246146 - No extra spaces added before the hyperlink display text while opening HTML file with hyperlink.
* \#239881 - Exception will no longer be thrown when height of table in header footer is greater than page height.
* \#241989 - Exception will no longer be thrown on disposing the previous document while opening document.
* \#238842 - The viewer is now properly interactive without scrolling to selected content while zooming.
* \#233913, \#236783, \#239205 - Merged cells in a table is now displayed with proper width.
* \#240669, \#237042, \#239300, \#239879 - The nested tables with row properties header row, at least height type, allow break across pages are now rendered properly.
* \#238489 - The cell contents of nested table are now rendered properly based on its vertical alignment.
* \#245094, \#246281 - Font family and font size of the text is now preserved properly after performing copy and paste operation.
* \#246146 - Field structure is preserved properly while deleting the hyperlink text.
* \#246169 - Exception will no longer be thrown while copying text (Ctrl + C) after exporting the document as HTML.
* \#246293 - The document title is now properly displayed as title of print dialog.
* \#246699 - Selection formatting from cursor position is now properly copied to the new paragraph on pressing enter key.
* \#245020 - Exception will no longer be thrown while scrolling the document with page height less than or equal to sum of top and bottom margins.
* \#246146 - Cursor navigation is now working properly on pressing right arrow key when cursor is placed at the end of hyperlink which is last item of paragraph.