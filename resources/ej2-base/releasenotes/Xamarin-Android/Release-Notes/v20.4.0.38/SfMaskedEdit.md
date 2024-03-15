## SfMaskedEdit

### Bug fixes
{:#sfmaskededit-bug-fixes}

* \#I409083 - [Android] The [`SfMaskedEdit`](https://help.syncfusion.com/cr/wpf/Syncfusion.Windows.Controls.Input.SfMaskedEdit.html) control will not crash when pasting more characters even if the [`mask`](https://help.syncfusion.com/cr/wpf/Syncfusion.Windows.Controls.Input.SfMaskedEdit.html#Syncfusion_Windows_Controls_Input_SfMaskedEdit_Mask) permits fewer characters.
* \#I409873 - [Android] The [`SfMaskedEdit`](https://help.syncfusion.com/cr/wpf/Syncfusion.Windows.Controls.Input.SfMaskedEdit.html) will not misbehave when updating the [`mask`](https://help.syncfusion.com/cr/wpf/Syncfusion.Windows.Controls.Input.SfMaskedEdit.html#Syncfusion_Windows_Controls_Input_SfMaskedEdit_Mask) dynamically.
* \#I414628 - [Android] The exception will no longer occur when characters are pasted after typing some values.
* \#I413901 - [Android] The [`SfMaskedEdit`](https://help.syncfusion.com/cr/xamarin/Syncfusion.XForms.MaskedEdit.SfMaskedEdit.html) will no longer throw an exception when deleting the last character before the literal using the Delete key.
* \#I414416 - [Android] The [`SfMaskedEdit`](https://help.syncfusion.com/cr/xamarin/Syncfusion.XForms.MaskedEdit.SfMaskedEdit.html) will no longer throw an exception on loading when predefined text provided on both [`Mask`](https://help.syncfusion.com/cr/xamarin/Syncfusion.XForms.MaskedEdit.SfMaskedEdit.html#Syncfusion_XForms_MaskedEdit_SfMaskedEdit_Mask) and [`Value`](https://help.syncfusion.com/cr/xamarin/Syncfusion.XForms.MaskedEdit.SfMaskedEdit.html#Syncfusion_XForms_MaskedEdit_SfMaskedEdit_Value)