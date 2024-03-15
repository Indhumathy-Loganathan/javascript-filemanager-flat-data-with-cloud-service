var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { EventHandler, getValue, closest, isNullOrUndefined } from '@syncfusion/ej2-base';
import { addClass, removeClass, extend, Browser } from '@syncfusion/ej2-base';
import { CellType } from '../base/enum';
import * as event from '../base/constant';
import { Row } from '../models/row';
import { RowModelGenerator } from './row-model-generator';
import { parentsUntil, addRemoveEventListener, findCellIndex } from '../base/util';
import * as literals from '../base/string-literals';
/**
 * FocusStrategy class
 *
 * @hidden
 */
var FocusStrategy = /** @class */ (function () {
    function FocusStrategy(parent) {
        this.currentInfo = {};
        this.oneTime = true;
        this.swap = {};
        /** @hidden */
        this.isInfiniteScroll = false;
        this.forget = false;
        this.skipFocus = true;
        this.focusByClick = false;
        this.firstHeaderCellClick = false;
        this.prevIndexes = {};
        this.refMatrix = this.refreshMatrix(true);
        this.actions = ['downArrow', 'upArrow'];
        this.isVirtualScroll = false;
        this.parent = parent;
        this.rowModelGen = new RowModelGenerator(this.parent);
        this.addEventListener();
    }
    FocusStrategy.prototype.focusCheck = function (e) {
        var target = e.target;
        this.focusByClick = true;
        this.firstHeaderCellClick = true;
        this.skipFocus = target.classList.contains('e-grid');
    };
    FocusStrategy.prototype.onFocus = function (e) {
        if (this.parent.isDestroyed || Browser.isDevice || this.parent.enableVirtualization
            || this.parent.element.querySelector('.e-masked-table') || (!this.parent.isInitialLoad && e
            && e.target === this.parent.element && this.parent.element.querySelector('.e-spin-show'))) {
            return;
        }
        this.setActive(!this.parent.enableHeaderFocus && this.parent.frozenRows === 0);
        if (!this.parent.enableHeaderFocus && !this.parent.getCurrentViewRecords().length && ((this.parent.editSettings.mode !== 'Batch')
            || (this.parent.editSettings.mode === 'Batch' && this.parent.editModule && !this.parent.editModule.getBatchChanges()[literals.addedRecords].length))) {
            this.getContent().matrix.
                generate(this.rowModelGen.generateRows({ rows: [new Row({ isDataRow: true })] }), this.getContent().selector, false);
        }
        var current = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        if (this.skipFocus && !(e && e.target === this.parent.element)) {
            this.focus(e);
            this.skipFocus = false;
        }
    };
    FocusStrategy.prototype.passiveFocus = function (e) {
        if (this.parent.isDestroyed) {
            return;
        }
        var firstHeaderCell = this.parent.getHeaderContent().querySelector('.e-headercell');
        if (e.target === firstHeaderCell && e.relatedTarget && !parentsUntil(e.relatedTarget, 'e-grid')
            && !this.firstHeaderCellClick) {
            this.currentInfo.element = e.target;
            this.currentInfo.elementToFocus = e.target;
            addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
        }
        this.firstHeaderCellClick = false;
        if (e.target && e.target.classList.contains('e-detailcell')) {
            this.currentInfo.skipAction = false;
            addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
        }
    };
    FocusStrategy.prototype.onBlur = function (e) {
        // The below boolean condition for gantt team focus fix.
        var isGantt = parentsUntil(e.target, 'e-gantt') && e.target.classList.contains('e-rowcell')
            && (!isNullOrUndefined(e.target.nextElementSibling)
                && e.target.nextElementSibling.classList.contains('e-rowcell')) ? true : false;
        if ((this.parent.isEdit || e && (!e.relatedTarget || closest(e.relatedTarget, '.e-grid'))
            && !(this.parent.element.classList.contains('e-childgrid') && !this.parent.element.matches(':focus-within')))
            && !(!isGantt && isNullOrUndefined(e.relatedTarget) && parseInt(e.target.getAttribute('data-colindex'), 10) === 0
                && parseInt(e.target.getAttribute('index'), 10) === 0) && !(!isGantt && isNullOrUndefined(e.relatedTarget)
            && !closest(document.activeElement, '.e-grid') && !isNullOrUndefined(e['sourceCapabilities']))) {
            return;
        }
        this.removeFocus();
        this.skipFocus = true;
        this.currentInfo.skipAction = false;
        this.setLastContentCellTabIndex();
        this.setFirstFocusableTabIndex();
        this.firstHeaderCellClick = false;
    };
    /**
     * @returns {void}
     * @hidden */
    FocusStrategy.prototype.setFirstFocusableTabIndex = function () {
        var gObj = this.parent;
        gObj.element.tabIndex = -1;
        if (gObj.allowGrouping && gObj.groupSettings.showDropArea) {
            var groupModule = gObj.groupModule;
            var focusableGroupedItems = groupModule.getFocusableGroupedItems();
            if (focusableGroupedItems.length > 0) {
                groupModule.element.tabIndex = -1;
                focusableGroupedItems[0].tabIndex = 0;
            }
            else {
                groupModule.element.tabIndex = 0;
            }
            return;
        }
        if (gObj.toolbar || gObj.toolbarTemplate) {
            var toolbarElement = gObj.toolbarModule.element;
            var focusableToolbarItems = this.parent.toolbarModule.getFocusableToolbarItems();
            if (focusableToolbarItems.length > 0 && focusableToolbarItems[0].querySelector('.e-toolbar-item-focus,.e-btn,.e-input')) {
                toolbarElement.tabIndex = -1;
                focusableToolbarItems[0].querySelector('.e-toolbar-item-focus,.e-btn,.e-input').tabIndex = 0;
            }
            else {
                toolbarElement.tabIndex = 0;
            }
            return;
        }
        if (gObj.getColumns().length) {
            var firstHeaderCell = gObj.getHeaderContent().querySelector('.e-headercell');
            firstHeaderCell.tabIndex = 0;
            this.setActive(false);
            if (!isNullOrUndefined(this.active) && (isNullOrUndefined(this.active.target) || !this.active.target.classList.contains('e-columnmenu'))) {
                var firstHeaderCellIndex = [0, 0];
                if (this.active.matrix.matrix[firstHeaderCellIndex[0]][firstHeaderCellIndex[1]] === 0) {
                    firstHeaderCellIndex = findCellIndex(this.active.matrix.matrix, firstHeaderCellIndex, true);
                }
                this.active.matrix.current = firstHeaderCellIndex;
            }
            return;
        }
    };
    FocusStrategy.prototype.setLastContentCellTabIndex = function () {
        var contentTable = this.parent.getContentTable();
        if (contentTable.rows[contentTable.rows.length - 1]) {
            var lastCell = contentTable.rows[contentTable.rows.length - 1].lastElementChild;
            lastCell.tabIndex = 0;
        }
    };
    FocusStrategy.prototype.onClick = function (e, force) {
        if (parentsUntil(e.target, 'e-filterbarcell') && (parentsUntil(e.target, 'e-multiselect') ||
            e.target.classList.contains('e-input-group-icon'))) {
            return;
        }
        var isContent = !isNullOrUndefined(closest(e.target, '.' + literals.gridContent));
        var isHeader = !isNullOrUndefined(closest(e.target, '.' + literals.gridHeader));
        isContent = isContent && isHeader ? !isContent : isContent;
        if (!isContent && isNullOrUndefined(closest(e.target, '.' + literals.gridHeader)) ||
            e.target.classList.contains(literals.content) ||
            !isNullOrUndefined(closest(e.target, '.e-unboundcell'))) {
            return;
        }
        this.setActive(isContent);
        if (!isContent && isNullOrUndefined(closest(e.target, '.' + literals.gridHeader))) {
            this.clearOutline();
            return;
        }
        var beforeArgs = { cancel: false, byKey: false, byClick: !isNullOrUndefined(e.target), clickArgs: e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel || closest(e.target, '.e-inline-edit')) {
            return;
        }
        this.setActive(isContent);
        if (this.getContent()) {
            var returnVal = this.getContent().onClick(e, force);
            if (returnVal === false) {
                return;
            }
            this.focus();
            if (this.currentInfo.element.classList.contains('e-rowcell') && e.type && e.type === 'click') {
                addClass([this.currentInfo.element], ['e-focused', 'e-focus']);
            }
        }
    };
    FocusStrategy.prototype.onKeyPress = function (e) {
        if (this.parent.allowPaging) {
            var pagerElement = this.parent.pagerModule.pagerObj.element;
            var focusablePagerElements = this.parent.pagerModule.pagerObj.getFocusablePagerElements(pagerElement, []);
            if (this.parent.childGrid && !parentsUntil(e.target, 'e-gridpager') && this.allowToPaging(e) && focusablePagerElements.length) {
                focusablePagerElements[0].tabIndex = 0;
            }
            if (this.parent.pagerModule.pagerObj.checkPagerHasFocus()) {
                if (e.action === 'shiftTab' && focusablePagerElements.length && focusablePagerElements[0] === e.target) {
                    this.setActive(true);
                    var lastHeaderCellIndex = [this.active.matrix.matrix.length - 1,
                        this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
                    if (this.active.matrix.matrix[lastHeaderCellIndex[0]][lastHeaderCellIndex[1]] === 0) {
                        lastHeaderCellIndex = findCellIndex(this.active.matrix.matrix, lastHeaderCellIndex, false);
                    }
                    this.active.matrix.current = this.parent.editSettings.mode === 'Batch' ?
                        this.isValidBatchEditCell(lastHeaderCellIndex) ? lastHeaderCellIndex :
                            this.findBatchEditCell(lastHeaderCellIndex, false) : lastHeaderCellIndex;
                    e.preventDefault();
                    this.focus(e);
                    return;
                }
                if (!(e.action === 'tab' && this.parent.element.classList.contains('e-childgrid')
                    && ((!this.parent.pageSettings.pageSizes && focusablePagerElements.length
                        && focusablePagerElements[focusablePagerElements.length - 1] === e.target)
                        || (this.parent.pagerModule.pagerObj.getDropDownPage() === e.target)))) {
                    this.parent.pagerModule.pagerObj.changePagerFocus(e);
                    return;
                }
                else {
                    var parentCell = parentsUntil(this.parent.element, 'e-detailcell');
                    removeClass([this.parent.element], ['e-focus']);
                    removeClass([parentCell], ['e-focused']);
                    parentCell.tabIndex = -1;
                }
            }
            if (this.parent.pagerModule.pagerObj.element.tabIndex === 0 && (e.keyCode === 38 || (e.shiftKey && e.keyCode === 9))) {
                e.preventDefault();
                this.focus(e);
                return;
            }
            else if (this.parent.pagerModule.pagerObj.element.tabIndex === 0 && e.keyCode === 9) {
                e.preventDefault();
                this.parent.pagerModule.pagerObj.setPagerFocus();
                return;
            }
            if (this.parent.pagerModule.pagerObj.checkFirstPagerFocus()) {
                var lastRow = this.getContent().matrix.rows;
                var lastColumn = this.getContent().matrix.columns;
                this.getContent().matrix.current = [lastRow, lastColumn];
            }
        }
        if (this.parent.filterSettings.type === 'Excel') {
            if (e.target === document.querySelectorAll('.e-excelfilter .e-menu-item')[0] && e.key === 'Tab' && e.shiftKey && e.target.classList.contains('e-menufocus')) {
                e.preventDefault();
                e.target.classList.remove('e-menufocus');
                document.querySelector('.e-excelfilter .e-footer-content button:nth-child(2)').focus();
            }
            else if (e.target === document.querySelector('.e-excelfilter .e-footer-content button:nth-child(2)') && e.key === 'Tab' && !e.shiftKey && document.activeElement === document.querySelector('.e-excelfilter .e-footer-content button:nth-child(2)')) {
                e.preventDefault();
                document.querySelectorAll('.e-excelfilter .e-menu-item')[0].focus();
            }
        }
        if (this.skipOn(e)) {
            return;
        }
        if (e.target && parentsUntil(e.target, 'e-gridcontent')) {
            var rows = [].slice.call(this.parent.getContentTable().rows);
            var lastCell = rows[rows.length - 1].lastElementChild;
            if (e.target === lastCell) {
                this.setActive(true);
                this.setLastContentCellActive();
            }
        }
        if (e.action === 'shiftTab' && e.target && (e.target === this.parent.element || parentsUntil(e.target, 'e-toolbar')
            || parentsUntil(e.target, 'e-groupdroparea'))) {
            if (e.target === this.parent.element) {
                if (this.parent.element.classList.contains('e-childgrid')) {
                    this.focusOutFromChildGrid(e);
                }
                return;
            }
            if (parentsUntil(e.target, 'e-groupdroparea')) {
                if (this.parent.element.classList.contains('e-childgrid')) {
                    e.preventDefault();
                    this.parent.element.focus();
                }
                return;
            }
            if (parentsUntil(e.target, 'e-toolbar')) {
                if (this.parent.allowGrouping && this.parent.groupSettings.showDropArea) {
                    var groupModule = this.parent.groupModule;
                    var focusableGroupedItems = groupModule.getFocusableGroupedItems();
                    e.preventDefault();
                    if (focusableGroupedItems.length > 0) {
                        focusableGroupedItems[focusableGroupedItems.length - 1].focus();
                    }
                    else {
                        groupModule.element.focus();
                    }
                }
                else if (this.parent.element.classList.contains('e-childgrid')) {
                    e.preventDefault();
                    this.parent.element.focus();
                }
                return;
            }
        }
        var focusFirstHeaderCell = false;
        if (e.action === 'tab' && e.target && (e.target === this.parent.element || parentsUntil(e.target, 'e-toolbar')
            || parentsUntil(e.target, 'e-groupdroparea'))) {
            if (this.parent.allowGrouping && this.parent.groupSettings.showDropArea
                && (e.target === this.parent.element || e.target.classList.contains('e-groupdroparea'))) {
                var groupModule = this.parent.groupModule;
                var focusableGroupedItems = groupModule.getFocusableGroupedItems();
                if (focusableGroupedItems.length > 0) {
                    e.preventDefault();
                    focusableGroupedItems[0].focus();
                    return;
                }
                if (!e.target.classList.contains('e-groupdroparea')) {
                    e.preventDefault();
                    groupModule.element.focus();
                    return;
                }
            }
            if ((this.parent.toolbar || this.parent.toolbarTemplate) && (e.target === this.parent.element
                || parentsUntil(e.target, 'e-groupdroparea')
                || e.target.classList.contains('e-toolbar'))) {
                var toolbarElement = this.parent.toolbarModule.element;
                var focusableToolbarItems = this.parent.toolbarModule.getFocusableToolbarItems();
                if (focusableToolbarItems.length > 0) {
                    e.preventDefault();
                    focusableToolbarItems[0].querySelector('.e-toolbar-item-focus,.e-btn,.e-input').focus();
                    return;
                }
                if (!e.target.classList.contains('e-toolbar')) {
                    e.preventDefault();
                    toolbarElement.focus();
                    return;
                }
            }
            if (e.target === this.parent.element || parentsUntil(e.target, 'e-toolbar')
                || parentsUntil(e.target, 'e-groupdroparea')) {
                focusFirstHeaderCell = true;
            }
        }
        if (focusFirstHeaderCell) {
            if (this.parent.allowGrouping && this.parent.groupSettings.columns.length === this.parent.columns.length) {
                this.setActive(true);
            }
            else {
                this.setActive(false);
            }
            this.active.matrix.current = [0, -1];
        }
        this.activeKey = e.action;
        var beforeArgs = { cancel: false, byKey: true, byClick: false, keyArgs: e };
        this.parent.notify(event.beforeCellFocused, beforeArgs);
        if (beforeArgs.cancel) {
            return;
        }
        var bValue = this.getContent().matrix.current;
        var prevBatchValue = this.active && this.active.matrix.current ?
            [this.active.matrix.current[0], this.active.matrix.current[1]] : undefined;
        this.currentInfo.outline = true;
        var swapInfo = this.getContent().jump(e.action, bValue);
        this.swap = swapInfo;
        if (swapInfo.swap && !(this.parent.editSettings.mode === 'Batch'
            && (e.action === 'tab' || e.action === 'shiftTab'))) {
            this.setActive(!swapInfo.toHeader);
            this.getContent().matrix.current = this.getContent().getNextCurrent(bValue, swapInfo, this.active, e.action);
            this.prevIndexes = {};
        }
        this.setActiveByKey(e.action, this.getContent());
        var returnVal = this.content.lastIdxCell ? false : this.getContent().onKeyPress(e);
        if (e.target && parentsUntil(e.target, 'e-gridheader')) {
            if (e.action === 'tab' && bValue.toString() === this.active.matrix.current.toString()) {
                var nextHeaderCellIndex = findCellIndex(this.active.matrix.matrix, this.active.matrix.current, true);
                var lastHeaderCellIndex = [this.active.matrix.matrix.length - 1,
                    this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
                if (this.active.matrix.matrix[lastHeaderCellIndex[0]][lastHeaderCellIndex[1]] === 0) {
                    lastHeaderCellIndex = findCellIndex(this.active.matrix.matrix, lastHeaderCellIndex, false);
                }
                if (this.active.matrix.current.toString() === lastHeaderCellIndex.toString() && this.content.matrix.matrix.length) {
                    returnVal = true;
                    this.setActive(true);
                    var firstContentCellIndex = [0, 0];
                    if (this.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
                        firstContentCellIndex = findCellIndex(this.active.matrix.matrix, [0, 0], true);
                    }
                    this.active.matrix.current = this.parent.editSettings.mode === 'Batch' ?
                        this.isValidBatchEditCell(firstContentCellIndex) ? firstContentCellIndex :
                            this.findBatchEditCell(firstContentCellIndex, true) : firstContentCellIndex;
                }
                else if (this.active.matrix.current.toString() !== nextHeaderCellIndex.toString()) {
                    this.active.matrix.current = nextHeaderCellIndex;
                }
            }
            if (e.action === 'shiftTab' && bValue.toString() === this.active.matrix.current.toString()) {
                var previousCellIndex = findCellIndex(this.active.matrix.matrix, this.active.matrix.current, false);
                if (previousCellIndex.toString() === this.active.matrix.current.toString()) {
                    this.focusOutFromHeader(e);
                    return;
                }
                if (this.active.matrix.current.toString() !== previousCellIndex.toString() && !returnVal) {
                    returnVal = true;
                    this.active.matrix.current = previousCellIndex;
                }
            }
        }
        if (e.target && parentsUntil(e.target, 'e-gridcontent')) {
            if (this.parent.editSettings.mode === 'Batch' && (e.action === 'tab' || e.action === 'shiftTab')) {
                this.active.matrix.current = this.findBatchEditCell(prevBatchValue, e.action === 'tab' ? true : false);
                if (e.action === 'tab' && prevBatchValue.toString() === this.active.matrix.current.toString()) {
                    this.parent.editModule.editModule.addBatchRow = true;
                }
            }
            if (e.action === 'shiftTab' && bValue.toString() === this.active.matrix.current.toString()) {
                if (this.parent.allowGrouping && this.parent.groupSettings.columns.length === this.parent.columns.length) {
                    this.focusOutFromHeader(e);
                    return;
                }
                var firstContentCellIndex = [0, 0];
                if (this.active.matrix.matrix[firstContentCellIndex[0]][firstContentCellIndex[1]] === 0) {
                    firstContentCellIndex = findCellIndex(this.active.matrix.matrix, [0, 0], true);
                }
                if (!returnVal && (firstContentCellIndex.toString() === this.active.matrix.current.toString()
                    || (this.parent.editSettings.mode === 'Batch'
                        && prevBatchValue.toString() === this.active.matrix.current.toString()))) {
                    returnVal = true;
                    this.setActive(false);
                    this.setLastContentCellActive();
                }
            }
        }
        if (returnVal === false) {
            this.clearIndicator();
            if (e.action === 'shiftTab' && bValue.toString() === [0, 0].toString()) {
                this.parent.element.tabIndex = -1;
            }
            if (this.parent.allowPaging && !this.parent.pagerModule.pagerObj.checkPagerHasFocus() && this.allowToPaging(e)
                && bValue.toString() !== [0, 0].toString()) {
                e.preventDefault();
                if (e.keyCode === 40) {
                    this.parent.pagerModule.pagerObj.setPagerContainerFocus();
                    return;
                }
                else if (e.keyCode === 9) {
                    this.parent.pagerModule.pagerObj.setPagerFocus();
                    return;
                }
            }
            if (this.parent.element.classList.contains('e-childgrid')) {
                this.focusOutFromChildGrid(e);
            }
            return;
        }
        e.preventDefault();
        this.focus(e);
    };
    FocusStrategy.prototype.isValidBatchEditCell = function (cellIndex) {
        var cell = this.active.getTable().rows[cellIndex[0]].cells[cellIndex[1]];
        var tr = closest(cell, 'tr');
        var cellColIndex = parseInt(cell.getAttribute('data-colindex'), 10);
        var cellCol = this.parent.getColumns()[parseInt(cellColIndex.toString(), 10)];
        if (this.active.matrix.matrix[cellIndex[0]][cellIndex[1]] === 1
            && (!tr.classList.contains('e-row') || (tr.classList.contains('e-insertedrow') || !cellCol.isPrimaryKey) && cellCol.allowEditing)) {
            return true;
        }
        return false;
    };
    FocusStrategy.prototype.findBatchEditCell = function (currentCellIndex, next, limitRow) {
        var cellIndex = currentCellIndex;
        var tempCellIndex = currentCellIndex;
        var cellIndexObtain = false;
        while (!cellIndexObtain) {
            var prevTempCellIndex = tempCellIndex;
            tempCellIndex = findCellIndex(this.active.matrix.matrix, tempCellIndex, next);
            if ((prevTempCellIndex.toString() === tempCellIndex.toString())
                || (limitRow && prevTempCellIndex[0] !== tempCellIndex[0])) {
                cellIndexObtain = true;
                continue;
            }
            if (this.isValidBatchEditCell(tempCellIndex)) {
                cellIndex = tempCellIndex;
                cellIndexObtain = true;
            }
        }
        return cellIndex;
    };
    FocusStrategy.prototype.setLastContentCellActive = function () {
        var lastContentCellIndex = [this.active.matrix.matrix.length - 1,
            this.active.matrix.matrix[this.active.matrix.matrix.length - 1].length - 1];
        if (this.active.matrix.matrix[lastContentCellIndex[0]][lastContentCellIndex[1]] === 0) {
            lastContentCellIndex = findCellIndex(this.active.matrix.matrix, lastContentCellIndex, false);
        }
        this.active.matrix.current = lastContentCellIndex;
    };
    FocusStrategy.prototype.focusOutFromChildGrid = function (e) {
        var parentTable = parentsUntil(this.parent.element, 'e-table');
        var parentGrid = parentsUntil(parentTable, 'e-grid').ej2_instances[0];
        var parentCell = parentsUntil(this.parent.element, 'e-detailcell');
        var uid = parentsUntil(this.parent.element, 'e-detailrow').getAttribute('data-uid');
        var parentRows = [].slice.call(parentGrid.getContentTable().rows);
        var parentRowIndex = parentRows.map(function (m) { return m.getAttribute('data-uid'); }).indexOf(uid);
        if (e.action === 'tab' && parentRowIndex >= parentRows.length - 1) {
            return;
        }
        removeClass([this.parent.element], ['e-focus']);
        removeClass([parentCell], ['e-focused']);
        parentCell.tabIndex = -1;
        e.preventDefault();
        var nextFocusCell;
        parentGrid.focusModule.removeFocus();
        if (e.action === 'shiftTab') {
            var previousRow = parentRows[parentRowIndex - 1];
            var rowCells = previousRow.cells;
            for (var i = rowCells.length - 1; i >= 0; i--) {
                nextFocusCell = rowCells[parseInt(i.toString(), 10)];
                if (!nextFocusCell.classList.contains('e-hide')) {
                    parentGrid.focusModule.active.matrix.current = [parentRowIndex - 1, i];
                    break;
                }
            }
        }
        else {
            nextFocusCell = parentRows[parentRowIndex + 1].cells[0];
            parentGrid.focusModule.active.matrix.current = [parentRowIndex + 1, 0];
        }
        parentGrid.focusModule.currentInfo.element = nextFocusCell;
        parentGrid.focusModule.currentInfo.elementToFocus = nextFocusCell;
        addClass([nextFocusCell], ['e-focused', 'e-focus']);
        nextFocusCell.tabIndex = 0;
        nextFocusCell.focus();
    };
    FocusStrategy.prototype.focusOutFromHeader = function (e) {
        this.removeFocus();
        if (this.parent.toolbar || this.parent.toolbarTemplate) {
            var toolbarElement = this.parent.toolbarModule.element;
            var focusableToolbarItems = this.parent.toolbarModule.getFocusableToolbarItems();
            e.preventDefault();
            if (focusableToolbarItems.length > 0) {
                focusableToolbarItems[focusableToolbarItems.length - 1].querySelector('.e-toolbar-item-focus,.e-btn,.e-input').focus();
            }
            else {
                toolbarElement.focus();
            }
            return;
        }
        if (this.parent.allowGrouping && this.parent.groupSettings.showDropArea) {
            var groupModule = this.parent.groupModule;
            var focusableGroupedItems = groupModule.getFocusableGroupedItems();
            e.preventDefault();
            if (focusableGroupedItems.length > 0) {
                focusableGroupedItems[focusableGroupedItems.length - 1].focus();
            }
            else {
                groupModule.element.focus();
            }
            return;
        }
        if (this.parent.element.classList.contains('e-childgrid')) {
            e.preventDefault();
            this.parent.element.focus();
        }
    };
    FocusStrategy.prototype.allowToPaging = function (e) {
        if (this.parent.editSettings.mode === 'Batch' && this.parent.editSettings.allowAdding && e.keyCode !== 40) {
            return false;
        }
        return true;
    };
    FocusStrategy.prototype.skipOn = function (e) {
        var target = e.target;
        if (!target) {
            return false;
        }
        if (this.currentInfo.skipAction) {
            this.clearIndicator();
            return true;
        }
        if (['pageUp', 'pageDown', 'altDownArrow'].indexOf(e.action) > -1) {
            this.clearIndicator();
            return true;
        }
        if (this.parent.allowGrouping) {
            var focusableGroupedItems = this.parent.groupModule.getFocusableGroupedItems();
            if (parentsUntil(e.target, 'e-groupheadercell')
                && !((e.target === focusableGroupedItems[0] && e.action === 'shiftTab')
                    || (e.target === focusableGroupedItems[focusableGroupedItems.length - 1] && e.action === 'tab'))) {
                return true;
            }
        }
        if (this.parent.toolbar || this.parent.toolbarTemplate) {
            var toolbarElement = this.parent.toolbarModule.element;
            var focusableToolbarItems = toolbarElement
                .querySelectorAll('.e-toolbar-item:not(.e-overlay):not(.e-hidden)');
            if (parentsUntil(e.target, 'e-toolbar-item')
                && !(focusableToolbarItems.length > 0 && ((parentsUntil(e.target, 'e-toolbar-item') === focusableToolbarItems[0] && e.action === 'shiftTab')
                    || (parentsUntil(e.target, 'e-toolbar-item') === focusableToolbarItems[focusableToolbarItems.length - 1] && e.action === 'tab')))) {
                return true;
            }
        }
        var th = closest(target, 'th') && !closest(target, 'th').tabIndex;
        if (e.target.classList.contains('e-filterbaroperator') && (e.keyCode === 13 || e.keyCode === 27)) {
            var inputTarget = closest(e.target, '.e-filterbarcell');
            inputTarget.querySelector('input').focus();
        }
        if (th && closest(document.activeElement, '.e-filterbarcell') !== null) {
            this.removeFocus();
        }
        var filterCell = closest(document.activeElement, '.e-filterbarcell') !== null;
        if (this.parent.enableHeaderFocus && filterCell) {
            var matrix = this.active.matrix;
            var current = matrix.current;
            filterCell = matrix.matrix[current[0]].lastIndexOf(1) !== current[1];
        }
        return (e.action === 'delete'
            || (this.parent.editSettings.mode !== 'Batch' && (this.parent.isEdit || ['insert', 'f2'].indexOf(e.action) > -1))
            || ((filterCell && this.parent.enableHeaderFocus) || (filterCell && e.action !== 'tab' && e.action !== 'shiftTab') ||
                closest(document.activeElement, '#' + this.parent.element.id + '_searchbar') !== null
                    && ['enter', 'leftArrow', 'rightArrow',
                        'shiftLeft', 'shiftRight', 'ctrlPlusA'].indexOf(e.action) > -1)
            || (closest(target, '.' + literals.gridContent) === null && closest(target, '.' + literals.gridHeader) === null
                && !(e.target === this.parent.element || parentsUntil(e.target, 'e-toolbar')
                    || parentsUntil(e.target, 'e-groupdroparea')))
            || (e.action === 'space' && (!target.classList.contains(literals.gridChkBox) && closest(target, '.' + literals.gridChkBox) === null
                && closest(target, '.e-headerchkcelldiv') === null))) || closest(target, '.e-filter-popup') !== null;
    };
    FocusStrategy.prototype.focusVirtualElement = function (e) {
        var _this = this;
        if (this.parent.enableVirtualization || this.parent.enableInfiniteScrolling) {
            var data = { virtualData: {}, isAdd: false, isCancel: false };
            this.parent.notify(event.getVirtualData, data);
            var isKeyFocus = this.actions.some(function (value) { return value === _this.activeKey; });
            var isSelected = this.parent.contentModule ?
                this.parent.contentModule.selectedRowIndex > -1 : false;
            if (data.isAdd || Object.keys(data.virtualData).length || isKeyFocus || data.isCancel || isSelected) {
                this.parent.notify(event.resetVirtualFocus, { isCancel: false });
                data.isCancel = false;
                this.parent.contentModule.selectedRowIndex = -1;
                if (isKeyFocus) {
                    this.activeKey = this.empty;
                    this.parent.notify('virtaul-key-handler', e);
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                this.currentInfo.elementToFocus.focus({ preventScroll: true });
            }
            else {
                if (this.isVirtualScroll || this.isInfiniteScroll) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    this.currentInfo.elementToFocus.focus({ preventScroll: true });
                }
                else {
                    this.currentInfo.elementToFocus.focus();
                }
            }
        }
        this.isVirtualScroll = this.isInfiniteScroll = false;
    };
    FocusStrategy.prototype.getFocusedElement = function () {
        return this.currentInfo.elementToFocus;
    };
    FocusStrategy.prototype.getContent = function () {
        return this.active || this.content;
    };
    FocusStrategy.prototype.setActive = function (content) {
        this.active = content ? this.content : this.header;
    };
    FocusStrategy.prototype.setFocusedElement = function (element, e) {
        var _this = this;
        this.currentInfo.elementToFocus = element;
        setTimeout(function () {
            if (!isNullOrUndefined(_this.currentInfo.elementToFocus)) {
                if (_this.parent.enableVirtualization || _this.parent.enableInfiniteScrolling) {
                    _this.focusVirtualElement(e);
                }
                else {
                    _this.currentInfo.elementToFocus.focus();
                }
            }
        }, 0);
    };
    FocusStrategy.prototype.focus = function (e) {
        this.parent.notify(event.virtaulCellFocus, e);
        this.removeFocus();
        this.addFocus(this.getContent().getFocusInfo(), e);
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    FocusStrategy.prototype.removeFocus = function (e) {
        if (!this.currentInfo.element) {
            return;
        }
        if (this.parent.isReact && !this.parent.isEdit && this.currentInfo.element.classList.contains('e-rowcell')
            && !this.currentInfo.element.parentElement && !(this.parent.allowGrouping && this.parent.groupSettings.columns.length)) {
            var cellElem = this.parent.getCellFromIndex(this.prevIndexes.rowIndex, this.prevIndexes.cellIndex);
            this.currentInfo.element = cellElem ? cellElem : this.currentInfo.element;
        }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focused', 'e-focus']);
        this.currentInfo.element.tabIndex = -1;
    };
    /**
     * @returns {void}
     * @hidden */
    FocusStrategy.prototype.addOutline = function () {
        var info = this.getContent().getFocusInfo();
        if (info.element) {
            addClass([info.element], ['e-focused']);
            addClass([info.elementToFocus], ['e-focus']);
        }
    };
    /**
     * @returns {void}
     * @hidden */
    FocusStrategy.prototype.focusHeader = function () {
        this.setActive(false);
        this.resetFocus();
    };
    /**
     * @returns {void}
     * @hidden */
    FocusStrategy.prototype.focusContent = function () {
        this.setActive(true);
        this.resetFocus();
    };
    FocusStrategy.prototype.resetFocus = function () {
        var current = this.getContent().matrix.get(0, -1, [0, 1], null, this.getContent().validator());
        this.getContent().matrix.select(current[0], current[1]);
        this.focus();
    };
    FocusStrategy.prototype.addFocus = function (info, e) {
        this.currentInfo = info;
        this.currentInfo.outline = info.outline && (!isNullOrUndefined(e) || this.isVirtualScroll);
        if (this.isInfiniteScroll) {
            this.currentInfo.outline = true;
        }
        if (!info.element) {
            return;
        }
        var isFocused = info.elementToFocus.classList.contains('e-focus');
        if (isFocused) {
            return;
        }
        if (this.currentInfo.outline) {
            addClass([info.element], ['e-focused']);
        }
        addClass([info.elementToFocus], ['e-focus']);
        info.element.tabIndex = 0;
        if (!isFocused) {
            this.setFocusedElement(info.elementToFocus, e);
        }
        this.parent.notify(event.cellFocused, {
            element: info.elementToFocus,
            parent: info.element,
            indexes: this.getContent().matrix.current,
            byKey: !isNullOrUndefined(e),
            byClick: isNullOrUndefined(e),
            keyArgs: e,
            isJump: this.swap.swap,
            container: this.getContent().getInfo(e),
            outline: !isNullOrUndefined(e),
            swapInfo: this.swap
        });
        var _a = this.getContent().matrix.current, rowIndex = _a[0], cellIndex = _a[1];
        this.prevIndexes = { rowIndex: rowIndex, cellIndex: cellIndex };
        this.focusedColumnUid = this.parent.getColumnByIndex(cellIndex).uid;
        this.focusByClick = false;
    };
    FocusStrategy.prototype.refreshMatrix = function (content) {
        var _this = this;
        return function (e) {
            if (content && !_this.content) {
                _this.content = new ContentFocus(_this.parent);
            }
            if (!content && !_this.header) {
                _this.header = new HeaderFocus(_this.parent);
            }
            var cFocus = content ? _this.content : _this.header;
            var frozenRow = _this.parent.frozenRows;
            var batchLen = 0;
            if (frozenRow && _this.parent.editSettings.mode === 'Batch') {
                batchLen = _this.parent.getHeaderContent().querySelectorAll('.e-insertedrow').length +
                    _this.parent.getHeaderContent().querySelectorAll('.e-hiddenrow').length;
            }
            if (_this.parent.groupSettings.columns.length && frozenRow && content) {
                frozenRow = 0;
                for (var i = 0; i < e.rows.length; i++) {
                    frozenRow++;
                    if (e.rows[parseInt(i.toString(), 10)].index + 1 === _this.parent.frozenRows) {
                        break;
                    }
                }
            }
            var rows = content ? e.rows.slice(frozenRow + batchLen) : e.rows;
            var updateRow = content ? e.rows.slice(0, frozenRow + batchLen) : e.rows;
            if (_this.parent.isCollapseStateEnabled() && content) {
                rows = rows.filter(function (x) { return x.visible !== false; });
            }
            var isRowTemplate = !isNullOrUndefined(_this.parent.rowTemplate);
            if (frozenRow && ((_this.parent.editSettings.mode === 'Batch' && content && (e.name === 'batchDelete' || e.name === 'batchAdd' ||
                e.name === 'batchCancel' || (e.args && (e.args.requestType === 'batchsave')))) ||
                (e.args && (e.args.requestType === 'delete' || e.args.requestType === 'save')))) {
                var matrixcs = _this.header.matrix.matrix;
                var hdrLen = _this.parent.headerModule.rows.length;
                matrixcs.splice(hdrLen, matrixcs.length - hdrLen);
            }
            var matrix = cFocus.matrix.generate(updateRow, cFocus.selector, isRowTemplate);
            cFocus.matrix.generate(rows, cFocus.selector, isRowTemplate);
            if (!(_this.parent.isFrozenGrid() && (e.args && (e.args.requestType === 'sorting'
                || e.args.requestType === 'batchsave' || e.args.requestType === 'paging'))) ||
                (frozenRow && _this.parent.editSettings.mode === 'Batch' && content && (e.name === 'batchDelete' || e.name === 'batchAdd' ||
                    e.name === 'batchCancel' || e.args.requestType === 'batchsave'
                    || e.name === 'batchAdd' || e.name === 'batchCancel'))) {
                cFocus.generateRows(updateRow, {
                    matrix: matrix, handlerInstance: _this.header
                });
            }
            if (!Browser.isDevice && e && e.args) {
                if (!_this.focusByClick && e.args.requestType === 'paging' && !_this.parent.pagerModule.pagerObj.checkPagerHasFocus()) {
                    _this.skipFocus = false;
                    _this.parent.element.focus();
                }
                if (e.args.requestType === 'grouping') {
                    _this.skipFocus = true;
                }
            }
            if (e && e.args && e.args.requestType === 'virtualscroll') {
                if (_this.currentInfo.uid) {
                    var index_1;
                    var bool = e.rows.some(function (row, i) {
                        index_1 = i;
                        return row.uid === _this.currentInfo.uid;
                    });
                    if (bool) {
                        _this.content.matrix.current[0] = index_1;
                        _this.content.matrix.current[1] = _this.parent.getColumnIndexByUid(_this.focusedColumnUid) || 0;
                        var focusElement = _this.getContent().getFocusInfo().elementToFocus;
                        if (focusElement) {
                            var cellPosition = focusElement.getBoundingClientRect();
                            var gridPosition = _this.parent.element.getBoundingClientRect();
                            if (cellPosition.top >= 0 && cellPosition.left >= 0 &&
                                cellPosition.right <= Math.min(gridPosition.right, window.innerWidth ||
                                    document.documentElement.clientWidth) &&
                                cellPosition.bottom <= Math.min(gridPosition.bottom, window.innerHeight ||
                                    document.documentElement.clientHeight)) {
                                _this.isVirtualScroll = true;
                                _this.focus();
                            }
                        }
                    }
                }
                else if (e.args.focusElement && e.args.focusElement.classList.contains('e-filtertext')) {
                    var focusElement = _this.parent.element.querySelector('#' + e.args.focusElement.id);
                    if (focusElement) {
                        focusElement.focus();
                    }
                }
            }
            if (e && e.args && e.args.requestType === 'infiniteScroll') {
                _this.isInfiniteScroll = true;
            }
        };
    };
    FocusStrategy.prototype.addEventListener = function () {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        EventHandler.add(this.parent.element, 'mousedown', this.focusCheck, this);
        EventHandler.add(this.parent.element, 'touchstart', this.focusCheck, this);
        EventHandler.add(this.parent.element, 'focus', this.onFocus, this);
        this.parent.element.addEventListener('focus', this.passiveHandler = function (e) { return _this.passiveFocus(e); }, true);
        EventHandler.add(this.parent.element, 'focusout', this.onBlur, this);
        this.evtHandlers = [{ event: event.keyPressed, handler: this.onKeyPress },
            { event: event.click, handler: this.onClick },
            { event: event.contentReady, handler: this.refMatrix },
            { event: event.partialRefresh, handler: this.refMatrix },
            { event: event.refreshExpandandCollapse, handler: this.refMatrix },
            { event: event.headerRefreshed, handler: this.refreshMatrix() },
            { event: event.closeEdit, handler: this.restoreFocus },
            { event: event.restoreFocus, handler: this.restoreFocus },
            { event: 'start-edit', handler: this.clearIndicator },
            { event: 'start-add', handler: this.clearIndicator },
            { event: 'sorting-complete', handler: this.restoreFocus },
            { event: 'filtering-complete', handler: this.filterfocus },
            { event: 'grouping-complete', handler: this.restoreFocusWithAction },
            { event: 'ungrouping-complete', handler: this.restoreFocusWithAction },
            { event: event.batchAdd, handler: this.refMatrix },
            { event: event.batchCancel, handler: this.refMatrix },
            { event: event.batchDelete, handler: this.refMatrix },
            { event: event.detailDataBound, handler: this.refMatrix },
            { event: event.onEmpty, handler: this.refMatrix },
            { event: event.cellFocused, handler: this.internalCellFocus }];
        addRemoveEventListener(this.parent, this.evtHandlers, true, this);
    };
    FocusStrategy.prototype.filterfocus = function () {
        if (this.parent.filterSettings.type !== 'FilterBar') {
            this.restoreFocus();
        }
    };
    FocusStrategy.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        EventHandler.remove(this.parent.element, 'mousedown', this.focusCheck);
        EventHandler.remove(this.parent.element, 'touchstart', this.focusCheck);
        EventHandler.remove(this.parent.element, 'focus', this.onFocus);
        EventHandler.remove(this.parent.element, 'focusout', this.onBlur);
        this.parent.element.removeEventListener('focus', this.passiveHandler, true);
        addRemoveEventListener(this.parent, this.evtHandlers, false);
    };
    FocusStrategy.prototype.destroy = function () {
        this.removeEventListener();
    };
    FocusStrategy.prototype.restoreFocus = function () {
        var groupModule = this.parent.groupModule;
        if (this.parent.allowGrouping && groupModule && (groupModule.groupSortFocus || groupModule.groupTextFocus)) {
            groupModule.groupSortFocus = false;
            groupModule.groupTextFocus = false;
            return;
        }
        this.firstHeaderCellClick = true;
        this.addFocus(this.getContent().getFocusInfo());
    };
    FocusStrategy.prototype.restoreFocusWithAction = function (e) {
        if (!this.parent.enableInfiniteScrolling) {
            var matrix = this.getContent().matrix;
            var current = matrix.current;
            switch (e.requestType) {
                case 'grouping':
                case 'ungrouping':
                    current[1] = current.length &&
                        !this.parent.groupSettings.showGroupedColumn && !isNullOrUndefined(matrix.matrix[current[0]]) ?
                        matrix.matrix[current[0]].indexOf(1) : e.requestType === 'grouping' ? current[1] + 1 : current[1] - 1;
                    break;
            }
            this.getContent().matrix.current = current;
            var groupModule = this.parent.groupModule;
            if (this.parent.allowGrouping && groupModule && groupModule.groupCancelFocus) {
                var focusableGroupedItems = groupModule.getFocusableGroupedItems();
                if (focusableGroupedItems.length) {
                    if (focusableGroupedItems[0].parentElement.getAttribute('ej-mappingname') === e.columnName) {
                        focusableGroupedItems[3].focus();
                    }
                    else {
                        focusableGroupedItems[0].focus();
                    }
                }
                else {
                    groupModule.element.focus();
                }
                groupModule.groupCancelFocus = false;
                return;
            }
            this.addFocus(this.getContent().getFocusInfo());
        }
    };
    FocusStrategy.prototype.clearOutline = function () {
        this.getContent().matrix.current = this.getContent().matrix.get(0, -1, [0, 1], 'downArrow', this.getContent().validator());
        this.clearIndicator();
    };
    FocusStrategy.prototype.clearIndicator = function () {
        if (!this.currentInfo.element || !this.currentInfo.elementToFocus) {
            return;
        }
        removeClass([this.currentInfo.element, this.currentInfo.elementToFocus], ['e-focus', 'e-focused']);
    };
    FocusStrategy.prototype.getPrevIndexes = function () {
        var forget = this.forget;
        this.forget = false;
        return forget || !Object.keys(this.prevIndexes).length ? { rowIndex: null, cellIndex: null } : this.prevIndexes;
    };
    FocusStrategy.prototype.forgetPrevious = function () {
        this.forget = true;
    };
    FocusStrategy.prototype.setActiveByKey = function (action, active) {
        if (this.parent.frozenRows === 0) {
            return;
        }
        // eslint-disable-next-line prefer-const
        var info;
        var actions = {
            'home': function () { return ({ toHeader: !info.isContent, toFrozen: true }); },
            'end': function () { return ({ toHeader: !info.isContent, toFrozen: false }); },
            'ctrlHome': function () { return ({ toHeader: true, toFrozen: false }); },
            'ctrlEnd': function () { return ({ toHeader: false, toFrozen: false }); }
        };
        if (!(action in actions)) {
            return;
        }
        info = active.getInfo();
        var swap = actions["" + action]();
        this.setActive(!swap.toHeader);
        this.getContent().matrix.current = active.matrix.current;
    };
    FocusStrategy.prototype.internalCellFocus = function (e) {
        if (!(e.byKey && e.container.isContent && e.keyArgs.action === 'enter'
            && (e.parent.classList.contains('e-detailcell') ||
                e.parent.classList.contains('e-unboundcell')))) {
            return;
        }
        this.clearIndicator();
        var focusEle = this.getContent().getFocusable(this.getFocusedElement());
        this.setFocusedElement(focusEle);
        this.currentInfo.skipAction = true;
    };
    return FocusStrategy;
}());
export { FocusStrategy };
/**
 * Create matrix from row collection which act as mental model for cell navigation
 *
 * @hidden
 */
var Matrix = /** @class */ (function () {
    function Matrix() {
        this.matrix = [];
        this.current = [];
    }
    Matrix.prototype.set = function (rowIndex, columnIndex, allow) {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.columns));
        this.matrix[parseInt(rowIndex.toString(), 10)] = this.matrix[parseInt(rowIndex.toString(), 10)] || [];
        this.matrix[parseInt(rowIndex.toString(), 10)][parseInt(columnIndex.toString(), 10)] = allow ? 1 : 0;
    };
    Matrix.prototype.get = function (rowIndex, columnIndex, navigator, action, validator) {
        var tmp = columnIndex;
        if (rowIndex + navigator[0] < 0) {
            return [rowIndex, columnIndex];
        }
        rowIndex = Math.max(0, Math.min(rowIndex + navigator[0], this.rows));
        var emptyTable = true;
        if (isNullOrUndefined(this.matrix[parseInt(rowIndex.toString(), 10)])) {
            return null;
        }
        columnIndex = Math.max(0, Math.min(columnIndex + navigator[1], this.matrix[parseInt(rowIndex.toString(), 10)].length - 1));
        if (tmp + navigator[1] > this.matrix[parseInt(rowIndex.toString(), 10)].length - 1
            && validator(rowIndex, columnIndex, action)) {
            return [rowIndex, tmp];
        }
        var first = this.first(this.matrix[parseInt(rowIndex.toString(), 10)], columnIndex, navigator, true, action);
        columnIndex = first === null ? tmp : first;
        var val = getValue(rowIndex + "." + columnIndex, this.matrix);
        if (rowIndex === this.rows && (action === 'downArrow' || action === 'enter')) {
            navigator[0] = -1;
        }
        if (first === null) {
            for (var i = 0; i < this.rows; i++) {
                if (this.matrix[parseInt(i.toString(), 10)].some(function (v) { return v === 1; })) {
                    emptyTable = false;
                    break;
                }
            }
            if (emptyTable) {
                rowIndex = this.current.length ? this.current[0] : 0;
                return [rowIndex, columnIndex];
            }
        }
        return this.inValid(val) || !validator(rowIndex, columnIndex, action) ?
            this.get(rowIndex, tmp, navigator, action, validator) : [rowIndex, columnIndex];
    };
    Matrix.prototype.first = function (vector, index, navigator, moveTo, action) {
        if (((index < 0 || index === vector.length) && this.inValid(vector[parseInt(index.toString(), 10)])
            && (action !== 'upArrow' && action !== 'downArrow')) || !vector.some(function (v) { return v === 1; })) {
            return null;
        }
        return !this.inValid(vector[parseInt(index.toString(), 10)]) ? index :
            this.first(vector, (['upArrow', 'downArrow', 'shiftUp', 'shiftDown'].indexOf(action) !== -1) ? moveTo ? 0 : ++index : index + navigator[1], navigator, false, action);
    };
    Matrix.prototype.select = function (rowIndex, columnIndex) {
        rowIndex = Math.max(0, Math.min(rowIndex, this.rows));
        columnIndex = Math.max(0, Math.min(columnIndex, this.matrix[parseInt(rowIndex.toString(), 10)].length - 1));
        this.current = [rowIndex, columnIndex];
    };
    Matrix.prototype.generate = function (rows, selector, isRowTemplate) {
        this.rows = rows.length - 1;
        this.matrix = [];
        for (var i = 0; i < rows.length; i++) {
            var cells = rows[parseInt(i.toString(), 10)].cells.filter(function (c) { return c.isSpanned !== true; });
            this.columns = Math.max(cells.length - 1, this.columns | 0);
            var incrementNumber = 0;
            for (var j = 0; j < cells.length; j++) {
                if (cells[parseInt(j.toString(), 10)].column && cells[parseInt(j.toString(), 10)].column.columns) {
                    incrementNumber = this.columnsCount(cells[parseInt(j.toString(), 10)].column.columns, incrementNumber);
                }
                else {
                    incrementNumber++;
                }
                this.set(i, j, rows[parseInt(i.toString(), 10)].visible === false ?
                    false : selector(rows[parseInt(i.toString(), 10)], cells[parseInt(j.toString(), 10)], isRowTemplate));
            }
            this.columns = Math.max(incrementNumber - 1, this.columns | 0);
        }
        return this.matrix;
    };
    Matrix.prototype.columnsCount = function (rowColumns, currentColumnCount) {
        var columns = rowColumns;
        var incrementNumber = currentColumnCount;
        for (var i = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                incrementNumber = this.columnsCount(columns[parseInt(i.toString(), 10)].columns, incrementNumber);
            }
            else {
                incrementNumber++;
            }
        }
        return incrementNumber;
    };
    Matrix.prototype.inValid = function (value) {
        return value === 0 || value === undefined;
    };
    return Matrix;
}());
export { Matrix };
/**
 * @hidden
 */
