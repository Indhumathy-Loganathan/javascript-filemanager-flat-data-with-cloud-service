## SfMaps

### Bug fixes
{:#sfmaps-bug-fixes}

* \#I344471 - [Android] Memory will be released properly when using [`MarkerTemplate`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.MapLayer.html#Syncfusion_SfMaps_XForms_MapLayer_MarkerTemplate) and changing the [`MarkerItemsSource`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.MapLayer.html#Syncfusion_SfMaps_XForms_MapLayer_MarkerItemsSource) continuously.
* \#I344003 - [iOS] [`GeopointToViewPoint`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.MapLayer.html#Syncfusion_SfMaps_XForms_MapLayer_GeopointToViewPoint_System_Double_System_Double_) method will return the correct value.
* \#I344802 - [Android] [`GeoCoordinates`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.ImageryLayer.html#Syncfusion_SfMaps_XForms_ImageryLayer_GeoCoordinates) will not get reset while changing the [`BingMapStyle`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.ImageryLayer.html#Syncfusion_SfMaps_XForms_ImageryLayer_BingMapStyle) dynamically.
* \#FB28958 - The [`GeoCoordinates`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.ImageryLayer.html#Syncfusion_SfMaps_XForms_ImageryLayer_GeoCoordinates) property will be updated properly even if the [`GeoCoordinateChanged`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.ImageryLayer.html#Syncfusion_SfMaps_XForms_ImageryLayer_GeoCoordinateChanged) event is not subscribed.
* \#343749 - [Android, iOS] The custom [`SubLayers`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.MapLayer.html#Syncfusion_SfMaps_XForms_MapLayer_Sublayers) will be rendered in the correct position when setting [`GeometryType`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.ShapeFileLayer.html#Syncfusion_SfMaps_XForms_ShapeFileLayer_GeometryType) as [`Points`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.GeometryType.html#Syncfusion_SfMaps_XForms_GeometryType_Points).
* \#345488 - [Android, iOS] The [`MarkerSelected`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.MapLayer.html#Syncfusion_SfMaps_XForms_MapLayer_MarkerSelected) event selects the correct marker after selecting two-three markers when setting [`CanBringToTop`](https://help.syncfusion.com/cr/xamarin/Syncfusion.SfMaps.XForms.MarkerSelectedEventArgs.html#Syncfusion_SfMaps_XForms_MarkerSelectedEventArgs_CanBringToTop) is true.