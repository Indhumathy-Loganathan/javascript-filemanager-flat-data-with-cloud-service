## DataGrid

The Grid component is used to display and manipulate tabular data with configuration options to control the way the data is presented. It can pull data from data sources such as array of JavaScript objects, OData web services, or DataManager and binding data fields to columns. It also displays the column header to identify the field with support for grouped records.

The most important features available in the grid component are paging, sorting, filtering, searching, and grouping.

- **Data sources**: Binds the grid component with an array of JavaScript objects or DataManager.
- **Sorting and grouping**: Supports n level of sorting and grouping.
- **Filtering**: Offers filter bar in each column to filter data.
- **Paging**: Allows easy switching between pages using the pager bar.
- **Editing**:provides the options for create, read, update, and delete operations.
- **Columns**:The column definitions are used as the dataSource schema in the Grid. This plays a vital role in rendering column values in the required format.
- **Reordering**: Allows drag and drop of any column anywhere in the grid’s column header row, thus allowing repositioning of columns.
- **Column Chooser**:The column chooser provides a list of column names paired with check boxes that allow the visibility to be toggled on the fly.
- **Resizing**:Resizing allows changing column width on the fly by simply dragging the right corner of the column header.
- **Freeze**:Columns and rows can be frozen to allow scrolling and comparing cell values.
- **Cell Spanning**:Grid cells can be spanned based on the preferred criteria.
- **Foreign data source**:This provides the option to show values from external or lookup data sources in a column based on foreign key/value mapping.
- **Cell Styling**:Grid cell styles can be customized either by using CSS or programmatically.
- **Selection**:Rows or cells can be selected in the grid. One or more rows or cells can also be selected by holding Ctrl or Command, or programmatically.
- **Templates** - Templates can be used to create custom user experiences in the grid.
- **Aggregation** - Provides the option to easily visualized the Aggregates for column values.
- **Context menu** -The context menu provides a list of actions to be performed in the grid. It appears when a cell, header, or the pager is right-clicked.
- **Clipboard** - Selected rows and cells can be copied from the grid
- **Export** - Provides the options to Export the grid data to Excel, PDF, and CSV formats.
- **RTL support**: Provides right-to-left mode that aligns the grid content from right to left.
- **Localization**: Provides an inherent support to localize the UI.