var ContentFocus = /** @class */ (function () {
    function ContentFocus(parent) {
        var _this = this;
        this.matrix = new Matrix();
        this.lastIdxCell = false;
        this.parent = parent;
        this.keyActions = {
            'rightArrow': [0, 1],
            'tab': [0, 1],
            'leftArrow': [0, -1],
            'shiftTab': [0, -1],
            'upArrow': [-1, 0],
            'downArrow': [1, 0],
            'shiftUp': [-1, 0],
            'shiftDown': [1, 0],
            'shiftRight': [0, 1],
            'shiftLeft': [0, -1],
            'enter': [1, 0],
            'shiftEnter': [-1, 0]
        };
        this.indexesByKey = function (action) {
            var opt = {
                'home': [_this.matrix.current[0], -1, 0, 1],
                'end': [_this.matrix.current[0], _this.matrix.columns + 1, 0, -1],
                'ctrlHome': [0, -1, 0, 1],
                'ctrlEnd': [_this.matrix.rows, _this.matrix.columns + 1, 0, -1]
            };
            return opt["" + action] || null;
        };
    }
    ContentFocus.prototype.getTable = function () {
        return (this.parent.getContentTable());
    };
    ContentFocus.prototype.onKeyPress = function (e) {
        var isMacLike = /(Mac)/i.test(navigator.platform);
        if (isMacLike && e.metaKey) {
            if (e.action === 'home') {
                e.action = 'ctrlHome';
            }
            else if (e.action === 'end') {
                e.action = 'ctrlEnd';
            }
            else if (['downArrow', 'upArrow', 'leftArrow', 'rightArrow'].indexOf(e.action) !== -1) {
                return;
            }
        }
        var navigators = this.keyActions[e.action];
        var current = this.getCurrentFromAction(e.action, navigators, e.action in this.keyActions, e);
        if (!current) {
            return;
        }
        if (((['tab', 'shiftTab'].indexOf(e.action) > -1 && this.matrix.current || []).toString() === current.toString())
            || (this.parent.allowPaging && !this.parent.pagerModule.pagerObj.checkPagerHasFocus()
                && this.matrix.current[0] === this.matrix.rows && ((this.parent.editSettings.mode === 'Batch'
                && this.parent.editSettings.allowAdding && e.keyCode === 40) || (e.keyCode === 40)))) {
            if (current.toString() === [this.matrix.rows, this.matrix.columns].toString() ||
                current.toString() === [0, 0].toString() || (this.matrix.current[0] === this.matrix.rows &&
                this.matrix.current.toString() === current.toString()) || (this.parent.allowGrouping &&
                this.parent.infiniteScrollSettings.enableCache && current.toString() === [0, 1].toString())) {
                return false;
            }
            else {
                current = this.editNextRow(current[0], current[1], e.action);
            }
        }
        this.matrix.select(current[0], current[1]);
    };
    ContentFocus.prototype.editNextRow = function (rowIndex, cellIndex, action) {
        var gObj = this.parent;
        var editNextRow = gObj.editSettings.allowNextRowEdit && (gObj.isEdit || gObj.isLastCellPrimaryKey);
        var visibleIndex = gObj.getColumnIndexByField(gObj.getVisibleColumns()[0].field);
        var cell = this.getTable().rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)];
        if (action === 'tab' && editNextRow) {
            rowIndex++;
            var index = (this.getTable().rows[parseInt(rowIndex.toString(), 10)].getElementsByClassName('e-indentcell').length +
                this.getTable().rows[parseInt(rowIndex.toString(), 10)].getElementsByClassName('e-detailrowcollapse').length);
            cellIndex = visibleIndex + index;
        }
        if (action === 'shiftTab' && editNextRow) {
            rowIndex--;
            cellIndex = gObj.getColumnIndexByField(gObj.getVisibleColumns()[gObj.getVisibleColumns().length - 1].field);
        }
        return !cell.classList.contains(literals.rowCell) && !cell.classList.contains('e-headercell') &&
            !cell.classList.contains('e-groupcaption') && !cell.classList.contains('e-filterbarcell') ?
            this.editNextRow(rowIndex, cellIndex, action) : [rowIndex, cellIndex];
    };
    ContentFocus.prototype.getCurrentFromAction = function (action, navigator, isPresent, e) {
        if (navigator === void 0) { navigator = [0, 0]; }
        if (!isPresent && !this.indexesByKey(action) || (this.matrix.current.length === 0)) {
            return null;
        }
        if (!this.shouldFocusChange(e)) {
            return this.matrix.current;
        }
        // eslint-disable-next-line
        var _a = this.indexesByKey(action) || this.matrix.current.concat(navigator), rowIndex = _a[0], cellIndex = _a[1], rN = _a[2], cN = _a[3];
        if (this.parent.allowGrouping && this.parent.groupSettings.columns.length && this.parent.aggregates.length && action === 'enter') {
            for (var i = rowIndex; i < this.matrix.matrix.length; i++) {
                var row = this.getTable().rows[i + 1];
                if (row && row.cells[parseInt(cellIndex.toString(), 10)] && row.cells[parseInt(cellIndex.toString(), 10)].classList.contains('e-rowcell')) {
                    return [i + 1, cellIndex];
                }
                if (i === this.matrix.matrix.length - 1) {
                    return [rowIndex, cellIndex];
                }
            }
        }
        if (action === 'ctrlEnd' || action === 'end') {
            var lastContentCellIndex = [this.matrix.matrix.length - 1,
                this.matrix.matrix[this.matrix.matrix.length - 1].length - 1];
            if (action === 'end') {
                lastContentCellIndex = [rowIndex, this.matrix.matrix[parseInt(rowIndex.toString(), 10)].length - 1];
            }
            if (this.matrix.matrix[lastContentCellIndex[0]][lastContentCellIndex[1]] === 0) {
                lastContentCellIndex = findCellIndex(this.matrix.matrix, lastContentCellIndex, false);
            }
            rowIndex = lastContentCellIndex[0];
            cellIndex = lastContentCellIndex[1] + 1;
        }
        var current = this.matrix.get(rowIndex, cellIndex, [rN, cN], action, this.validator());
        return current;
    };
    ContentFocus.prototype.onClick = function (e, force) {
        var target = e.target;
        this.target = target;
        target = (target.classList.contains(literals.rowCell) ? target : closest(target, 'td'));
        target = target ? target : closest(e.target, 'td.e-detailrowcollapse')
            || closest(e.target, 'td.e-detailrowexpand');
        target = closest(e.target, 'td.e-detailcell') ?
            isNullOrUndefined(closest(closest(e.target, '.e-grid'), 'td.e-detailcell')) ? null : target : target;
        target = target && closest(target, 'table').classList.contains(literals.table) ? target : null;
        if (!target) {
            return false;
        }
        var _a = [target.parentElement.rowIndex, target.cellIndex], rowIndex = _a[0], cellIndex = _a[1];
        var _b = this.matrix.current, oRowIndex = _b[0], oCellIndex = _b[1];
        var val = getValue(rowIndex + "." + cellIndex, this.matrix.matrix);
        if (this.matrix.inValid(val) || (!force && oRowIndex === rowIndex && oCellIndex === cellIndex) ||
            (!parentsUntil(e.target, literals.rowCell) && !parentsUntil(e.target, 'e-groupcaption')
                && !parentsUntil(e.target, 'e-recordpluscollapse') && !parentsUntil(e.target, 'e-recordplusexpand')
                && !parentsUntil(e.target, 'e-detailrowcollapse') && !parentsUntil(e.target, 'e-detailrowexpand')
                && !parentsUntil(e.target, 'e-templatecell'))) {
            return false;
        }
        this.matrix.select(rowIndex, cellIndex);
    };
    ContentFocus.prototype.getFocusInfo = function () {
        var info = {};
        var _a = this.matrix.current, _b = _a[0], rowIndex = _b === void 0 ? 0 : _b, _c = _a[1], cellIndex = _c === void 0 ? 0 : _c;
        this.matrix.current = [rowIndex, cellIndex];
        info.element = !isNullOrUndefined(this.getTable().rows[parseInt(rowIndex.toString(), 10)]) ?
            this.getTable().rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)] : null;
        if (!info.element) {
            return info;
        }
        info.elementToFocus = !info.element.classList.contains('e-unboundcell') && !info.element.classList.contains('e-detailcell')
            ? this.getFocusable(info.element) : info.element;
        info.elementToFocus = info.element.classList.contains('e-detailcell') && info.element.querySelector('.e-childgrid')
            ? info.element.querySelector('.e-childgrid') : info.elementToFocus;
        info.outline = true;
        info.uid = info.element.parentElement.getAttribute('data-uid');
        return info;
    };
    ContentFocus.prototype.getFocusable = function (element) {
        var query = 'button, [href], input:not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])';
        var isTemplate = !isNullOrUndefined(closest(element, '.e-templatecell'));
        if (this.parent.isEdit) {
            query = 'input:not([type="hidden"]), select:not([aria-hidden="true"]), textarea';
        }
        var child = [].slice.call(element.querySelectorAll(query));
        /* Select the first focusable child element
         * if no child found then select the cell itself.
         * if Grid is in editable state, check for editable control inside child.
         */
        return child.length ? isTemplate && child.length > 1 ? this.target ? this.target : element : child[0] : element;
    };
    ContentFocus.prototype.selector = function (row, cell, isRowTemplate) {
        var types = [CellType.Expand, CellType.GroupCaption, CellType.CaptionSummary, CellType.GroupSummary];
        return ((row.isDataRow && cell.visible && (cell.isDataCell || cell.isTemplate))
            || (row.isDataRow && cell.cellType === CellType.DetailExpand && isNullOrUndefined(cell.visible))
            || (!row.isDataRow && types.indexOf(cell.cellType) > -1
                && !((cell.cellType === CellType.GroupSummary || cell.cellType === CellType.CaptionSummary)
                    && !(cell.isDataCell && cell.visible)))
            || (cell.column && cell.visible && cell.column.type === 'checkbox')
            || (cell.cellType === CellType.CommandColumn)
            || (row.isDataRow && isRowTemplate))
            && !(row.edit === 'delete' && row.isDirty);
    };
    ContentFocus.prototype.nextRowFocusValidate = function (index) {
        var lastIndex = index;
        for (var i = index, len = this.matrix.rows; i <= len; i++) {
            if (this.matrix.matrix[parseInt(index.toString(), 10)].indexOf(1) === -1) {
                index = index + 1;
            }
            else {
                return index;
            }
        }
        this.lastIdxCell = true;
        return lastIndex;
    };
    ContentFocus.prototype.previousRowFocusValidate = function (index) {
        var firstIndex = index;
        for (var i = index, len = 0; i >= len; i--) {
            if (this.matrix.matrix[parseInt(index.toString(), 10)].indexOf(1) === -1) {
                index = index - 1;
                if (index < 0) {
                    this.lastIdxCell = true;
                    return firstIndex;
                }
            }
            else {
                return index;
            }
        }
        return firstIndex;
    };
    ContentFocus.prototype.jump = function (action, current) {
        this.lastIdxCell = false;
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'shiftEnter';
        var headerSwap = (action === 'upArrow' || enterFrozen) && current[0] === 0;
        if (action === 'tab' && this.matrix.matrix.length &&
            current[1] === this.matrix.matrix[current[0]].lastIndexOf(1) && this.matrix.matrix.length - 1 !== current[0]) {
            this.matrix.current[0] = this.nextRowFocusValidate(this.matrix.current[0] + 1);
            this.matrix.current[1] = -1;
        }
        if (action === 'shiftTab' &&
            current[0] !== 0 && this.matrix.matrix[current[0]].indexOf(1) === current[1]) {
            this.matrix.current[0] = this.previousRowFocusValidate(this.matrix.current[0] - 1);
            this.matrix.current[1] = this.matrix.matrix[current[0]].length;
        }
        var isHeaderFocus = false;
        var row = document.activeElement.parentElement;
        if ((this.parent.enableVirtualization || this.parent.infiniteScrollSettings.enableCache)
            && row.classList.contains(literals.row)) {
            var rowIndex = parseInt(row.getAttribute(literals.dataRowIndex), 10);
            isHeaderFocus = rowIndex > 0;
        }
        var info = {
            swap: !isHeaderFocus ? ((action === 'upArrow' || enterFrozen) && current[0] === 0) : false,
            toHeader: headerSwap
        };
        return info;
    };
    ContentFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current = [];
        if (action === 'rightArrow' || action === 'tab') {
            current[0] = previous[0];
            current[1] = -1;
        }
        if (action === 'downArrow' || action === 'enter') {
            current[0] = -1;
            current[1] = previous[1];
        }
        return current;
    };
    ContentFocus.prototype.generateRows = function (rows, optionals) {
        var _a;
        var matrix = optionals.matrix, handlerInstance = optionals.handlerInstance;
        var len = handlerInstance.matrix.matrix.length;
        var defaultLen = this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar' ? len + 1 : len;
        handlerInstance.matrix.matrix = handlerInstance.matrix.matrix.slice(0, defaultLen); //Header matrix update.
        handlerInstance.matrix.rows = defaultLen;
        (_a = handlerInstance.matrix.matrix).push.apply(_a, matrix);
        handlerInstance.matrix.rows += matrix.length;
    };
    ContentFocus.prototype.getInfo = function (e) {
        var info = this.getFocusInfo();
        var _a = this.matrix.current, rIndex = _a[0], cIndex = _a[1];
        var isData = info.element.classList.contains(literals.rowCell);
        var isSelectable = isData || (e && e.action !== 'enter' && (info.element.classList.contains('e-detailrowcollapse')
            || info.element.classList.contains('e-detailrowexpand')));
        // eslint-disable-next-line
        var _b = [Math.min(parseInt(info.element.parentElement.getAttribute(literals.dataRowIndex), 10), rIndex),
            Math.min(parseInt(info.element.getAttribute(literals.dataColIndex), 10), cIndex)], rowIndex = _b[0], cellIndex = _b[1];
        if (this.parent.allowGrouping && this.parent.groupSettings.enableLazyLoading && isData) {
            rowIndex = this.parent.getDataRows().indexOf(info.element.parentElement);
        }
        return { isContent: true, isDataCell: isData, indexes: [rowIndex, cellIndex], isSelectable: isSelectable };
    };
    ContentFocus.prototype.validator = function () {
        var table = this.getTable();
        return function (rowIndex, cellIndex, action) {
            if (!isNullOrUndefined(table.rows[parseInt(rowIndex.toString(), 10)])) {
                var cell = void 0;
                cellIndex = table.querySelector('.e-emptyrow') ? 0 : cellIndex;
                if (table.rows[parseInt(rowIndex.toString(), 10)].cells[0].classList.contains('e-editcell')) {
                    cell = table.rows[parseInt(rowIndex.toString(), 10)].cells[0].querySelectorAll('td')[parseInt(cellIndex.toString(), 10)];
                }
                else {
                    cell = table.rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)];
                }
                var isCellWidth = cell.getBoundingClientRect().width !== 0;
                if (action === 'enter' || action === 'shiftEnter') {
                    return isCellWidth && cell.classList.contains(literals.rowCell);
                }
                if ((action === 'shiftUp' || action === 'shiftDown') && cell.classList.contains(literals.rowCell)) {
                    return isCellWidth;
                }
                else if (action !== 'shiftUp' && action !== 'shiftDown') {
                    return isCellWidth;
                }
            }
            return false;
        };
    };
    ContentFocus.prototype.shouldFocusChange = function (e) {
        var _a = this.matrix.current, _b = _a[0], rIndex = _b === void 0 ? -1 : _b, _c = _a[1], cIndex = _c === void 0 ? -1 : _c;
        if (rIndex < 0 || cIndex < 0) {
            return true;
        }
        var cell = getValue(rIndex + ".cells." + cIndex, this.getTable().rows);
        if (!cell) {
            return true;
        }
        return e.action === 'enter' || e.action === 'shiftEnter' ?
            cell.classList.contains(literals.rowCell) && !cell.classList.contains('e-unboundcell')
                || cell.classList.contains('e-editedbatchcell') && !cell.classList.contains('e-detailcell') : true;
    };
    ContentFocus.prototype.getGridSeletion = function () {
        return this.parent.allowSelection && this.parent.selectionSettings.allowColumnSelection;
    };
    return ContentFocus;
}());
export { ContentFocus };
/**
 * @hidden
 */
