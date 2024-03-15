## PDFViewer

### Bug Fixes

- `#I437765` - Now, the script error does not occur when the update form field value API is used when a signature already has signature content.
- `#F180666` - Now, the exception does not occur while downloading the document after adding the type and uploading the handwritten signature and initial annotation.
- `#I428493` - Now, the signature image in the signature field is visible while printing in the other viewers changes made on the server side.
- `#I441773` - Now, the annotation positions are moving properly.
- Now, the `PDFium` package has been updated.
- `#I438960` - Now, the different culture date time is working properly while exporting annotations.
- `#I444307` - Now, the check box is not added to the left-most corner of the page.
- `#I444707` - Now, the signature dialog box footer button alignment is proper in the fluent theme.
- `#I440251` - Now, the typed handwritten signature is not broken into a new line after downloading and viewing in other viewers.
- `#I429508` - Now, the form fields appear properly in mobile mode.
- `#I433831` - The A4 document size is now properly set during printing.
- `#F180764` - Now, if you move the arrow or line annotations programmatically, their position won't be changed during export.
- `#I429549` - Now, the checkbox displays properly during the print preview.
- `#I436286` - Now that the enable shape annotation is false, the script error no longer occurs.
- `#I429775` - Now, the problem with some specific document's slow rendering has been resolved.
- `#I437396` - Now, when the page's zoom level is higher, the resizer will not enable inside the annotation.
- `#I435370` - Now, the border color is preserved properly for the transparent textbox field.
- `#I438421` - Now, the script error does not occur while loading an annotation restricted document when the `enableAnnotation` API is set to false.
- `#F180082` - Now, while adding the text markup annotation programmatically, the text markup content is added properly.
- `#I434198` - Now, the custom stamp is added properly on the form fields.
- `#I180081` - Now, when attempting to delete a post in the comment panel, the annotations are not deleted from the comment panel.
- `#I431466` - Now, the toolbar behavior is stable in mobile mode.
- `#I432820`, `#I432145`, `#F179720` - Now, the formFields with the same name in non-rendered pages are downloaded successfully.
- `#I429549` - Now, the checkboxes are no longer offset to the right in the print preview.
- `#I429288` - Now, the delete option for a draw signature type will be visible in the context menu.
- `#I431758` - Now, the checkboxes with the same name are correctly selected.
- `#I429416` - The checkbox layer is now rendered properly when loading the provided PDF document.
- `#I431679` - Now, the handwritten signature does not become empty when a random signature is added.
- `#I431466` - Now, the toolbar icon is properly visible in mobile mode.
- `#I431286` - Now, the radio button selector size is proper in the given document.
- `#I408530`, `#I428623` - Now, the free text annotations do not shift towards the left side in edit mode.

### Features

- `#I344527` - Now, the support provided is navigated to the next and previous signature field in the form designer.
- `#I443775` - Now, support is provided for the saving type and image signatures in the form fields.
- Now, the JSON structure has been modified based on the PDF library.
- `#I411856` - Now, support is provided to render the accessibility tags in the PDF Viewer.
- `#I426307` - Improvements to page rendering for zoom levels under 25% by using thumbnail images.
- Now, support is provided for the tab navigation in the form fields and form designer.
