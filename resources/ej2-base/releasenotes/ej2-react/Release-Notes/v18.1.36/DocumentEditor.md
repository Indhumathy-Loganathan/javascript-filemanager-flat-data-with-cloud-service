## DocumentEditor

### Bug Fixes

- `#263861` - Table cells are now resized properly.
- `#260600` , `#266651` - RTL characters are now remove properly on backspace and delete.
- `#260600` - When direction is RTL, elements now rearranged properly after change character formatting.
- `#250770` , `#263443` - RTL text layout properly with special characters.
- `#264351` - Justify paragraph is layout properly when paragraph contains field.
- `#264631` - Stop protection is now working if password is empty.
- `#263171` - Cell options dialog content is now aligned properly.
- `#150960` - Hidden separator in context menu when hyperlink is disabled.
- `#150995` - Resolved error when importing the document with editable region restrictions.
- `#260600`, `#150466` , `#266311` - Properties pane is now enabled properly based on the context type in header footer region.
- `#260133` - Resolved navigation issue on Ctrl + click in MAC machine.
- `150960` - Enable/disable comment now working properly.
- `#263608` , `#150960` - Resolved script error when disable toolbar.
- `#261241` - Resolved script error when remove hyperlink in splitted widget.
- `#259011` - Paragraph before spacing layout issue is now resolved.
- `#260206` - Resolved numbering list issue when list contains start at value.
- `#260206` - Restart numbering is now working properly for different number format.
- `#260637` - Resolved script error when removing comment in header.
- `#249197` - Resolved exception when export Sfdt to other type in server side.
- `#252868` - Resolved script error when resize row to next page.
- `#259972` - Formatting is now applied properly for keep text only option in paste.
- `#258191` - Table cell width are now updated properly.
- `#260133`, `#261809` - Page scrolling issue is resolved when right click in MAC machine.
- `#258087`, `#255070` - Grid columns are now preserved properly on export.
- `#255070` - Page headers is now export properly when section break in table.
- `#259583` - List level number for style paragraph is now export properly.
- `#259153` - Table cell width and height is now copy properly.
- `#258121` - Resolved warnings in bootstrap4 styles when run the application in Firefox.
- `#249197` - Highlight colours are now exported properly.
- `#260048`, `#256276` - Image files are now pasted properly.
- `#256903` - Resolved bookmarks API issue when bookmark is in table.
- `#256758` - Resolved selection issue after correcting the spelling mistake.
- `#258938` - Resolved typo error in place holder of comments text area.
- `#257481` - Font family in font dialog is now update properly based on current selection.
- `#257171` - Bookmarks is now update properly after paste with formatting.
- `#257161` - List number is now update properly when hidden field contains list paragraph.
- `#246365` - Borders are now render properly when copy and paste from excel.
- `#257455` - Font colour is now update properly in modify style dialog.
- `#250770` - Line is now arranged properly when insert field.
- `#255913`, `#257879` - Bookmark is now insert properly in splitted paragraph.
- `#255736` , `#256106` , `#257011` - Context menu is now open in Firefox, Edge and Safari.
- `#254998` - Character format is now apply properly for selected bookmark.
- `#254997`, `#256764`, `#257106` , `#256764` - Paragraph format is now export properly if document contains selection.
- `#255272` - Resolved script error when navigate to bookmark in header.
- `#255188` - Bookmark is now preserved properly in header and footer.
- `#255601` - Bookmark is now select properly after insert text.
- `#256385` - Copy is now working properly in Firefox.
- `#256321` - Auto fit table is now lay-out properly if maximum word width exceeds container width.
- `#256509` - Resolved script error throws on backspace when selection is in bookmark end.
- `#256053` - TOC outline level is now serialized properly on Word export.
- `#256449` - Bullet list is now render properly in IOS chrome and safari.
- `#256099` - List is now apply properly in multilevel list.
- `#256384` - Tab width is now update properly when paragraph contains hanging indent.

### Features

- `249782`, `254484`, `149278`,`258415`,`260463` - Added support for toolbar customization.
- `253670` - Enhancements for copy and paste operation.
- `#262665`, `#151012` - Added API to customize search highlight colour.
- `#249197` - Added API to enable/disable spell check action.
- `#237725`, `#253671` - Added support for web layout.
- `#260639` - Added `enableComment` property to enable and disable comment.
- `#259970` - Handled paste list behaviour using start at value of list.
- `#256487` - Enhancements for mouse and keyboard selection.

### Breaking Changes

- Default value of `enableLocalPaste` is set to false. So, by default, the content will be pasted from the system clipboard.
- Some locale properties are renamed as below

| Previous | Now | 
|---|---|
| Linked(Paragraph and Character) | Linked Style | 
| Don't add space between the paragraphs of the same styles | Contextual Spacing | 
| The password don't match | Password Mismatch | 
| Exceptions (optional) | Exceptions Optional | 
| Select parts of the document and choose users who are allowed to freely edit them. | Select Part Of Document And User | 
| Yes, Start Enforcing Protection | Enforcing Protection | 
| This document is protected from unintentional editing. You may edit in this region. | Protected Document | 
| You may format text only with certain styles. | You may format text only with certain styles | 
| Type your comment hear | Type your comment here | 
| Added comments not posted. If you continue, that comment will be discarded. | Discard Comment | 
| Header & Footer | Header And Footer | 
| Different header and footer for odd and even pages. | Different header and footer for odd and even pages | 
| Different Odd & Even Pages | Different Odd And Even Pages | 
| Different header and footer for first page. | Different header and footer for first page | 
| Distance from top of the page to top of the header | Distance from top of the page to top of the header | 
| Distance from bottom of the page to bottom of the footer. | Distance from bottom of the page to bottom of the footer | 
| Insert / Delete | Insert Or Delete | 
| Number of heading or outline levels to be shown in table of contents. | Number of heading or outline levels to be shown in table of contents | 
| Show page numbers in table of contents. | Show page numbers in table of contents | 
| Right align page numbers in table of contents. | Right align page numbers in table of contents | 
| Use hyperlinks instead of page numbers. | Use hyperlinks instead of page numbers | 
| Bold (Ctrl+B) | Bold Tooltip | 
| Italic (Ctrl+I) | Italic Tooltip | 
| Underline (Ctrl+U) | Underline Tooltip | 
| Superscript (Ctrl+Shift++) | Superscript Tooltip | 
| Subscript (Ctrl+=) | Subscript Tooltip | 
| Align left (Ctrl+L) | Align left Tooltip | 
| Center (Ctrl+E) | Center Tooltip | 
| Align right (Ctrl+R) | Align right Tooltip | 
| Justify (Ctrl+J) | Justify Tooltip | 
| Create a new document. | Create a new document | 
| Open a document. | Open a document | 
| Undo the last operation (Ctrl+Z). | Undo Tooltip | 
| Redo the last operation (Ctrl+Y). | Redo Tooltip | 
| Insert inline picture from a file. | Insert inline picture from a file | 
| Create a link in your document for quick access to web pages and files (Ctrl+K). | Create Hyperlink | 
| Insert a bookmark in a specific place in this document. | Insert a bookmark in a specific place in this document | 
| Provide an overview of your document by adding a table of contents. | Provide an overview of your document by adding a table of contents | 
| Add or edit the header. | Add or edit the header | 
| Add or edit the footer. | Add or edit the footer | 
| Open the page setup dialog. | Open the page setup dialog | 
| Add page numbers. | Add page numbers | 
| Find text in the document (Ctrl+F). | Find Text | 
| The current page number in the document. Click or tap to navigate specific page. | Current Page Number | 
