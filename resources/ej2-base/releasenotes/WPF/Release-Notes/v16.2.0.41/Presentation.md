## Presentation

### Features
{:#presentation-features}

* \#188453 , \#195951, \#120538, \#150198, \#154578, \#162596, \#165263, \#175560, \#179509, \#190137 - Added support for creating and editing animations in PowerPoint presentation.
* \#195951 - Added support to convert the SmartArt diagrams with shape guide properties.
* \#201054 - Added support to replace a missing font with another substitute font while converting a PowerPoint presentation to image or PDF document.

### Breaking Changes
{:#presentation-breaking-changes}

* The property `Timeline` was added to the `IBaseSlide` interface.
* The property `FontSettings` was added to the `IPresentation` interface.

### Bug Fixes
{:#presentation-bug-fixes}
* \#201506 - Used memory is now disposed properly after resaving the PowerPoint presentation with charts.
* \#198361 - Images are now preserved properly while performing clone and merge in PowerPoint presentation.
* \#199566 - The URL associated with a hyperlink is now preserved properly while re-saving the PowerPoint presentation.
* \#199259 - Application will no longer hang while re-saving the PowerPoint presentation with SmartArt diagrams.
* \#196810 - PowerPoint presentation is no more corrupted while applying slide formatting options.
* \#199260 - `NullReferenceException` is no more thrown while converting a Presentation slide to image.