var HeaderFocus = /** @class */ (function (_super) {
    __extends(HeaderFocus, _super);
    function HeaderFocus(parent) {
        return _super.call(this, parent) || this;
    }
    HeaderFocus.prototype.getTable = function () {
        return (this.parent.getHeaderTable());
    };
    HeaderFocus.prototype.onClick = function (e) {
        var target = e.target;
        this.target = target;
        target = (target.classList.contains('e-headercell') ? target : closest(target, 'th'));
        if (!target && this.parent.frozenRows !== 0) {
            target = (e.target.classList.contains(literals.rowCell) ? e.target :
                closest(e.target, 'td'));
        }
        if (e.target.classList.contains('e-columnheader') ||
            e.target.querySelector('.e-stackedheadercell')) {
            return false;
        }
        if (!target) {
            return;
        }
        var _a = [target.parentElement.rowIndex, target.cellIndex], rowIndex = _a[0], cellIndex = _a[1];
        var val = getValue(rowIndex + "." + cellIndex, this.matrix.matrix);
        if (this.matrix.inValid(val)) {
            return false;
        }
        this.matrix.select(target.parentElement.rowIndex, target.cellIndex);
    };
    HeaderFocus.prototype.getFocusInfo = function () {
        var info = {};
        var _a = this.matrix.current, _b = _a[0], rowIndex = _b === void 0 ? 0 : _b, _c = _a[1], cellIndex = _c === void 0 ? 0 : _c;
        info.element = this.getTable().rows[parseInt(rowIndex.toString(), 10)].cells[parseInt(cellIndex.toString(), 10)];
        if (!isNullOrUndefined(info.element)) {
            info.elementToFocus = this.getFocusable(info.element);
            info.outline = !info.element.classList.contains('e-filterbarcell');
        }
        return info;
    };
    HeaderFocus.prototype.selector = function (row, cell) {
        return (cell.visible && (cell.column.field !== undefined || cell.isTemplate || !isNullOrUndefined(cell.column.template)
            || !isNullOrUndefined(cell.column.commands))) || cell.column.type === 'checkbox' || cell.cellType === CellType.StackedHeader;
    };
    HeaderFocus.prototype.jump = function (action, current) {
        var enterFrozen = this.parent.frozenRows !== 0 && action === 'enter';
        var isLastCell;
        var lastRow;
        if (this.parent.enableHeaderFocus && action === 'tab') {
            lastRow = this.matrix.matrix.length - 1 === current[0];
            isLastCell = current[1] === this.matrix.matrix[current[0]].lastIndexOf(1);
            if (isLastCell) {
                if (!lastRow) {
                    this.matrix.current[0] = this.matrix.current[0] + 1;
                }
                else {
                    this.matrix.current[0] = 0;
                }
                this.matrix.current[1] = -1;
            }
        }
        return {
            swap: ((action === 'downArrow' || enterFrozen) && current[0] === this.matrix.matrix.length - 1) ||
                (action === 'tab' && lastRow && isLastCell)
        };
    };
    HeaderFocus.prototype.getNextCurrent = function (previous, swap, active, action) {
        if (previous === void 0) { previous = []; }
        var current1 = [];
        if (action === 'rightArrow' || (action === 'shiftRight' && this.getGridSeletion()) || action === 'tab') {
            current1[0] = previous[0];
            current1[1] = -1;
        }
        if (action === 'upArrow' || action === 'shiftEnter') {
            current1[0] = this.matrix.matrix.length;
            current1[1] = previous[1];
        }
        return current1;
    };
    HeaderFocus.prototype.generateRows = function (rows) {
        var length = this.matrix.matrix.length;
        if (this.parent.allowFiltering && this.parent.filterSettings.type === 'FilterBar') {
            this.matrix.rows = ++this.matrix.rows;
            var cells = rows[0].cells;
            var incrementNumber = 0;
            for (var i = 0; i < cells.length; i++) {
                if (cells[parseInt(i.toString(), 10)].column && cells[parseInt(i.toString(), 10)].column.columns) {
                    incrementNumber = this.checkFilterColumn(cells[parseInt(i.toString(), 10)].column.columns, length, incrementNumber);
                }
                else {
                    this.matrix.set(length, incrementNumber, cells[parseInt(i.toString(), 10)].visible && cells[parseInt(i.toString(), 10)].column.allowFiltering !== false);
                    incrementNumber++;
                }
            }
        }
    };
    HeaderFocus.prototype.checkFilterColumn = function (rowColumns, rowIndex, columnIndex) {
        var columns = rowColumns;
        var incrementNumber = columnIndex;
        for (var i = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                incrementNumber = this.checkFilterColumn(columns[parseInt(i.toString(), 10)].columns, rowIndex, incrementNumber);
            }
            else {
                this.matrix.set(rowIndex, incrementNumber, columns[parseInt(i.toString(), 10)].visible && columns[parseInt(i.toString(), 10)].allowFiltering !== false);
                incrementNumber++;
            }
        }
        return incrementNumber;
    };
    HeaderFocus.prototype.getInfo = function (e) {
        return extend(_super.prototype.getInfo.call(this, e), { isContent: false, isHeader: true });
    };
    HeaderFocus.prototype.validator = function () {
        return function () { return true; };
    };
    HeaderFocus.prototype.shouldFocusChange = function (e) {
        var _a = this.matrix.current, rowIndex = _a[0], columnIndex = _a[1];
        if (rowIndex < 0 || columnIndex < 0) {
            return true;
        }
        var cell = getValue(rowIndex + ".cells." + columnIndex, this.getTable().rows);
        if (!cell) {
            return true;
        }
        return e.action === 'enter' || e.action === 'altDownArrow' ? !cell.classList.contains('e-headercell') : true;
    };
    HeaderFocus.prototype.getHeaderType = function () {
        return 'HeaderFocus';
    };
    return HeaderFocus;
}(ContentFocus));
export { HeaderFocus };
/** @hidden */
var SearchBox = /** @class */ (function () {
    function SearchBox(searchBox) {
        this.searchBox = searchBox;
    }
    SearchBox.prototype.searchFocus = function (args) {
        args.target.parentElement.classList.add('e-input-focus');
        if (args.target.classList.contains('e-input') && args.target.classList.contains('e-search') && args.target.value) {
            var sIcon = args.target.parentElement.querySelector('.e-sicon');
            sIcon.classList.add('e-clear-icon');
            sIcon.setAttribute('title', 'Clear');
            (sIcon).style.cursor = 'pointer';
        }
    };
    SearchBox.prototype.searchBlur = function (args) {
        var relatedTarget = args.relatedTarget ? args.relatedTarget : null;
        if (relatedTarget && relatedTarget.classList.contains('e-sicon')) {
            if (relatedTarget.classList.contains('e-clear-icon')) {
                args.target.parentElement.classList.remove('e-input-focus');
            }
        }
        else {
            args.target.parentElement.classList.remove('e-input-focus');
        }
        if (args.target.classList.contains('e-search') && relatedTarget && !(relatedTarget.classList.contains('e-sicon e-clear-icon'))
            && !(relatedTarget.classList.contains('e-sicon'))) {
            var sIcon = args.target.parentElement.querySelector('.e-sicon');
            sIcon.classList.remove('e-clear-icon');
            sIcon.removeAttribute('title');
            sIcon.style.cursor = 'default';
        }
    };
    SearchBox.prototype.wireEvent = function () {
        if (this.searchBox) {
            EventHandler.add(this.searchBox, 'focus', this.searchFocus, this);
            EventHandler.add(this.searchBox, 'blur', this.searchBlur, this);
        }
    };
    SearchBox.prototype.unWireEvent = function () {
        if (this.searchBox) {
            EventHandler.remove(this.searchBox, 'focus', this.searchFocus);
            EventHandler.remove(this.searchBox, 'blur', this.searchBlur);
        }
    };
    return SearchBox;
}());
export { SearchBox };
