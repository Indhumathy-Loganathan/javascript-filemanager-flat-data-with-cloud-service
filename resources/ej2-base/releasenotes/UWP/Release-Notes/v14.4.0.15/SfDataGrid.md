## SfDataGrid

### Features
{:#sfdatagrid-features}

* \#162623 - Provided support to update the `FilterRowText` when applying the filter programmatically.
* \#166142 - Provided support for changing the Filter Popup size by setting `GridFilterControl` style.
* \#164532 - Provided support to notify details view DataGrid events to parent DataGrid. 
* \#160865 - Provided the support to change the expander column width and indent column widths. 
* \#166922 - Provided the support for `NewItemPlaceHolderPosition` when adding a new record using AddNewRow.
* \#162862 - Provided the support to fill the remaining width for column based on other column widths.

### Bug fixes
{:#sfdatagrid-bug-fixes}

* \#166289 - Null value is now committed properly while pressing <kbd>Enter</kbd> key in `GridDateTimeColumn`.

### Breaking Changes
{:#sfdatagrid-breaking-changes}

* In `GridSelectedRowsCollection` class, `Contains` method has been renamed to `ContainsObject`.

