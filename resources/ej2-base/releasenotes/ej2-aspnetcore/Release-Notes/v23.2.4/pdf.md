## PDF

### Features
{:#PDF-features}

* \#I521095 - Added .NET 8 support for PDF, HTML Converter, and OCR Processor.
* Added support to set polygon points in PdfLoadedPolygonAnnotation and PdfPolygonAnnotation.
* \#F180535 - Added support for retrieving the Certificate Revocation List (CRL) with revocation serial numbers, revoked dates, and revocation status from embedded CRLs during signature validation.
* \#F184954 - Provided support to include certificates in the Document Security Store (DSS) during Long-Term Validation (LTV).
* \#F184644 - Added support for retrieving certificates from the Document Security Store (DSS).

N> When inserting images with a white background into PDFs, an unexpected appearance of gray may occur. This issue has been identified within the SkiaSharp library. This issue is observed specifically when the application targets .NET 8 and is deployed on macOS or iOS environments. Refer to this [link](https://github.com/mono/SkiaSharp/issues/2666) for more details.

### Bug Fixes
{:#PDF-bug-fixes}

* \#I520965 - Resolved an issue where the destination was not behaving as expected after an update to the destination array functionality in the file link annotation.
* \#I516937 - Resolved an exception that occurred while converting Word to PDF, specifically when handling Arabic text in italic style.
* \#I518050 - The Index outside the bounds of the array exception no longer occurs when compressing a particular PDF document.
* \#I518514 - The Null Reference exception will no longer occur when using the loaded document StructureElement for a particular document.
* Fixed the issue where the border width is not updated when exporting the annotation in Xfdf format.
* \#I503563 - Resolved the issue where the image rotation was not being returned for a specific PDF document.
* The Null Reference Exception no longer occurs when converting HTML to PDF.
* \#I509561 - The Null Reference Exception no longer occurs when performing OCR with the chi sim language.
* \#F184907 - The form fields are now added in the correct position during the HTML to PDF conversion.