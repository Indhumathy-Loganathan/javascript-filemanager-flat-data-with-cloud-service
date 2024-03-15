## SfPdfViewer

### Bug Fixes
{:#sfpdfviewer-bug-fixes}

* \#194713,192776 - Reduced the memory leak while loading or unloading the PDF documents.
* \#192872 - Crop box contained PDF documents are now displayed properly.

### Features
{:#sfpdfviewer-features}

* \#168332,168786,168713,168837,168788,179008,180907,161126,189198,190492,176128,192347 - Added support for ink annotation.
* \#165078 - Added support for built-in toolbar.
* \#196028 - Optimized loading time of PDF documents.
*	Added support for document link annotation.


### Breaking Changes
{:#sfpdfviewer-breaking-changes}

* CanUndoModifedEventArgs class has been deprecated due to typo mistake, now CanUndoModified event will have CanUndoModifiedEventArgs in it.