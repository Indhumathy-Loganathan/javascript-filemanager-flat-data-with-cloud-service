## DocumentEditor

### Bug Fixes

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

### Breaking Changes

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
