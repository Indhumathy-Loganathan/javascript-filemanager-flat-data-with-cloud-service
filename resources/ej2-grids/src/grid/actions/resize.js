import { EventHandler, detach, formatUnit, Browser, closest } from '@syncfusion/ej2-base';
import { Column } from '../models/column';
import { ColumnWidthService } from '../services/width-controller';
import * as events from '../base/constant';
import { getScrollBarWidth, parentsUntil, Global, frozenDirection, isChildColumn, applyStickyLeftRightPosition, groupCaptionRowLeftRightPos } from '../base/util';
import { isNullOrUndefined, addClass, removeClass } from '@syncfusion/ej2-base';
import * as literals from '../base/string-literals';
export var resizeClassList = {
    root: 'e-rhandler',
    suppress: 'e-rsuppress',
    icon: 'e-ricon',
    helper: 'e-rhelper',
    header: 'th.e-headercell',
    cursor: 'e-rcursor'
};
/**
 * `Resize` module is used to handle Resize to fit for columns.
 *
 * @hidden
 * @private
 */
var Resize = /** @class */ (function () {
    /**
     * Constructor for the Grid resize module
     *
     * @param {IGrid} parent - specifies the IGrid
     * @hidden
     */
    function Resize(parent) {
        this.tapped = false;
        this.isDblClk = true;
        /** @hidden */
        this.resizeProcess = false;
        this.parent = parent;
        if (this.parent.isDestroyed) {
            return;
        }
        this.widthService = new ColumnWidthService(parent);
        this.addEventListener();
    }
    /**
     * Resize by field names.
     *
     * @param  {string|string[]} fName - Defines the field name.
     * @returns {void}
     */
    Resize.prototype.autoFitColumns = function (fName) {
        var columnName = (fName === undefined || fName === null || fName.length <= 0) ?
            this.parent.getColumns().map(function (x) { return x.field; }) : (typeof fName === 'string') ? [fName] : fName;
        this.parent.isAutoFitColumns = true;
        if (this.parent.enableAdaptiveUI) {
            this.parent.element.classList.add('e-grid-autofit');
        }
        this.findColumn(columnName);
    };
    Resize.prototype.autoFit = function () {
        var newarray = this.parent.getColumns().filter(function (c) { return c.autoFit === true; })
            .map(function (c) { return c.field || c.headerText; });
        if (newarray.length > 0) {
            this.autoFitColumns(newarray);
        }
        if (this.parent.resizeSettings.mode === 'Auto') {
            this.widthService.setWidthToTable();
        }
    };
    Resize.prototype.resizeColumn = function (fName, index, id) {
        var gObj = this.parent;
        var tWidth = 0;
        var headerTable = gObj.getHeaderTable();
        var contentTable = gObj.getContentTable();
        var footerTable;
        var headerDivTag = 'e-gridheader';
        var contentDivTag = literals.gridContent;
        var footerDivTag = literals.gridFooter;
        var indentWidth = 0;
        var uid = id ? id : this.parent.getUidByColumnField(fName);
        var columnIndex = this.parent.getNormalizedColumnIndex(uid);
        var headerTextClone = headerTable.querySelector('[e-mappinguid="' + uid + '"]').parentElement.cloneNode(true);
        var contentTextClone = contentTable.querySelectorAll("td.e-rowcell:nth-child(" + (columnIndex + 1) + "):not(.e-groupcaption):not(.e-detailcell)");
        var footerTextClone;
        var columnIndexByField = this.parent.getColumnIndexByField(fName);
        if (!isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContentTable();
        }
        if (footerTable) {
            footerTextClone = footerTable.querySelectorAll("td:nth-child(" + (columnIndex + 1) + "):not(.e-groupcaption)");
        }
        var indentWidthClone = [].slice.call(headerTable.querySelector('tr').getElementsByClassName('e-grouptopleftcell'));
        if (indentWidthClone.length > 0) {
            for (var i = 0; i < indentWidthClone.length; i++) {
                indentWidth += indentWidthClone[parseInt(i.toString(), 10)].offsetWidth;
            }
        }
        var detailsElement = contentTable.querySelector('.e-detailrowcollapse') ||
            contentTable.querySelector('.e-detailrowexpand');
        if ((this.parent.detailTemplate || this.parent.childGrid) && detailsElement) {
            indentWidth += detailsElement.offsetWidth;
        }
        var headerText = [headerTextClone];
        var contentText = [];
        var footerText = [];
        if (footerTable) {
            for (var i = 0; i < footerTextClone.length; i++) {
                footerText[parseInt(i.toString(), 10)] = footerTextClone[parseInt(i.toString(), 10)].cloneNode(true);
            }
        }
        for (var i = 0; i < contentTextClone.length; i++) {
            contentText[parseInt(i.toString(), 10)] = contentTextClone[parseInt(i.toString(), 10)].cloneNode(true);
        }
        var wHeader = this.createTable(headerTable, headerText, headerDivTag);
        var wFooter = null;
        var wContent = null;
        if (gObj.getCurrentViewRecords().length) {
            wContent = this.createTable(contentTable, contentText, contentDivTag);
        }
        if (footerText.length) {
            wFooter = this.createTable(footerTable, footerText, footerDivTag);
        }
        var columnbyindex = gObj.getColumns()[parseInt(columnIndexByField.toString(), 10)];
        var width = columnbyindex.width = formatUnit(Math.max(wHeader, wContent, wFooter));
        var colMaxWidth = columnbyindex.maxWidth && parseFloat(columnbyindex.maxWidth.toString());
        if (parseInt(width, 10) > colMaxWidth) {
            columnbyindex.width = colMaxWidth;
        }
        this.widthService.setColumnWidth(gObj.getColumns()[parseInt(columnIndexByField.toString(), 10)]);
        var result = gObj.getColumns().some(function (x) { return x.width === null
            || x.width === undefined || x.width.length <= 0; });
        if (result === false) {
            var element = gObj.getColumns();
            for (var i = 0; i < element.length; i++) {
                if (element[parseInt(i.toString(), 10)].visible) {
                    tWidth = tWidth + parseFloat(element[parseInt(i.toString(), 10)].width);
                }
            }
        }
        var calcTableWidth = tWidth + indentWidth;
        if (tWidth > 0) {
            if (this.parent.detailTemplate || this.parent.childGrid) {
                this.widthService.setColumnWidth(new Column({ width: '30px' }));
            }
            if (this.parent.resizeSettings.mode === 'Auto') {
                calcTableWidth = '100%';
            }
            headerTable.style.width = formatUnit(calcTableWidth);
            contentTable.style.width = formatUnit(calcTableWidth);
            if (!isNullOrUndefined(footerTable)) {
                footerTable.style.width = formatUnit(calcTableWidth);
            }
        }
        if (gObj.isFrozenGrid() && gObj.enableColumnVirtualization) {
            this.widthService.refreshFrozenScrollbar();
        }
        var tableWidth = headerTable.offsetWidth;
        var contentwidth = (gObj.getContent().scrollWidth);
        if (contentwidth > tableWidth) {
            headerTable.classList.add('e-tableborder');
            contentTable.classList.add('e-tableborder');
        }
        else {
            headerTable.classList.remove('e-tableborder');
            contentTable.classList.remove('e-tableborder');
        }
        if (!isNullOrUndefined(footerTable)) {
            footerTable.classList.add('e-tableborder');
        }
    };
    /**
     * To destroy the resize
     *
     * @returns {void}
     * @hidden
     */
    Resize.prototype.destroy = function () {
        var gridElement = this.parent.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector('.' + literals.gridContent))) {
            return;
        }
        this.widthService = null;
        this.unwireEvents();
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    Resize.prototype.getModuleName = function () {
        return 'resize';
    };
    Resize.prototype.findColumn = function (fName) {
        for (var i = 0; i < fName.length; i++) {
            var fieldName = fName[parseInt(i.toString(), 10)];
            var columnIndex = this.parent.getColumnIndexByField(fieldName);
            var column = this.parent.getColumns()[parseInt(columnIndex.toString(), 10)];
            if (columnIndex > -1 && !isNullOrUndefined(column) && column.visible === true) {
                this.resizeColumn(fieldName, columnIndex);
            }
        }
        if (this.parent.allowTextWrap) {
            this.parent.notify(events.freezeRender, { case: 'refreshHeight', isModeChg: true });
        }
        if (this.parent.isFrozenGrid()) {
            this.refreshResizefrzCols(true, true);
        }
    };
    /**
     * To create table for autofit
     *
     * @param {Element} table - specifies the table
     * @param {Element[]} text - specifies the text
     * @param {string} tag - specifies the tag name
     * @returns {number} returns the number
     * @hidden
     */
    Resize.prototype.createTable = function (table, text, tag) {
        var myTableDiv = this.parent.createElement('div');
        var adaptiveClass = this.parent.enableAdaptiveUI ? ' e-bigger' : '';
        myTableDiv.className = this.parent.element.className + adaptiveClass;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        var mySubDiv = this.parent.createElement('div');
        mySubDiv.className = tag;
        var myTable = this.parent.createElement('table', { attrs: { role: 'grid' } });
        myTable.className = table.className;
        myTable.classList.add('e-resizetable');
        myTable.style.cssText = 'table-layout: auto;width: auto';
        var myTr = this.parent.createElement('tr');
        for (var i = 0; i < text.length; i++) {
            var tr = myTr.cloneNode();
            tr.className = table.querySelector('tr').className;
            tr.appendChild(text[parseInt(i.toString(), 10)]);
            myTable.appendChild(tr);
        }
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        var offsetWidthValue = myTable.getBoundingClientRect().width;
        document.body.removeChild(myTableDiv);
        return Math.ceil(offsetWidthValue);
    };
    /**
     * @returns {void}
     * @hidden
     */
    Resize.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.headerRefreshed, this.refreshHeight, this);
        this.parent.on(events.refreshResizePosition, this.refreshResizePosition, this);
        this.parent.on(events.initialEnd, this.wireEvents, this);
        this.parent.on(events.contentReady, this.autoFit, this);
        this.parent.on(events.refreshHandlers, this.refreshHeight, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    /**
     * @returns {void}
     * @hidden
     */
    Resize.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.headerRefreshed, this.refreshHeight);
        this.parent.off(events.refreshResizePosition, this.refreshResizePosition);
        this.parent.off(events.initialEnd, this.wireEvents);
        this.parent.off(events.refreshHandlers, this.refreshHeight);
        this.parent.off(events.destroy, this.destroy);
    };
    /**
     * @returns {void}
     * @hidden
     */
    Resize.prototype.render = function () {
        this.unwireEvents();
        this.wireEvents();
        this.setHandlerHeight();
    };
    Resize.prototype.refreshHeight = function () {
        if (this.parent.getHeaderTable()) {
            var element = this.getResizeHandlers();
            for (var i = 0; i < element.length; i++) {
                if (element[parseInt(i.toString(), 10)].parentElement.offsetHeight > 0) {
                    element[parseInt(i.toString(), 10)].style.height = element[parseInt(i.toString(), 10)].parentElement.offsetHeight + 'px';
                }
            }
            this.setHandlerHeight();
        }
    };
    Resize.prototype.wireEvents = function () {
        EventHandler.add(this.parent.getHeaderContent(), Browser.touchStartEvent, this.touchResizeStart, this);
        EventHandler.add(this.parent.getHeaderContent(), events.dblclick, this.callAutoFit, this);
    };
    Resize.prototype.unwireEvents = function () {
        EventHandler.remove(this.parent.getHeaderContent(), Browser.touchStartEvent, this.touchResizeStart);
        EventHandler.remove(this.parent.getHeaderContent(), events.dblclick, this.callAutoFit);
    };
    Resize.prototype.getResizeHandlers = function () {
        return [].slice.call(this.parent.getHeaderTable().getElementsByClassName(resizeClassList.root));
    };
    Resize.prototype.setHandlerHeight = function () {
        var element = [].slice.call(this.parent.getHeaderTable().getElementsByClassName(resizeClassList.suppress));
        for (var i = 0; i < element.length; i++) {
            element[parseInt(i.toString(), 10)].style.height = element[parseInt(i.toString(), 10)].parentElement.offsetHeight + 'px';
        }
    };
    Resize.prototype.callAutoFit = function (e) {
        if (e.target.classList.contains('e-rhandler')) {
            var col = this.getTargetColumn(e);
            if (col.columns) {
                return;
            }
            this.resizeColumn(col.field, this.parent.getNormalizedColumnIndex(col.uid), col.uid);
            var header = closest(e.target, resizeClassList.header);
            header.classList.add('e-resized');
        }
    };
    Resize.prototype.touchResizeStart = function (e) {
        if (!Global.timer) {
            Global.timer = setTimeout(function () {
                Global.timer = null;
            }, 300);
            return this.resizeStart(e);
        }
        else {
            clearTimeout(Global.timer);
            Global.timer = null;
            this.callAutoFit(e);
        }
    };
    Resize.prototype.resizeStart = function (e) {
        var _this = this;
        if (e.target.classList.contains('e-rhandler')) {
            if (!this.helper) {
                if (this.getScrollBarWidth() === 0) {
                    this.resizeProcess = true;
                    if (this.parent.allowGrouping) {
                        for (var i = 0; i < this.parent.groupSettings.columns.length; i++) {
                            this.widthService.setColumnWidth(new Column({ width: '30px' }), i);
                        }
                    }
                    for (var _i = 0, _a = this.refreshColumnWidth(); _i < _a.length; _i++) {
                        var col = _a[_i];
                        this.widthService.setColumnWidth(col);
                    }
                    this.widthService.setWidthToTable();
                    this.resizeProcess = false;
                }
                this.refreshStackedColumnWidth();
                this.element = e.target;
                this.parentElementWidth = this.parent.element.getBoundingClientRect().width;
                this.appendHelper();
                this.column = this.getTargetColumn(e);
                this.pageX = this.getPointX(e);
                if (this.column.getFreezeTableName() === literals.frozenRight) {
                    if (this.parent.enableRtl) {
                        this.minMove = (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0)
                            - parseFloat(isNullOrUndefined(this.column.width) ? '' : this.column.width.toString());
                    }
                    else {
                        this.minMove = parseFloat(isNullOrUndefined(this.column.width) ? '' : this.column.width.toString())
                            - (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0);
                    }
                }
                else if (this.parent.enableRtl) {
                    this.minMove = parseFloat(this.column.width.toString())
                        - (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0);
                }
                else {
                    this.minMove = (this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 0)
                        - parseFloat(isNullOrUndefined(this.column.width) ? '' : this.column.width.toString());
                }
                this.minMove += this.pageX;
            }
            if (Browser.isDevice && !this.helper.classList.contains(resizeClassList.icon)) {
                this.helper.classList.add(resizeClassList.icon);
                EventHandler.add(document, Browser.touchStartEvent, this.removeHelper, this);
                EventHandler.add(this.helper, Browser.touchStartEvent, this.resizeStart, this);
            }
            else {
                var args = { e: e, column: this.column };
                this.parent.trigger(events.resizeStart, args, function (args) {
                    if (args.cancel || _this.parent.isEdit) {
                        _this.cancelResizeAction();
                        return;
                    }
                    EventHandler.add(document, Browser.touchEndEvent, _this.resizeEnd, _this);
                    EventHandler.add(_this.parent.element, Browser.touchMoveEvent, _this.resizing, _this);
                    _this.updateCursor('add');
                });
            }
        }
    };
    Resize.prototype.cancelResizeAction = function (removeEvents) {
        if (removeEvents) {
            EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
            EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
            this.updateCursor('remove');
        }
        if (Browser.isDevice) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
        }
        detach(this.helper);
        this.refresh();
    };
    Resize.prototype.getWidth = function (width, minWidth, maxWidth) {
        if (minWidth && width < minWidth) {
            return minWidth;
        }
        else if ((maxWidth && width > maxWidth)) {
            return maxWidth;
        }
        else {
            return width;
        }
    };
    Resize.prototype.updateResizeEleHeight = function () {
        var elements = [].slice.call(this.parent.getHeaderContent().getElementsByClassName('e-rhandler'));
        for (var i = 0; i < elements.length; i++) {
            elements[parseInt(i.toString(), 10)].style.height = this.element.parentElement.offsetHeight + 'px';
        }
    };
    Resize.prototype.getColData = function (column, mousemove) {
        return {
            width: parseFloat(isNullOrUndefined(this.widthService.getWidth(column)) || this.widthService.getWidth(column) === 'auto' ? '0'
                : this.widthService.getWidth(column).toString()) + mousemove,
            minWidth: column.minWidth ? parseFloat(column.minWidth.toString()) : null,
            maxWidth: column.maxWidth ? parseFloat(column.maxWidth.toString()) : null
        };
    };
    Resize.prototype.refreshResizeFixedCols = function (pos) {
        var cols = this.parent.getColumns();
        var translateX = this.parent.enableColumnVirtualization ? this.parent.translateX : 0;
        var th = [].slice.call(this.parent.getHeaderContent().querySelector('tbody').querySelectorAll('.e-fixedfreeze')).concat([].slice.call(this.parent.getContent().querySelectorAll('.e-fixedfreeze')));
        for (var i = 0; i < th.length; i++) {
            var node = th[parseInt(i.toString(), 10)];
            var column = void 0;
            if (node.classList.contains('e-summarycell')) {
                var uid = node.getAttribute('e-mappinguid');
                column = this.parent.getColumnByUid(uid);
            }
            else {
                var index = parseInt(node.getAttribute('data-colindex'), 10);
                column = cols[parseInt(index.toString(), 10)];
            }
            var width = 0;
            if (pos === 'Left') {
                if (this.parent.getVisibleFrozenLeftCount()) {
                    width = this.parent.getIndentCount() * 30;
                }
                else if (this.parent.getFrozenMode() === 'Right') {
                    width = this.parent.groupSettings.columns.length * 30;
                }
                for (var j = 0; j < cols.length; j++) {
                    if (column.index > cols[parseInt(j.toString(), 10)].index) {
                        if (column.uid === cols[parseInt(j.toString(), 10)].uid) {
                            break;
                        }
                        if ((cols[parseInt(j.toString(), 10)].freeze === 'Left' || cols[parseInt(j.toString(), 10)].isFrozen) ||
                            cols[parseInt(j.toString(), 10)].freeze === 'Fixed') {
                            if (cols[parseInt(j.toString(), 10)].visible) {
                                width += parseFloat(cols[parseInt(j.toString(), 10)].width.toString());
                            }
                        }
                    }
                }
                applyStickyLeftRightPosition(node, ((width === 0 ? width : width - 1) - translateX), this.parent.enableRtl, 'Left');
            }
            if (pos === 'Right') {
                width = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
                for (var j = cols.length - 1; j >= 0; j--) {
                    if (column.uid === cols[parseInt(j.toString(), 10)].uid) {
                        break;
                    }
                    if (cols[parseInt(j.toString(), 10)].freeze === 'Right' || cols[parseInt(j.toString(), 10)].freeze === 'Fixed') {
                        if (cols[parseInt(j.toString(), 10)].visible) {
                            width += parseFloat(cols[parseInt(j.toString(), 10)].width.toString());
                        }
                    }
                }
                applyStickyLeftRightPosition(node, width + translateX, this.parent.enableRtl, 'Right');
            }
        }
    };
    Resize.prototype.refreshResizePosition = function () {
        this.refreshResizefrzCols(true);
    };
    Resize.prototype.refreshResizefrzCols = function (freezeRefresh, isAutoFitCol) {
        var _this = this;
        var translateX = this.parent.enableColumnVirtualization ? this.parent.translateX : 0;
        if (freezeRefresh || ((this.column.freeze === 'Left' || this.column.isFrozen) ||
            (this.column.columns && frozenDirection(this.column) === 'Left'))) {
            var width_1 = this.parent.getIndentCount() * 30;
            var columns = this.parent.getColumns().filter(function (col) { return col.freeze === 'Left' || col.isFrozen; });
            if (!freezeRefresh || isAutoFitCol) {
                this.frzHdrRefresh('Left');
            }
            for (var i = 0; i < columns.length; i++) {
                if (freezeRefresh || (columns[parseInt(i.toString(), 10)].index > this.column.index)) {
                    var elements = [];
                    if (this.parent.frozenRows) {
                        elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('td[data-colindex="' + i + '"]')).concat([].slice.call(this.parent.getContent().querySelectorAll('td[data-colindex="' + i + '"]')));
                    }
                    else {
                        elements = [].slice.call(this.parent.getContent().querySelectorAll('td[data-colindex="' + i + '"]'));
                    }
                    elements.filter(function (cell) {
                        applyStickyLeftRightPosition(cell, width_1 - translateX, _this.parent.enableRtl, 'Left');
                    });
                    if (this.parent.enableColumnVirtualization) {
                        columns[parseInt(i.toString(), 10)].valueX = width_1;
                    }
                }
                if (columns[parseInt(i.toString(), 10)].visible) {
                    width_1 += parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
                }
            }
            this.refreshResizeFixedCols('Left');
        }
        if (freezeRefresh || (this.column.freeze === 'Right' || (this.column.columns && frozenDirection(this.column) === 'Right'))) {
            var width_2 = this.parent.getFrozenMode() === 'Right' && this.parent.isRowDragable() ? 30 : 0;
            var columns = this.parent.getColumns();
            if (!freezeRefresh || isAutoFitCol) {
                this.frzHdrRefresh('Right');
            }
            var columnsRight = columns.filter(function (col) { return col.freeze === 'Right'; });
            for (var i = columns.length - 1; i >= columns.length - columnsRight.length; i--) {
                var elements = [];
                if (this.parent.frozenRows) {
                    elements = [].slice.call(this.parent.getHeaderContent().querySelectorAll('td[data-colindex="' + i + '"]')).concat([].slice.call(this.parent.getContent().querySelectorAll('td[data-colindex="' + i + '"]')));
                }
                else {
                    elements = [].slice.call(this.parent.getContent().querySelectorAll('td[data-colindex="' + i + '"]'));
                }
                elements.filter(function (cell) {
                    applyStickyLeftRightPosition(cell, width_2 + translateX, _this.parent.enableRtl, 'Right');
                });
                if (this.parent.enableColumnVirtualization) {
                    columns[parseInt(i.toString(), 10)].valueX = width_2;
                }
                if (columns[parseInt(i.toString(), 10)].visible) {
                    width_2 = width_2 + parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
                }
            }
            this.refreshResizeFixedCols('Right');
        }
        if (this.column && (this.column.freeze === 'Fixed' || (this.column.columns && frozenDirection(this.column) === 'Fixed'))) {
            this.refreshResizeFixedCols('Left');
            this.refreshResizeFixedCols('Right');
            this.frzHdrRefresh('Left');
            this.frzHdrRefresh('Right');
        }
        if (this.parent.groupSettings.columns.length && this.parent.aggregates.length &&
            this.parent.getContent().querySelector('.e-groupcaptionrow')) {
            this.refreshGroupCaptionRow();
        }
    };
    Resize.prototype.refreshGroupCaptionRow = function () {
        var capRow = [].slice.call(this.parent.getContent().querySelectorAll('.e-groupcaptionrow'));
        for (var i = 0; i < capRow.length; i++) {
            var tr = capRow[parseInt(i.toString(), 10)];
            if (tr.querySelector('.e-summarycell')) {
                groupCaptionRowLeftRightPos(tr, this.parent);
            }
        }
    };
    Resize.prototype.frzHdrRefresh = function (pos) {
        var _this = this;
        var translateX = this.parent.enableColumnVirtualization ? this.parent.translateX : 0;
        if (pos === 'Left') {
            var tr = [].slice.call(this.parent.getHeaderContent().querySelector('thead').querySelectorAll('tr'));
            for (var i = 0; i < tr.length; i++) {
                var th = [].slice.call(tr[parseInt(i.toString(), 10)].querySelectorAll('.e-leftfreeze,.e-fixedfreeze'));
                var _loop_1 = function (j) {
                    var node = th[parseInt(j.toString(), 10)];
                    if (node.classList.contains('e-rowdragheader') || node.classList.contains('e-dragheadercell') ||
                        node.classList.contains('e-grouptopleftcell')) {
                        return "continue";
                    }
                    var column = this_1.getParticularCol(node);
                    var cols = this_1.parent.getColumns();
                    var width = 0;
                    var summarycell = [];
                    if (this_1.parent.aggregates.length && this_1.parent.getFooterContent()) {
                        if (this_1.parent.getContent().querySelectorAll('.e-summaryrow').length) {
                            var summaryRows = [].slice.call(this_1.parent.getContent().querySelectorAll('.e-summaryrow'));
                            summaryRows.filter(function (row) {
                                summarycell.push(row.querySelector('[e-mappinguid="' + column.uid + '"]'));
                            });
                        }
                        summarycell = summarycell.concat([].slice.call(this_1.parent.getFooterContent().querySelectorAll('[e-mappinguid="' + column.uid + '"]')));
                    }
                    if (node.classList.contains('e-fixedfreeze')) {
                        if (this_1.parent.getVisibleFrozenLeftCount()) {
                            width = this_1.parent.getIndentCount() * 30;
                        }
                        else if (this_1.parent.getFrozenMode() === 'Right') {
                            width = this_1.parent.groupSettings.columns.length * 30;
                        }
                        for (var w = 0; w < cols.length; w++) {
                            if (column.index > cols[parseInt(w.toString(), 10)].index) {
                                if (column.uid === cols[parseInt(w.toString(), 10)].uid) {
                                    break;
                                }
                                if ((cols[parseInt(w.toString(), 10)].freeze === 'Left' || cols[parseInt(w.toString(), 10)].isFrozen) ||
                                    cols[parseInt(w.toString(), 10)].freeze === 'Fixed') {
                                    if (cols[parseInt(w.toString(), 10)].visible) {
                                        width += parseInt(cols[parseInt(w.toString(), 10)].width.toString(), 10);
                                    }
                                }
                            }
                        }
                        if (summarycell && summarycell.length) {
                            summarycell.filter(function (cell) {
                                applyStickyLeftRightPosition(cell, width - translateX, _this.parent.enableRtl, 'Left');
                            });
                        }
                        applyStickyLeftRightPosition(node, ((width === 0 ? width : width - 1) - translateX), this_1.parent.enableRtl, 'Left');
                    }
                    else {
                        width = this_1.parent.getIndentCount() * 30;
                        if (column.index === 0) {
                            if (summarycell && summarycell.length) {
                                summarycell.filter(function (cell) {
                                    applyStickyLeftRightPosition(cell, width - translateX, _this.parent.enableRtl, 'Left');
                                });
                            }
                            applyStickyLeftRightPosition(node, width - translateX, this_1.parent.enableRtl, 'Left');
                            if (this_1.parent.enableColumnVirtualization) {
                                column.valueX = width;
                            }
                        }
                        else {
                            for (var k = 0; k < cols.length; k++) {
                                if (column.index < cols[parseInt(k.toString(), 10)].index ||
                                    column.uid === cols[parseInt(k.toString(), 10)].uid) {
                                    break;
                                }
                                if (cols[parseInt(k.toString(), 10)].visible) {
                                    width += parseInt(cols[parseInt(k.toString(), 10)].width.toString(), 10);
                                }
                            }
                            if (summarycell && summarycell.length) {
                                summarycell.filter(function (cell) {
                                    applyStickyLeftRightPosition(cell, width - translateX, _this.parent.enableRtl, 'Left');
                                });
                            }
                            applyStickyLeftRightPosition(node, width - translateX, this_1.parent.enableRtl, 'Left');
                            if (this_1.parent.enableColumnVirtualization) {
                                column.valueX = width;
                            }
                        }
                    }
                };
                var this_1 = this;
                for (var j = 0; j < th.length; j++) {
                    _loop_1(j);
                }
            }
        }
        if (pos === 'Right') {
            var tr = [].slice.call(this.parent.getHeaderContent().querySelector('thead').querySelectorAll('tr'));
            for (var i = 0; i < tr.length; i++) {
                var th = [].slice.call(tr[parseInt(i.toString(), 10)].querySelectorAll('.e-rightfreeze, .e-fixedfreeze'));
                var _loop_2 = function (j) {
                    var node = th[parseInt(j.toString(), 10)];
                    var column = this_2.getParticularCol(node);
                    var cols = this_2.parent.getColumns();
                    var width = 0;
                    var summarycell = [];
                    if (this_2.parent.aggregates.length && this_2.parent.getFooterContent()) {
                        if (this_2.parent.getContent().querySelectorAll('.e-summaryrow').length) {
                            var summaryRows = [].slice.call(this_2.parent.getContent().querySelectorAll('.e-summaryrow'));
                            summaryRows.filter(function (row) {
                                summarycell.push(row.querySelector('[e-mappinguid="' + column.uid + '"]'));
                            });
                        }
                        summarycell = summarycell.concat([].slice.call(this_2.parent.getFooterContent().querySelectorAll('[e-mappinguid="' + column.uid + '"]')));
                    }
                    if (node.classList.contains('e-fixedfreeze')) {
                        width = this_2.parent.getFrozenMode() === 'Right' && this_2.parent.isRowDragable() ? 30 : 0;
                        for (var w = cols.length - 1; w >= 0; w--) {
                            if (column.index < cols[parseInt(w.toString(), 10)].index) {
                                if ((column.columns && isChildColumn(column, cols[parseInt(w.toString(), 10)].uid)) ||
                                    column.index > cols[parseInt(w.toString(), 10)].index) {
                                    break;
                                }
                                if (cols[parseInt(w.toString(), 10)].freeze === 'Right' ||
                                    cols[parseInt(w.toString(), 10)].freeze === 'Fixed') {
                                    if (cols[parseInt(w.toString(), 10)].visible) {
                                        width += parseFloat(cols[parseInt(w.toString(), 10)].width.toString());
                                    }
                                }
                            }
                        }
                        if (summarycell.length) {
                            summarycell.filter(function (cell) {
                                applyStickyLeftRightPosition(cell, width + translateX, _this.parent.enableRtl, 'Right');
                            });
                        }
                        applyStickyLeftRightPosition(node, width + translateX, this_2.parent.enableRtl, 'Right');
                    }
                    else {
                        width = this_2.parent.getFrozenMode() === 'Right' && this_2.parent.isRowDragable() ? 30 : 0;
                        for (var k = cols.length - 1; k >= 0; k--) {
                            if ((column.columns && isChildColumn(column, cols[parseInt(k.toString(), 10)].uid)) ||
                                column.index > cols[parseInt(k.toString(), 10)].index ||
                                column.uid === cols[parseInt(k.toString(), 10)].uid) {
                                break;
                            }
                            if (cols[parseInt(k.toString(), 10)].visible) {
                                width += parseInt(cols[parseInt(k.toString(), 10)].width.toString(), 10);
                            }
                        }
                        if (summarycell.length) {
                            summarycell.filter(function (cell) {
                                applyStickyLeftRightPosition(cell, width + translateX, _this.parent.enableRtl, 'Right');
                            });
                        }
                        applyStickyLeftRightPosition(node, width + translateX, this_2.parent.enableRtl, 'Right');
                        if (this_2.parent.enableColumnVirtualization) {
                            column.valueX = width;
                        }
                    }
                };
                var this_2 = this;
                for (var j = th.length - 1; j >= 0; j--) {
                    _loop_2(j);
                }
            }
        }
    };
    Resize.prototype.getParticularCol = function (node) {
        var uid = node.classList.contains('e-filterbarcell') ? node.getAttribute('e-mappinguid') :
            node.querySelector('[e-mappinguid]').getAttribute('e-mappinguid');
        return this.parent.getColumnByUid(uid);
    };
    Resize.prototype.resizing = function (e) {
        if (isNullOrUndefined(this.column)) {
            return;
        }
        if (this.parent.isFrozenGrid()) {
            this.refreshResizefrzCols();
        }
        var offsetWidth = 0;
        if (isNullOrUndefined(this.column)) {
            offsetWidth = parentsUntil(this.element, 'th').offsetWidth;
        }
        if (this.parent.allowTextWrap) {
            this.updateResizeEleHeight();
            this.setHelperHeight();
        }
        var pageX = this.getPointX(e);
        var mousemove = this.parent.enableRtl ? -(pageX - this.pageX) : (pageX - this.pageX);
        var colData = this.getColData(this.column, mousemove);
        if (!colData.width) {
            colData.width = closest(this.element, 'th').offsetWidth;
        }
        var width = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
        this.parent.log('resize_min_max', { column: this.column, width: width });
        if (((!this.parent.enableRtl && this.minMove >= pageX) || (this.parent.enableRtl && this.minMove <= pageX))) {
            width = this.column.minWidth ? parseFloat(this.column.minWidth.toString()) : 10;
            this.pageX = pageX = this.minMove;
        }
        if (width !== parseFloat(isNullOrUndefined(this.column.width) || this.column.width === 'auto' ?
            offsetWidth.toString() : this.column.width.toString())) {
            this.pageX = pageX;
            this.column.width = formatUnit(width);
            var args = {
                e: e,
                column: this.column
            };
            this.parent.trigger(events.onResize, args);
            if (args.cancel) {
                this.cancelResizeAction(true);
                return;
            }
            var columns = [this.column];
            var finalColumns = [this.column];
            if (this.column.columns) {
                columns = this.getSubColumns(this.column, []);
                columns = this.calulateColumnsWidth(columns, false, mousemove);
                finalColumns = this.calulateColumnsWidth(columns, true, mousemove);
            }
            this.resizeProcess = true;
            for (var _i = 0, finalColumns_1 = finalColumns; _i < finalColumns_1.length; _i++) {
                var col = finalColumns_1[_i];
                this.widthService.setColumnWidth(col, null, 'resize');
            }
            this.resizeProcess = false;
            this.updateHelper();
        }
        this.isDblClk = false;
    };
    Resize.prototype.calulateColumnsWidth = function (columns, isUpdate, mousemove) {
        var finalColumns = [];
        for (var _i = 0, columns_1 = columns; _i < columns_1.length; _i++) {
            var col = columns_1[_i];
            var totalWidth = 0;
            for (var i = 0; i < columns.length; i++) {
                totalWidth += parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
            }
            var colData = this.getColData(col, (parseFloat(col.width)) * mousemove / totalWidth);
            var colWidth = this.getWidth(colData.width, colData.minWidth, colData.maxWidth);
            if ((colWidth !== parseFloat(col.width.toString()))) {
                if (isUpdate) {
                    col.width = formatUnit(colWidth < 1 ? 1 : colWidth);
                }
                finalColumns.push(col);
            }
        }
        return finalColumns;
    };
    Resize.prototype.getSubColumns = function (column, subColumns) {
        for (var _i = 0, _a = column.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible !== false && col.allowResizing) {
                if (col.columns) {
                    this.getSubColumns(col, subColumns);
                }
                else {
                    subColumns.push(col);
                }
            }
        }
        return subColumns;
    };
    Resize.prototype.resizeEnd = function (e) {
        if (!this.helper || this.parent.isDestroyed) {
            return;
        }
        var gObj = this.parent;
        EventHandler.remove(this.parent.element, Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(document, Browser.touchEndEvent, this.resizeEnd);
        this.updateCursor('remove');
        detach(this.helper);
        var args = { e: e, column: this.column };
        var content = this.parent.getContent().querySelector('.' + literals.content);
        var cTable = content;
        if (cTable.scrollHeight > cTable.clientHeight) {
            this.parent.scrollModule.setPadding();
            cTable.style.overflowY = 'scroll';
        }
        this.parent.trigger(events.resizeStop, args);
        closest(this.element, '.e-headercell').classList.add('e-resized');
        this.isFrozenColResized = false;
        if (this.parent.allowTextWrap) {
            this.updateResizeEleHeight();
            this.parent.notify(events.textWrapRefresh, { case: 'textwrap' });
        }
        var headerTable = gObj.getHeaderTable();
        var contentTable = gObj.getContentTable();
        var footerTable;
        if (!isNullOrUndefined(gObj.getFooterContent())) {
            footerTable = gObj.getFooterContentTable();
        }
        var tableWidth = headerTable.offsetWidth;
        var contentwidth = (gObj.getContent().scrollWidth);
        if (contentwidth > tableWidth) {
            addClass([headerTable, contentTable], ['e-tableborder']);
        }
        else {
            removeClass([headerTable, contentTable], ['e-tableborder']);
        }
        if (!isNullOrUndefined(footerTable)) {
            footerTable.classList.add('e-tableborder');
        }
        this.refresh();
        this.doubleTapEvent(e);
        this.isDblClk = true;
    };
    Resize.prototype.getPointX = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    };
    Resize.prototype.refreshColumnWidth = function () {
        var columns = this.parent.getColumns();
        for (var _i = 0, _a = [].slice.apply(this.parent.getHeaderContent().querySelectorAll('th.e-headercell')); _i < _a.length; _i++) {
            var ele = _a[_i];
            for (var _b = 0, columns_2 = columns; _b < columns_2.length; _b++) {
                var column = columns_2[_b];
                if (ele.querySelector('[e-mappinguid]') &&
                    ele.querySelector('[e-mappinguid]').getAttribute('e-mappinguid') === column.uid && column.visible) {
                    column.width = ele.getBoundingClientRect().width;
                    break;
                }
            }
        }
        return columns;
    };
    Resize.prototype.refreshStackedColumnWidth = function () {
        for (var _i = 0, _a = this.parent.getStackedColumns(this.parent.columns); _i < _a.length; _i++) {
            var stackedColumn = _a[_i];
            stackedColumn.width = this.getStackedWidth(stackedColumn, 0);
        }
    };
    Resize.prototype.getStackedWidth = function (column, width) {
        for (var _i = 0, _a = column.columns; _i < _a.length; _i++) {
            var col = _a[_i];
            if (col.visible !== false) {
                if (col.columns) {
                    this.getStackedWidth(col, width);
                }
                else {
                    width += col.width;
                }
            }
        }
        return width;
    };
    Resize.prototype.getTargetColumn = function (e) {
        var cell = closest(e.target, resizeClassList.header);
        cell = cell.querySelector('.e-headercelldiv') || cell.querySelector('.e-stackedheadercelldiv');
        var uid = cell.getAttribute('e-mappinguid');
        return this.parent.getColumnByUid(uid);
    };
    Resize.prototype.updateCursor = function (action) {
        var headerRows = [].slice.call(this.parent.getHeaderContent().querySelectorAll('th'));
        headerRows.push(this.parent.element);
        for (var _i = 0, headerRows_1 = headerRows; _i < headerRows_1.length; _i++) {
            var row = headerRows_1[_i];
            row.classList["" + action](resizeClassList.cursor);
        }
    };
    Resize.prototype.refresh = function () {
        this.column = null;
        this.pageX = null;
        this.element = null;
        this.helper = null;
    };
    Resize.prototype.appendHelper = function () {
        this.helper = this.parent.createElement('div', {
            className: resizeClassList.helper
        });
        this.parent.element.appendChild(this.helper);
        this.setHelperHeight();
    };
    Resize.prototype.setHelperHeight = function () {
        var height = this.parent.getContent().offsetHeight - this.getScrollBarWidth();
        var rect = closest(this.element, resizeClassList.header);
        var tr = [].slice.call(this.parent.getHeaderContent().querySelectorAll('tr'));
        for (var i = tr.indexOf(rect.parentElement); i < tr.length && i > -1; i++) {
            height += tr[parseInt(i.toString(), 10)].offsetHeight;
        }
        var pos = this.calcPos(rect);
        pos.left += (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2);
        this.helper.style.cssText = 'height: ' + height + 'px; top: ' + pos.top + 'px; left:' + Math.floor(pos.left) + 'px;';
        if (this.parent.enableVirtualization) {
            this.helper.classList.add('e-virtual-rhandler');
        }
    };
    Resize.prototype.getScrollBarWidth = function (height) {
        var ele = this.parent.getContent().firstChild;
        return (ele.scrollHeight > ele.clientHeight && height) ||
            ele.scrollWidth > ele.clientWidth ? getScrollBarWidth() : 0;
    };
    Resize.prototype.removeHelper = function (e) {
        var cls = e.target.classList;
        if (!(cls.contains(resizeClassList.root) || cls.contains(resizeClassList.icon)) && this.helper) {
            EventHandler.remove(document, Browser.touchStartEvent, this.removeHelper);
            EventHandler.remove(this.helper, Browser.touchStartEvent, this.resizeStart);
            detach(this.helper);
            this.refresh();
        }
    };
    Resize.prototype.updateHelper = function () {
        var rect = closest(this.element, resizeClassList.header);
        var left;
        left = Math.floor(this.calcPos(rect).left + (this.parent.enableRtl ? 0 - 1 : rect.offsetWidth - 2));
        var borderWidth = 2; // to maintain the helper inside of grid element.
        if (left > this.parentElementWidth) {
            left = this.parentElementWidth - borderWidth;
        }
        this.helper.style.left = left + 'px';
    };
    Resize.prototype.calcPos = function (elem) {
        var parentOffset = {
            top: 0,
            left: 0
        };
        var offset = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var offsetParent = parentsUntil(elem, 'e-grid') || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            offsetParent.style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = offsetParent.getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    };
    Resize.prototype.doubleTapEvent = function (e) {
        var _this = this;
        if (this.getUserAgent() && this.isDblClk) {
            if (!this.tapped) {
                this.tapped = setTimeout(function () {
                    _this.tapped = null;
                }, 300);
            }
            else {
                clearTimeout(this.tapped);
                this.callAutoFit(e);
                this.tapped = null;
            }
        }
    };
    Resize.prototype.getUserAgent = function () {
        var userAgent = Browser.userAgent.toLowerCase();
        return /iphone|ipod|ipad/.test(userAgent);
    };
    Resize.prototype.timeoutHandler = function () {
        this.tapped = null;
    };
    return Resize;
}());
export { Resize };
