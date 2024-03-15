## SfChart

### Bug Fixes
{:#sfchart-bug-fixes}

* \#151125 - Axis labels are visible properly in [`DateTimeCategoryAxis`](http://help.syncfusion.com/uwp/sfchart/axis#datetimecategoryaxis) now.

* \#150629 - [`SelectionChanging`](http://help.syncfusion.com/uwp/sfchart/interactive-features#selection) event will be fired correctly, when deselect the segment.

* \#150593 - Chart series animation working properly, while changing the ItemsSource dynamically.

* \#153218 - ChartAxis's ControlTemplate updated properly upon dynamic changes.

* \#153794 - Null reference exception no longer thrown, when ChartSeries's [`SelectedIndex`](http://help.syncfusion.com/uwp/sfchart/interactive-features#selection) defined in code behind. 

* \#149899 - Legend will be viewed correctly while loading chart inside the Frame control, as its source.

* \#150820 - Zooming toolbar icons are activated properly, while selection zooming done across the chart area.

* \#149982 - Tick lines position aligned properly with respect to the grid lines position, when [`EdgeLabelDrawingMode`](http://help.syncfusion.com/cr/cref_files/winrt/sfchart/Syncfusion.SfChart.WinRT~Syncfusion.UI.Xaml.Charts.ChartAxis~EdgeLabelsDrawingMode.html) property is defined as Fit.

* \#152927 - Issue with chart series sorting order on recursive change in the [`IsSortData`](http://help.syncfusion.com/uwp/sfchart/sorting) and ItemsSource property has been fixed.

* \#150660 - [`AreaSeries`](http://help.syncfusion.com/uwp/sfchart/series#areaseries) with large number of data points can be view clearly in the zoomed state now.

* \#153025 - Now animation working properly in column series, when enable the animation in loaded events.  

### Features
{:#sfchart-features}

* Implemented the custom cursor support while hover the selectable segments.

* Implemented the support to align the ChartAxis's header inside or outside of the chart area, when [`ShowAxisNextToOrigin`](http://help.syncfusion.com/cr/cref_files/winrt/sfchart/Syncfusion.SfChart.WinRT~Syncfusion.UI.Xaml.Charts.ChartAxis~ShowAxisNextToOrigin.html) is enabled.

* Provided the support to consider Null value as [`EmptyPoints`](http://help.syncfusion.com/uwp/sfchart/emptypoints).

* Provided the option to rotate the axis label upon overlapping, in addition with hide and multiple row.

* Implemented the tooltip support for [`ChartAdornments`](http://help.syncfusion.com/uwp/sfchart/adornments).

* Provided the support to resize the zooming toolbar items(icons) in [`ZoomPanBehavior`](http://help.syncfusion.com/uwp/sfchart/interactive-features#zooming-and-panning).



### Breaking Changes
{:#sfchart-breaking-changes}

* Changed the default UI look for [`CrossHair`](http://help.syncfusion.com/uwp/sfchart/interactive-features#crosshair) and [`Legend`](http://help.syncfusion.com/uwp/sfchart/legend).

* Changed the default value of ExplodeRadius property for Pie and Doughnut series.

* Null points will be consider as [`EmptyPoints`](http://help.syncfusion.com/uwp/sfchart/emptypoints) now.

* Now the axis labels will rotate with tick lines as its center point. 

* Polar/Radar series will be render in clockwise direction.


