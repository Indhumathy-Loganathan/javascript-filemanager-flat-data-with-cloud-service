## SfDiagram

### Bug Fixes
{:#sfdiagram-bug-fixes}
* \#211111 – Exception will not be thrown when the `DataSource` is type of List.
* \#211895 – Radial tree layout can be updated in a tab control.
* \#206296 – Radial tree layout will be loaded with empty collection.
* \#209029 – Hierarchical tree layout can be loaded about 1000 nested elements when `RefreshFrequency` is set as `RefreshFrequency.ArrangeParsing`.
* \#208446 – Connector’s source and target reference will be serialized properly when they are dropped from the palette.
* \#213693 – Interaction with Node and DiagramThumb will not throw any BindingExpression exception.

### Features
{:#sfdiagram-features}
* \#207831 - Printing can be canceled in the `Printing` event.
* Deletion of a connector when its dependent node is deleted can be decided using the `ItemDeletingEvent`.
* \#204359 - `ArcSegment` can be created programmatically.
* Diagram provides theme support for shapes.
* \#207501 - Equal space distribution support has been provided for connectors in layout when multiple connections to the node.
* `Node` and `Connector` can be brought into viewport or center of viewport using `BringIntoViewport` and `BringIntoCenter` methods from its `Info` property.
* `TextAnnotationViewModel` support is provided to use Annotation as string with appearance customization properties.


### Breaking Changes
{:#sfdiagram-breaking-changes}
* The `ThemeStyleId` property is added in `INode` and `IConnector`.
* The `Theme` property is added in `IGraph`.
* Dependent assembly for `Syncfusion.SfDiagram.WPF.dll` is changed from `Syncfusion.Shared.WPF.dll` to `Syncfusion.SfShared.WPF.dll`.
* By default, PrintDialog will be hosted inside Window instead of ChromelessWindow.
* UpDown control used in PrintDialog is replaced with text box and the entered text will be validated.
 