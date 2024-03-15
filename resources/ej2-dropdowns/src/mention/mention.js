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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { KeyboardEvents, compile, Property, EventHandler, Animation, formatUnit, append, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined, detach, Event, Complex, addClass, removeClass, closest, isUndefined, getValue, NotifyPropertyChanges, Browser } from '@syncfusion/ej2-base';
import { FieldSettings } from '../drop-down-base/drop-down-base';
import { DropDownBase, dropDownBaseClasses } from '../drop-down-base/drop-down-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { Popup, isCollide, createSpinner, showSpinner, hideSpinner, getZindexPartial } from '@syncfusion/ej2-popups';
import { highlightSearch, revertHighlightSearch } from '../common/highlight-search';
/**
 * The Mention component is used to list someone or something based on user input in textarea, input,
 * or any other editable element from which the user can select.
 */
var Mention = /** @class */ (function (_super) {
    __extends(Mention, _super);
    /**
     * * Constructor for creating the widget
     *
     * @param {MentionModel} options - Specifies the MentionComponent model.
     * @param {string | HTMLElement} element - Specifies the element to render as component.
     * @private
     */
    function Mention(options, element) {
        return _super.call(this, options, element) || this;
    }
    /**
     * When property value changes happened, then onPropertyChanged method will execute the respective changes in this component.
     *
     * @param {MentionModel} newProp - Returns the dynamic property value of the component.
     * @param {MentionModel} oldProp - Returns the previous property value of the component.
     * @private
     * @returns {void}
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Mention.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'minLength':
                    this.minLength = newProp.minLength;
                    break;
                case 'suffixText':
                    this.suffixText = newProp.suffixText;
                    break;
                case 'allowSpaces':
                    this.allowSpaces = newProp.allowSpaces;
                    break;
                case 'mentionChar':
                    this.mentionChar = newProp.mentionChar;
                    break;
                case 'showMentionChar':
                    this.showMentionChar = newProp.showMentionChar;
                    break;
                case 'cssClass':
                    this.updateCssClass(newProp.cssClass, oldProp.cssClass);
                    break;
            }
        }
    };
    Mention.prototype.updateCssClass = function (newClass, oldClass) {
        if (!isNullOrUndefined(oldClass)) {
            oldClass = (oldClass.replace(/\s+/g, ' ')).trim();
        }
        if (!isNullOrUndefined(newClass)) {
            newClass = (newClass.replace(/\s+/g, ' ')).trim();
        }
        this.setCssClass(newClass, [this.inputElement], oldClass);
        if (this.popupObj) {
            this.setCssClass(newClass, [this.popupObj.element], oldClass);
        }
    };
    Mention.prototype.setCssClass = function (cssClass, elements, oldClass) {
        if (!isNullOrUndefined(oldClass) && oldClass !== '') {
            removeClass(elements, oldClass.split(' '));
        }
        if (!isNullOrUndefined(cssClass) && cssClass !== '') {
            addClass(elements, cssClass.split(' '));
        }
    };
    Mention.prototype.initializeData = function () {
        this.isSelected = false;
        this.isFiltered = false;
        this.beforePopupOpen = false;
        this.initRemoteRender = false;
        this.isListResetted = false;
        this.isPopupOpen = false;
        this.isCollided = false;
        this.lineBreak = false;
        this.keyConfigure = {
            tab: 'tab',
            enter: '13',
            escape: '27',
            end: '35',
            home: '36',
            down: '40',
            up: '38',
            pageUp: '33',
            pageDown: '34',
            open: 'alt+40',
            close: 'shift+tab',
            hide: 'alt+38',
            space: '32'
        };
    };
    /**
     * Execute before render the list items
     *
     * @private
     * @returns {void}
     */
    Mention.prototype.preRender = function () {
        this.initializeData();
        _super.prototype.preRender.call(this);
    };
    /**
     * To Initialize the control rendering
     *
     * @private
     * @returns {void}
     */
    Mention.prototype.render = function () {
        var isSelector = typeof this.target === 'string';
        this.inputElement = !isNullOrUndefined(this.target) ?
            this.checkAndUpdateInternalComponent(isSelector
                ? document.querySelector(this.target)
                : this.target) : this.element;
        if (this.isContentEditable(this.inputElement)) {
            this.inputElement.setAttribute('contenteditable', 'true');
            addClass([this.inputElement], ['e-mention']);
            if (isNullOrUndefined(this.target)) {
                addClass([this.inputElement], ['e-editable-element']);
            }
        }
        this.inputElement.setAttribute('role', 'textbox');
        this.inputElement.setAttribute('aria-label', 'mention');
        this.queryString = this.elementValue();
        this.wireEvent();
    };
    Mention.prototype.wireEvent = function () {
        EventHandler.add(this.inputElement, 'keyup', this.onKeyUp, this);
        this.bindCommonEvent();
    };
    Mention.prototype.unWireEvent = function () {
        EventHandler.remove(this.inputElement, 'keyup', this.onKeyUp);
        this.unBindCommonEvent();
    };
    Mention.prototype.bindCommonEvent = function () {
        if (!Browser.isDevice) {
            this.keyboardModule = new KeyboardEvents(this.inputElement, {
                keyAction: this.keyActionHandler.bind(this), keyConfigs: this.keyConfigure, eventName: 'keydown'
            });
        }
    };
    /**
     * Hides the spinner loader.
     *
     * @private
     * @returns {void}
     */
    Mention.prototype.hideSpinner = function () {
        this.hideWaitingSpinner();
    };
    Mention.prototype.hideWaitingSpinner = function () {
        if (!isNullOrUndefined(this.spinnerElement)) {
            hideSpinner(this.spinnerElement);
        }
        if (!isNullOrUndefined(this.spinnerTemplate) && !isNullOrUndefined(this.spinnerTemplateElement)) {
            detach(this.spinnerTemplateElement);
        }
    };
    Mention.prototype.checkAndUpdateInternalComponent = function (targetElement) {
        if (!this.isVue && targetElement.classList.contains('e-richtexteditor')) {
            return targetElement.querySelector('.e-content');
        }
        if (this.isVue && targetElement.nodeName === 'TEXTAREA' && targetElement.classList.contains('e-rte-hidden')) {
            var parentElement = targetElement.parentElement;
            if (parentElement && parentElement.classList.contains('e-richtexteditor')) {
                return parentElement.querySelector('.e-content');
            }
        }
        return targetElement;
    };
    /**
     * Shows the spinner loader.
     *
     * @returns {void}
     */
    Mention.prototype.showWaitingSpinner = function () {
        if (!isNullOrUndefined(this.popupObj)) {
            if (isNullOrUndefined(this.spinnerTemplate) && isNullOrUndefined(this.spinnerElement)) {
                this.spinnerElement = this.popupObj.element;
                createSpinner({
                    target: this.spinnerElement,
                    width: Browser.isDevice ? '16px' : '14px'
                }, this.createElement);
                showSpinner(this.spinnerElement);
            }
            if (!isNullOrUndefined(this.spinnerTemplate)) {
                this.setSpinnerTemplate();
            }
        }
    };
    Mention.prototype.keyActionHandler = function (e) {
        var isNavigation = (e.action === 'down' || e.action === 'up' || e.action === 'pageUp' || e.action === 'pageDown'
            || e.action === 'home' || e.action === 'end');
        var isTabAction = e.action === 'tab' || e.action === 'close';
        if (this.list === undefined && !this.isRequested && !isTabAction && e.action !== 'escape' && e.action !== 'space') {
            this.renderList();
        }
        if (isNullOrUndefined(this.list) || (!isNullOrUndefined(this.liCollections) &&
            isNavigation && this.liCollections.length === 0) || this.isRequested) {
            return;
        }
        if (e.action === 'escape') {
            e.preventDefault();
        }
        this.isSelected = e.action === 'escape' ? false : this.isSelected;
        switch (e.action) {
            case 'down':
            case 'up':
                this.isUpDownKey = true;
                this.updateUpDownAction(e);
                break;
            case 'tab':
                if (this.isPopupOpen) {
                    e.preventDefault();
                    var li = this.list.querySelector('.' + dropDownBaseClasses.selected);
                    if (li) {
                        this.setSelection(li, e);
                    }
                    if (this.isPopupOpen) {
                        this.hidePopup(e);
                    }
                }
                break;
            case 'enter':
                if (this.isPopupOpen) {
                    e.preventDefault();
                    if (this.popupObj && this.popupObj.element.contains(this.selectedLI)) {
                        this.updateSelectedItem(this.selectedLI, e, false, true);
                    }
                }
                break;
            case 'escape':
                if (this.isPopupOpen) {
                    this.hidePopup(e);
                }
                break;
        }
    };
    Mention.prototype.updateUpDownAction = function (e) {
        var focusEle = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (this.isSelectFocusItem(focusEle)) {
            this.setSelection(focusEle, e);
        }
        else if (!isNullOrUndefined(this.liCollections)) {
            var li = this.list.querySelector('.' + dropDownBaseClasses.selected);
            if (!isNullOrUndefined(li)) {
                var value = this.getFormattedValue(li.getAttribute('data-value'));
                this.activeIndex = this.getIndexByValue(value);
            }
            var index = e.action === 'down' ? this.activeIndex + 1 : this.activeIndex - 1;
            var startIndex = 0;
            startIndex = e.action === 'down' && isNullOrUndefined(this.activeIndex) ? 0 : this.liCollections.length - 1;
            index = index < 0 ? this.liCollections.length - 1 : index === this.liCollections.length ? 0 : index;
            var nextItem = isNullOrUndefined(this.activeIndex) ?
                this.liCollections[startIndex] : this.liCollections[index];
            if (!isNullOrUndefined(nextItem)) {
                this.setSelection(nextItem, e);
            }
        }
        if (this.isPopupOpen) {
            e.preventDefault();
        }
    };
    Mention.prototype.isSelectFocusItem = function (element) {
        return !isNullOrUndefined(element);
    };
    Mention.prototype.unBindCommonEvent = function () {
        if (!Browser.isDevice) {
            this.keyboardModule.destroy();
        }
    };
    Mention.prototype.onKeyUp = function (e) {
        var rangetextContent;
        if (this.isUpDownKey && this.isPopupOpen && e.keyCode === 229) {
            this.isUpDownKey = false;
            return;
        }
        this.isTyped = e.code !== 'Enter' && e.code !== 'Space' && e.code !== 'ArrowDown' && e.code !== 'ArrowUp' ? true : false;
        if (document.activeElement != this.inputElement) {
            this.inputElement.focus();
        }
        if (this.isContentEditable(this.inputElement)) {
            this.range = this.getCurrentRange();
            rangetextContent = this.range.startContainer.textContent.split('');
        }
        var currentRange = this.getTextRange();
        var lastWordRange = this.getLastLetter(currentRange);
        // eslint-disable-next-line security/detect-non-literal-regexp
        var Regex = new RegExp(this.mentionChar.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g');
        var charRegex = new RegExp('[a-zA-Z]', 'g');
        if (e.key === 'Shift' || e.keyCode === 37 || e.keyCode === 39) {
            return;
        }
        if ((!currentRange || !lastWordRange) || e.code === 'Enter' || e.keyCode === 27 ||
            (lastWordRange.match(Regex) && lastWordRange.match(Regex).length > 1) ||
            (this.isContentEditable(this.inputElement) && this.range.startContainer &&
                this.range.startContainer.previousElementSibling && this.range.startContainer.textContent.split('').length > 0 &&
                (rangetextContent.length === 1 || rangetextContent[rangetextContent.length - 2].indexOf('') === -1 ||
                    this.range.startContainer.nodeType === 1))) {
            if (this.allowSpaces && currentRange && currentRange.trim() !== '' && charRegex.test(currentRange) && currentRange.indexOf(this.mentionChar) !== -1
                && !this.isMatchedText() && (currentRange.length > 1 && currentRange.replace(/\u00A0/g, ' ').charAt(currentRange.length - 2) !== ' ') &&
                (this.list && this.list.querySelectorAll('ul').length > 0)) {
                this.queryString = currentRange.substring(currentRange.lastIndexOf(this.mentionChar) + 1).replace('\u00a0', ' ');
                this.searchLists(e);
            }
            else if (this.isPopupOpen && (!this.allowSpaces || !lastWordRange) && (e.code !== 'ArrowDown' && e.code !== 'ArrowUp')) {
                this.hidePopup();
                this.lineBreak = true;
            }
            return;
        }
        this.queryString = lastWordRange.replace(this.mentionChar, '');
        if (this.mentionChar.charCodeAt(0) === lastWordRange.charCodeAt(0) &&
            this.queryString !== '' && e.keyCode !== 38 && e.keyCode !== 40 && !this.lineBreak) {
            this.searchLists(e);
            if (!this.isPopupOpen && this.queryString.length >= this.minLength) {
                if (!this.isContentEditable(this.inputElement)) {
                    this.showPopup();
                }
                else if (this.isContentEditable(this.inputElement) && this.range && this.range.startContainer !== this.inputElement && e.keyCode !== 9) {
                    this.showPopup();
                }
            }
        }
        else if (lastWordRange.indexOf(this.mentionChar) === 0 && !this.isPopupOpen && e.keyCode !== 8 && (!this.popupObj ||
            (isNullOrUndefined(this.target) && !document.body.contains(this.popupObj.element) ||
                !isNullOrUndefined(this.target) && document.body.contains(this.popupObj.element)))) {
            if (this.initRemoteRender && this.list && this.list.classList.contains('e-nodata')) {
                this.searchLists(e);
            }
            this.resetList(this.dataSource, this.fields);
            if (isNullOrUndefined(this.list)) {
                this.initValue();
            }
            if (!this.isPopupOpen && e.keyCode !== 38 && e.keyCode !== 40) {
                this.didPopupOpenByTypingInitialChar = true;
                this.showPopup();
                if (this.initRemoteRender && this.list.querySelectorAll('li').length === 0) {
                    this.showWaitingSpinner();
                }
                this.lineBreak = false;
            }
        }
        else if (this.allowSpaces && this.queryString !== '' && currentRange && currentRange.trim() !== '' && currentRange.replace('\u00a0', ' ').lastIndexOf(' ') < currentRange.length - 1 &&
            e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 8 && this.mentionChar.charCodeAt(0) === lastWordRange.charCodeAt(0)) {
            this.queryString = currentRange.substring(currentRange.lastIndexOf(this.mentionChar) + 1).replace('\u00a0', ' ');
            this.searchLists(e);
        }
        else if (this.queryString === '' && this.isPopupOpen && e.keyCode !== 38 && e.keyCode !== 40 && this.mentionChar.charCodeAt(0) === lastWordRange.charCodeAt(0)) {
            this.searchLists(e);
            if (!this.isListResetted) {
                this.resetList(this.dataSource, this.fields);
            }
        }
        this.isListResetted = false;
    };
    Mention.prototype.isMatchedText = function () {
        var isMatched = false;
        for (var i = 0; i < (this.liCollections && this.liCollections.length); i++) {
            if (this.getTextRange() &&
                this.getTextRange().substring(this.getTextRange().lastIndexOf(this.mentionChar) + 1).replace('\u00a0', ' ').trim() === this.liCollections[i].getAttribute('data-value').toLowerCase()) {
                isMatched = true;
            }
        }
        return isMatched;
    };
    Mention.prototype.getCurrentRange = function () {
        this.range = this.inputElement.ownerDocument.getSelection().getRangeAt(0);
        return this.range;
    };
    Mention.prototype.searchLists = function (e) {
        var _this = this;
        this.isDataFetched = false;
        if (isNullOrUndefined(this.list)) {
            _super.prototype.render.call(this);
            this.unWireListEvents();
            this.wireListEvents();
        }
        if (e.type !== 'mousedown' && (e.keyCode === 40 || e.keyCode === 38)) {
            this.queryString = this.queryString === '' ? null : this.queryString;
            this.beforePopupOpen = true;
            this.resetList(this.dataSource, this.fields);
            return;
        }
        this.isSelected = false;
        this.activeIndex = null;
        var eventArgs = {
            preventDefaultAction: false,
            text: this.queryString,
            updateData: function (dataSource, query, fields) {
                if (eventArgs.cancel) {
                    return;
                }
                _this.isFiltered = true;
                _this.filterAction(dataSource, query, fields);
            },
            cancel: false
        };
        this.trigger('filtering', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel && !_this.isFiltered && !eventArgs.preventDefaultAction) {
                _this.filterAction(_this.dataSource, null, _this.fields);
            }
        });
    };
    Mention.prototype.filterAction = function (dataSource, query, fields) {
        this.beforePopupOpen = true;
        if (this.queryString.length >= this.minLength) {
            this.resetList(dataSource, fields, query);
            this.isListResetted = true;
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            this.beforePopupOpen = false;
        }
        this.setDataIndex();
        this.renderReactTemplates();
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    Mention.prototype.onActionComplete = function (ulElement, list, e, isUpdated) {
        _super.prototype.onActionComplete.call(this, ulElement, list, e);
        if (this.isActive) {
            if (!isNullOrUndefined(ulElement)) {
                attributes(ulElement, { 'id': this.inputElement.id + '_options', 'role': 'listbox', 'aria-hidden': 'false' });
            }
            var focusItem = ulElement.querySelector('.' + dropDownBaseClasses.li);
            if (focusItem) {
                focusItem.classList.add(dropDownBaseClasses.selected);
                this.selectedLI = focusItem;
                var value = this.getFormattedValue(focusItem.getAttribute('data-value'));
                this.selectEventCallback(focusItem, this.getDataByValue(value), value, true);
            }
            if (this.beforePopupOpen && this.isPopupOpen) {
                if (this.initRemoteRender && !isNullOrUndefined(this.popupObj.element)) {
                    this.popupObj.element.remove();
                }
                this.renderPopup();
            }
        }
    };
    Mention.prototype.setDataIndex = function () {
        for (var i = 0; this.liCollections && i < this.liCollections.length; i++) {
            this.liCollections[i].setAttribute('data-index', i.toString());
        }
    };
    Mention.prototype.listOption = function (dataSource, fieldsSettings) {
        var _this = this;
        var fields = _super.prototype.listOption.call(this, dataSource, fieldsSettings);
        if (isNullOrUndefined(fields.itemCreated)) {
            fields.itemCreated = function (e) {
                if (_this.highlight) {
                    if (_this.inputElement.tagName === _this.getNgDirective() && _this.itemTemplate) {
                        setTimeout(function () {
                            highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
                        }, 0);
                    }
                    else {
                        highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
                    }
                }
            };
        }
        else {
            var itemCreated_1 = fields.itemCreated;
            fields.itemCreated = function (e) {
                if (_this.highlight) {
                    highlightSearch(e.item, _this.queryString, _this.ignoreCase, _this.filterType);
                }
                itemCreated_1.apply(_this, [e]);
            };
        }
        return fields;
    };
    Mention.prototype.elementValue = function () {
        if (!this.isContentEditable(this.inputElement)) {
            return this.inputElement.value.replace(this.mentionChar, '');
        }
        else {
            return this.inputElement.textContent.replace(this.mentionChar, '');
        }
    };
    Mention.prototype.getQuery = function (query) {
        var filterQuery = query ? query.clone() : this.query ? this.query.clone() : new Query();
        var filterType = (this.queryString === '' && !isNullOrUndefined(this.elementValue())) ? 'equal' : this.filterType;
        var queryString = (this.queryString === '' && !isNullOrUndefined(this.elementValue())) ?
            this.elementValue() : this.queryString;
        if (this.isFiltered) {
            return filterQuery;
        }
        if (this.queryString !== null && this.queryString !== '') {
            var dataType = this.typeOfData(this.dataSource).typeof;
            if (!(this.dataSource instanceof DataManager) && dataType === 'string' || dataType === 'number') {
                filterQuery.where('', filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
            else {
                var mapping = !isNullOrUndefined(this.fields.text) ? this.fields.text : '';
                filterQuery.where(mapping, filterType, queryString, this.ignoreCase, this.ignoreAccent);
            }
        }
        if (!isNullOrUndefined(this.suggestionCount)) {
            // Since defualt value of suggestioncount is 25, checked the condition
            if (this.suggestionCount !== 25) {
                for (var queryElements = 0; queryElements < filterQuery.queries.length; queryElements++) {
                    if (filterQuery.queries[queryElements].fn === 'onTake') {
                        filterQuery.queries.splice(queryElements, 1);
                    }
                }
            }
            filterQuery.take(this.suggestionCount);
        }
        return filterQuery;
    };
    Mention.prototype.renderHightSearch = function () {
        if (this.highlight) {
            for (var i = 0; i < this.liCollections.length; i++) {
                var isHighlight = this.ulElement.querySelector('.e-active');
                if (!isHighlight) {
                    revertHighlightSearch(this.liCollections[i]);
                    highlightSearch(this.liCollections[i], this.queryString, this.ignoreCase, this.filterType);
                }
            }
        }
    };
    Mention.prototype.getTextRange = function () {
        var text;
        if (!this.isContentEditable(this.inputElement)) {
            var component = this.inputElement;
            if (!isNullOrUndefined(component)) {
                var startPos = component.selectionStart;
                if (component.value && startPos >= 0) {
                    text = component.value.substring(0, startPos);
                }
            }
        }
        else {
            if (this.range) {
                var selectedElem = this.range.startContainer;
                if (!isNullOrUndefined(selectedElem)) {
                    var workingNodeContent = selectedElem.textContent;
                    var selectStartOffset = this.range.startOffset;
                    if (workingNodeContent && selectStartOffset >= 0) {
                        text = workingNodeContent.substring(0, selectStartOffset);
                    }
                }
            }
        }
        return text;
    };
    Mention.prototype.getLastLetter = function (text) {
        if (isNullOrUndefined(text)) {
            return '';
        }
        var textValue = text.replace(/\u00A0/g, ' ');
        var words = textValue.split(/\s+/);
        var wordCnt = words.length - 1;
        return words[wordCnt].trim();
    };
    Mention.prototype.isContentEditable = function (element) {
        return element && element.nodeName !== 'INPUT' && element.nodeName !== 'TEXTAREA';
    };
    /**
     * Opens the popup that displays the list of items.
     *
     * @returns {void}
     */
    Mention.prototype.showPopup = function () {
        this.beforePopupOpen = true;
        if (document.activeElement != this.inputElement) {
            this.inputElement.focus();
        }
        this.queryString = this.didPopupOpenByTypingInitialChar ? this.queryString : '';
        this.didPopupOpenByTypingInitialChar = false;
        if (this.isContentEditable(this.inputElement)) {
            this.range = this.getCurrentRange();
        }
        if (!this.isTyped) {
            this.resetList(this.dataSource, this.fields);
        }
        if (isNullOrUndefined(this.list)) {
            this.initValue();
        }
        this.renderPopup();
        attributes(this.inputElement, { 'aria-activedescendant': this.selectedElementID });
        if (this.selectedElementID == null) {
            this.inputElement.removeAttribute('aria-activedescendant');
        }
    };
    /* eslint-disable valid-jsdoc, jsdoc/require-param */
    /**
     * Hides the popup if it is in an open state.
     *
     * @returns {void}
     */
    Mention.prototype.hidePopup = function (e) {
        this.removeSelection();
        this.closePopup(0, e);
    };
    Mention.prototype.closePopup = function (delay, e) {
        var _this = this;
        if (!(this.popupObj && document.body.contains(this.popupObj.element) && this.beforePopupOpen)) {
            return;
        }
        EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        this.inputElement.removeAttribute('aria-owns');
        this.inputElement.removeAttribute('aria-activedescendant');
        this.beforePopupOpen = false;
        var animModel = {
            name: 'FadeOut',
            duration: 100,
            delay: delay ? delay : 0
        };
        var popupInstance = this.popupObj;
        var eventArgs = { popup: popupInstance, cancel: false, animation: animModel, event: e || null };
        this.trigger('closed', eventArgs, function (eventArgs) {
            if (!eventArgs.cancel && _this.popupObj) {
                if (_this.isPopupOpen) {
                    _this.popupObj.hide(new Animation(eventArgs.animation));
                }
                else {
                    _this.destroyPopup();
                }
            }
        });
    };
    Mention.prototype.renderPopup = function () {
        var _this = this;
        var args = { cancel: false };
        this.trigger('beforeOpen', args, function (args) {
            if (!args.cancel) {
                var popupEle_1;
                if (isNullOrUndefined(_this.target)) {
                    popupEle_1 = _this.createElement('div', {
                        id: _this.inputElement.id + '_popup', className: 'e-mention e-popup ' + (_this.cssClass != null ? _this.cssClass : '')
                    });
                }
                else {
                    popupEle_1 = _this.element;
                    if (_this.cssClass != null) {
                        addClass([popupEle_1], _this.cssClass.split(' '));
                    }
                }
                if (!isNullOrUndefined(_this.target)) {
                    popupEle_1.id = _this.inputElement.id + '_popup';
                }
                _this.listHeight = formatUnit(_this.popupHeight);
                if (!isNullOrUndefined(_this.list.querySelector('li')) && !_this.initRemoteRender) {
                    var li = _this.list.querySelector('.' + dropDownBaseClasses.focus);
                    if (!isNullOrUndefined(li)) {
                        _this.selectedLI = li;
                        var value = _this.getFormattedValue(li.getAttribute('data-value'));
                        _this.selectEventCallback(li, _this.getDataByValue(value), value, true);
                    }
                }
                append([_this.list], popupEle_1);
                if (_this.inputElement.parentElement && _this.inputElement.parentElement.parentElement &&
                    _this.inputElement.parentElement.parentElement.classList.contains('e-richtexteditor')) {
                    if (popupEle_1.firstElementChild && popupEle_1.firstElementChild.childElementCount > 0) {
                        popupEle_1.firstElementChild.setAttribute('aria-owns', _this.inputElement.parentElement.parentElement.id);
                    }
                }
                if ((!_this.popupObj || !document.body.contains(_this.popupObj.element)) ||
                    !document.contains(popupEle_1) && isNullOrUndefined(_this.target)) {
                    document.body.appendChild(popupEle_1);
                }
                var coordinates_1;
                popupEle_1.style.visibility = 'hidden';
                _this.setHeight(popupEle_1);
                var offsetValue = 0;
                var left = 0;
                _this.initializePopup(popupEle_1, offsetValue, left);
                _this.checkCollision(popupEle_1);
                popupEle_1.style.visibility = 'visible';
                var popupLeft_1 = popupEle_1.parentElement.offsetWidth - popupEle_1.offsetWidth;
                var popupHeight_1 = popupEle_1.offsetHeight;
                addClass([popupEle_1], ['e-mention', 'e-popup', 'e-popup-close']);
                if (!isNullOrUndefined(_this.list)) {
                    _this.unWireListEvents();
                    _this.wireListEvents();
                }
                _this.selectedElementID = _this.selectedLI ? _this.selectedLI.id : null;
                attributes(_this.inputElement, { 'aria-owns': _this.inputElement.id + '_options', 'aria-activedescendant': _this.selectedElementID });
                if (_this.selectedElementID == null) {
                    _this.inputElement.removeAttribute('aria-activedescendant');
                }
                var animModel = { name: 'FadeIn', duration: 100 };
                _this.beforePopupOpen = true;
                var popupInstance = _this.popupObj;
                var eventArgs = { popup: popupInstance, cancel: false, animation: animModel };
                _this.trigger('opened', eventArgs, function (eventArgs) {
                    if (!eventArgs.cancel) {
                        _this.renderReactTemplates();
                        if (_this.popupObj) {
                            _this.popupObj.show(new Animation(eventArgs.animation), (_this.zIndex === 1000) ? _this.inputElement : null);
                        }
                        if (isNullOrUndefined(_this.getTriggerCharPosition())) {
                            return;
                        }
                        coordinates_1 = _this.getCoordinates(_this.inputElement, _this.getTriggerCharPosition());
                        if (!_this.isCollided) {
                            popupEle_1.style.cssText = 'top: '.concat(coordinates_1.top.toString(), 'px;\n left: ').concat(coordinates_1.left.toString(), 'px;\nposition: absolute;\n display: block;');
                        }
                        else {
                            if (_this.collision.length > 0 && _this.collision.indexOf('right') > -1 && _this.collision.indexOf('bottom') === -1) {
                                popupEle_1.style.cssText = 'top: '.concat(coordinates_1.top.toString(), 'px;\n left: ').concat(popupLeft_1.toString(), 'px;\nposition: absolute;\n display: block;');
                            }
                            else if (_this.collision && _this.collision.length > 0 && _this.collision.indexOf('bottom') > -1 && _this.collision.indexOf('right') === -1) {
                                popupEle_1.style.left = formatUnit(coordinates_1.left);
                                popupEle_1.style.top = formatUnit(coordinates_1.top - parseInt(popupHeight_1.toString()));
                            }
                            else if (_this.collision && _this.collision.length > 0 && _this.collision.indexOf('bottom') > -1 && _this.collision.indexOf('right') > -1) {
                                popupEle_1.style.left = formatUnit(popupLeft_1);
                                popupEle_1.style.top = formatUnit(coordinates_1.top - parseInt(popupHeight_1.toString()));
                            }
                            else {
                                popupEle_1.style.left = formatUnit(coordinates_1.left);
                                popupEle_1.style.top = formatUnit(coordinates_1.top - parseInt(_this.popupHeight.toString()));
                            }
                            _this.isCollided = false;
                            _this.collision = [];
                        }
                        popupEle_1.style.width = _this.popupWidth !== '100%' && !isNullOrUndefined(_this.popupWidth) ? formatUnit(_this.popupWidth) : 'auto';
                        _this.setHeight(popupEle_1);
                        popupEle_1.style.zIndex = _this.zIndex === 1000 ? getZindexPartial(popupEle_1).toString() : _this.zIndex.toString();
                    }
                    else {
                        _this.beforePopupOpen = false;
                        _this.destroyPopup();
                    }
                });
            }
            else {
                _this.beforePopupOpen = false;
            }
        });
    };
    Mention.prototype.setHeight = function (popupEle) {
        if (this.popupHeight !== 'auto' && this.list) {
            this.list.style.maxHeight = (parseInt(this.listHeight, 10) - 2).toString() + 'px'; // due to box-sizing property
            popupEle.style.maxHeight = formatUnit(this.popupHeight);
        }
        else {
            popupEle.style.height = 'auto';
        }
    };
    Mention.prototype.checkCollision = function (popupEle) {
        if (!Browser.isDevice || (Browser.isDevice && !(this.getModuleName() === 'mention'))) {
            var coordinates = this.getCoordinates(this.inputElement, this.getTriggerCharPosition());
            this.collision = isCollide(popupEle, null, coordinates.left, coordinates.top);
            if (this.collision.length > 0) {
                popupEle.style.marginTop = -parseInt(getComputedStyle(popupEle).marginTop, 10) + 'px';
                this.isCollided = true;
            }
            this.popupObj.resolveCollision();
        }
    };
    Mention.prototype.getTriggerCharPosition = function () {
        var mostRecentTriggerCharPos;
        var currentRange = this.getTextRange();
        if (currentRange !== undefined && currentRange !== null) {
            mostRecentTriggerCharPos = 0;
            var idx = currentRange.lastIndexOf(this.mentionChar);
            if (idx >= mostRecentTriggerCharPos) {
                mostRecentTriggerCharPos = idx;
            }
        }
        return mostRecentTriggerCharPos ? mostRecentTriggerCharPos : 0;
    };
    Mention.prototype.initializePopup = function (element, offsetValue, left) {
        var _this = this;
        this.popupObj = new Popup(element, {
            width: this.setWidth(), targetType: 'relative',
            relateTo: this.inputElement, collision: { X: 'flip', Y: 'flip' }, offsetY: offsetValue,
            enableRtl: this.enableRtl, offsetX: left, position: { X: 'left', Y: 'bottom' }, actionOnScroll: 'hide',
            zIndex: this.zIndex,
            close: function () {
                _this.destroyPopup();
            },
            open: function () {
                EventHandler.add(document, 'mousedown', _this.onDocumentClick, _this);
                _this.isPopupOpen = true;
                _this.setDataIndex();
            }
        });
    };
    Mention.prototype.setWidth = function () {
        var width = formatUnit(this.popupWidth);
        if (width.indexOf('%') > -1) {
            var inputWidth = this.inputElement.offsetWidth * parseFloat(width) / 100;
            width = inputWidth.toString() + 'px';
        }
        return width;
    };
    Mention.prototype.destroyPopup = function () {
        this.isPopupOpen = false;
        this.popupObj.destroy();
        if (isNullOrUndefined(this.target)) {
            detach(this.popupObj.element);
        }
        else {
            this.popupObj.element.innerHTML = '';
            this.popupObj.element.removeAttribute('style');
            this.popupObj.element.removeAttribute('aria-disabled');
        }
    };
    Mention.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!(!isNullOrUndefined(this.popupObj) && closest(target, '#' + this.popupObj.element.id))) {
            this.hidePopup(e);
        }
    };
    Mention.prototype.getCoordinates = function (element, position) {
        var properties = ['direction', 'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight', 'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing'];
        var div;
        var span;
        var range;
        var globalRange;
        var coordinates;
        var computed;
        var rect;
        if (!this.isContentEditable(this.inputElement)) {
            div = this.createElement('div', { className: 'e-form-mirror-div' });
            document.body.appendChild(div);
            computed = getComputedStyle(element);
            div.style.position = 'absolute';
            div.style.visibility = 'hidden';
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            properties.forEach(function (prop) {
                // eslint-disable-next-line security/detect-object-injection
                div.style[prop] = computed[prop];
            });
            div.textContent = element.value.substring(0, position);
            if (this.inputElement.nodeName === 'INPUT') {
                div.textContent = div.textContent.replace(/\s/g, '\u00a0');
            }
            span = this.createElement('span');
            span.textContent = element.value.substring(position) || '.';
            div.appendChild(span);
            rect = element.getBoundingClientRect();
        }
        else {
            var selectedNodePosition = this.getTriggerCharPosition();
            globalRange = this.range;
            range = document.createRange();
            if (this.getTextRange() && this.getTextRange().lastIndexOf(this.mentionChar) !== -1) {
                range.setStart(globalRange.startContainer, selectedNodePosition);
                range.setEnd(globalRange.startContainer, selectedNodePosition);
            }
            else {
                range.setStart(globalRange.startContainer, globalRange.startOffset);
                range.setEnd(globalRange.startContainer, globalRange.endOffset);
            }
            this.isTyped = false;
            range.collapse(false);
            rect = range.getBoundingClientRect().top === 0 ? range.startContainer.getClientRects()[0] : range.getBoundingClientRect();
        }
        var doc = document.documentElement;
        var windowLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
        var windowTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
        var width = 0;
        if (!isNullOrUndefined(range) && range.getBoundingClientRect().top === 0) {
            for (var i = 0; i < this.range.startContainer.childNodes.length; i++) {
                if (this.range.startContainer.childNodes[i].nodeType !== Node.TEXT_NODE && this.range.startContainer.childNodes[i].textContent.trim() !== '') {
                    width += this.range.startContainer.childNodes[i].getClientRects()[0].width;
                }
                else if (this.range.startContainer.childNodes[i].textContent !== '') {
                    var span_1 = document.createElement("span");
                    span_1.innerHTML = this.range.startContainer.childNodes[i].nodeValue;
                    document.body.appendChild(span_1);
                    var textNodeWidth = span_1.offsetWidth;
                    document.body.removeChild(span_1);
                    width += textNodeWidth;
                }
            }
        }
        if (!this.isContentEditable(this.inputElement)) {
            coordinates = {
                top: rect.top + windowTop + span.offsetTop + parseInt(computed.borderTopWidth, 10) +
                    parseInt(computed.fontSize, 10) + 3 - element.scrollTop - (this.isCollided ? 10 : 0),
                left: rect.left + windowLeft + span.offsetLeft + parseInt(computed.borderLeftWidth, 10)
            };
            document.body.removeChild(div);
        }
        else {
            if (this.collision && this.collision.length > 0 && this.collision.indexOf('right') > -1 && this.collision.indexOf('bottom') === -1) {
                coordinates = {
                    top: rect.top + windowTop + parseInt(getComputedStyle(this.inputElement).fontSize, 10),
                    left: rect.left + windowLeft + width
                };
            }
            else {
                coordinates = {
                    top: rect.top + windowTop + parseInt(getComputedStyle(this.inputElement).fontSize, 10) - (this.isCollided ? 10 : 0),
                    left: rect.left + windowLeft + width
                };
            }
        }
        return coordinates;
    };
    Mention.prototype.initValue = function () {
        this.renderList();
        if (this.dataSource instanceof DataManager) {
            this.initRemoteRender = true;
        }
        else {
            this.updateValues();
        }
    };
    Mention.prototype.updateValues = function () {
        var li = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (!isNullOrUndefined(li)) {
            this.setSelection(li, null);
        }
    };
    Mention.prototype.renderList = function () {
        _super.prototype.render.call(this);
        this.unWireListEvents();
        this.wireListEvents();
    };
    /**
     * Event binding for list
     *
     * @returns {void}
     */
    Mention.prototype.wireListEvents = function () {
        EventHandler.add(this.list, 'click', this.onMouseClick, this);
        EventHandler.add(this.list, 'mouseover', this.onMouseOver, this);
        EventHandler.add(this.list, 'mouseout', this.onMouseLeave, this);
    };
    /**
     * Event un binding for list items.
     *
     * @returns {void}
     */
    Mention.prototype.unWireListEvents = function () {
        EventHandler.remove(this.list, 'click', this.onMouseClick);
        EventHandler.remove(this.list, 'mouseover', this.onMouseOver);
        EventHandler.remove(this.list, 'mouseout', this.onMouseLeave);
    };
    Mention.prototype.onMouseClick = function (e) {
        var target = e.target;
        var li = closest(target, '.' + dropDownBaseClasses.li);
        if (!this.isValidLI(li)) {
            return;
        }
        this.isSelected = true;
        this.setSelection(li, e);
        var delay = 100;
        this.closePopup(delay, e);
        this.inputElement.focus();
    };
    Mention.prototype.updateSelectedItem = function (li, e, preventSelect, isSelection) {
        var _this = this;
        this.removeSelection();
        li.classList.add(dropDownBaseClasses.selected);
        this.removeHover();
        var value = this.getFormattedValue(li.getAttribute('data-value'));
        var selectedData = this.getDataByValue(value);
        if (!preventSelect && !isNullOrUndefined(e) && !(e.action === "down" || e.action === "up")) {
            var items = this.detachChanges(selectedData);
            this.isSelected = true;
            var eventArgs = {
                e: e,
                item: li,
                itemData: items,
                isInteracted: e ? true : false,
                cancel: false
            };
            this.trigger('select', eventArgs, function (eventArgs) {
                if (eventArgs.cancel) {
                    li.classList.remove(dropDownBaseClasses.selected);
                    _this.isSelected = false;
                    _this.isSelectCancel = true;
                }
                else {
                    _this.selectEventCallback(li, selectedData, value);
                    if (isSelection) {
                        _this.setSelectOptions(li, e);
                    }
                }
            });
        }
        else {
            this.selectEventCallback(li, selectedData, value);
            if (isSelection) {
                this.setSelectOptions(li, e);
            }
        }
    };
    Mention.prototype.setSelection = function (li, e) {
        if (this.isValidLI(li) && (!li.classList.contains(dropDownBaseClasses.selected) || (this.isPopupOpen && this.isSelected
            && li.classList.contains(dropDownBaseClasses.selected)))) {
            this.updateSelectedItem(li, e, false, true);
        }
        else {
            this.setSelectOptions(li, e);
        }
    };
    Mention.prototype.setSelectOptions = function (li, e) {
        if (this.list) {
            this.removeHover();
        }
        this.previousSelectedLI = (!isNullOrUndefined(this.selectedLI)) ? this.selectedLI : null;
        this.selectedLI = li;
        if (this.isPopupOpen && !isNullOrUndefined(this.selectedLI)) {
            this.setScrollPosition(e);
        }
        if (e && (e.keyCode === 38 || e.keyCode === 40)) {
            return;
        }
        if (isNullOrUndefined(e) || this.setValue(e)) {
            return;
        }
    };
    Mention.prototype.setScrollPosition = function (e) {
        if (!isNullOrUndefined(e)) {
            switch (e.action) {
                case 'pageDown':
                case 'down':
                case 'end':
                    this.scrollBottom();
                    break;
                default:
                    this.scrollTop();
                    break;
            }
        }
        else {
            this.scrollBottom(true);
        }
    };
    Mention.prototype.scrollBottom = function (isInitial) {
        if (!isNullOrUndefined(this.selectedLI)) {
            var currentOffset = this.list.offsetHeight;
            var nextBottom = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            var nextOffset = this.list.scrollTop + nextBottom - currentOffset;
            nextOffset = isInitial ? nextOffset + parseInt(getComputedStyle(this.list).paddingTop, 10) * 2 : nextOffset;
            var boxRange = this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop;
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextBottom > currentOffset || !(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = nextOffset;
            }
        }
    };
    Mention.prototype.scrollTop = function () {
        if (!isNullOrUndefined(this.selectedLI)) {
            var nextOffset = this.selectedLI.offsetTop - this.list.scrollTop;
            nextOffset = this.fields.groupBy && nextOffset;
            var boxRange = (this.selectedLI.offsetTop + this.selectedLI.offsetHeight - this.list.scrollTop);
            if (this.activeIndex === 0) {
                this.list.scrollTop = 0;
            }
            else if (nextOffset < 0) {
                this.list.scrollTop = this.list.scrollTop + nextOffset;
            }
            else if (!(boxRange > 0 && this.list.offsetHeight > boxRange)) {
                this.list.scrollTop = this.selectedLI.offsetTop;
            }
        }
    };
    Mention.prototype.selectEventCallback = function (li, selectedData, value, selectLi) {
        this.previousItemData = (!isNullOrUndefined(this.itemData)) ? this.itemData : null;
        this.item = li;
        this.itemData = selectedData;
        var focusedItem = this.list.querySelector('.' + dropDownBaseClasses.focus);
        if (focusedItem) {
            removeClass([focusedItem], dropDownBaseClasses.focus);
        }
        if (selectLi) {
            addClass([li], dropDownBaseClasses.selected);
        }
        li.setAttribute('aria-selected', 'true');
        this.activeIndex = this.getIndexByValue(value);
    };
    Mention.prototype.detachChanges = function (value) {
        var items;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        }
        else {
            items = value;
        }
        return items;
    };
    Mention.prototype.setValue = function (e) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!this.isReact) {
            if (!isNullOrUndefined(this.displayTemplate)) {
                this.setDisplayTemplate();
            }
            this.updateMentionValue(e);
            return true;
        }
        else {
            if (!isNullOrUndefined(this.displayTemplate)) {
                this.setDisplayTemplate(e);
            }
            else {
                this.updateMentionValue(e);
            }
            return true;
        }
    };
    Mention.prototype.updateMentionValue = function (e) {
        var dataItem = this.getItemData();
        var textSuffix;
        var value;
        var endPos;
        var range;
        var globalRange;
        var selection = this.inputElement.ownerDocument.getSelection();
        var startPos = this.getTriggerCharPosition();
        textSuffix = typeof this.suffixText === 'string' ? this.suffixText : '';
        if (this.isSelectCancel) {
            this.isSelectCancel = false;
            return;
        }
        if (dataItem.text !== null) {
            value = this.mentionVal(dataItem.text);
        }
        if (!this.isContentEditable(this.inputElement)) {
            var myField = this.inputElement;
            var currentTriggerSnippet = this.getTextRange().substring(startPos + this.mentionChar.length, this.getTextRange().length);
            value += textSuffix;
            endPos = startPos + this.mentionChar.length;
            endPos += currentTriggerSnippet.length;
            myField.value = myField.value.substring(0, startPos) + value + myField.value.substring(endPos, myField.value.length);
            myField.selectionStart = startPos + value.length;
            myField.selectionEnd = startPos + value.length;
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            this.onChangeEvent(e);
        }
        else {
            endPos = this.getTriggerCharPosition() + this.mentionChar.length;
            if (this.range && (this.range.startContainer.textContent.trim() !== this.mentionChar)) {
                endPos = this.range.endOffset;
            }
            globalRange = this.range;
            range = document.createRange();
            if (((this.getTextRange() && this.getTextRange().lastIndexOf(this.mentionChar) !== -1) || this.getTextRange() && this.getTextRange().trim() === this.mentionChar)) {
                range.setStart(globalRange.startContainer, startPos);
                range.setEnd(globalRange.startContainer, endPos);
            }
            else {
                if (globalRange.commonAncestorContainer.textContent.trim() !== '' && !isNullOrUndefined(globalRange.commonAncestorContainer.textContent.trim()) && this.getTextRange() && this.getTextRange().lastIndexOf(this.mentionChar) !== -1) {
                    range.setStart(globalRange.startContainer, globalRange.startOffset - 1);
                    range.setEnd(globalRange.startContainer, globalRange.endOffset - 1);
                }
                else {
                    range.setStart(globalRange.startContainer, globalRange.startOffset);
                    range.setEnd(globalRange.startContainer, globalRange.endOffset);
                }
            }
            this.isTyped = false;
            range.deleteContents();
            var element = this.createElement('div');
            element.innerHTML = value;
            var frag = document.createDocumentFragment();
            var node = void 0;
            var lastNode = void 0;
            // eslint-disable-next-line no-cond-assign
            while (node = element.firstChild) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);
            if (lastNode) {
                range = range.cloneRange();
                range.setStartAfter(lastNode);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            this.onChangeEvent(e);
        }
    };
    Mention.prototype.mentionVal = function (value) {
        var showChar = this.showMentionChar ? this.mentionChar : '';
        if (!isNullOrUndefined(this.displayTemplate) && !isNullOrUndefined(this.displayTempElement)) {
            value = this.displayTempElement.innerHTML;
        }
        if (this.isContentEditable(this.inputElement)) {
            if (Browser.isAndroid) {
                return '<span contenteditable="true" class="e-mention-chip">' + showChar + value + '</span>'.concat(typeof this.suffixText === 'string' ? this.suffixText : ' ');
            }
            else {
                return '<span contenteditable="false" class="e-mention-chip">' + showChar + value + '</span>'.concat(typeof this.suffixText === 'string' ? this.suffixText : ' ');
            }
        }
        else {
            return showChar + value;
        }
    };
    Mention.prototype.setDisplayTemplate = function (e) {
        var _this = this;
        var compiledString;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.clearTemplate(['displayTemplate']);
            if (this.displayTempElement) {
                detach(this.displayTempElement);
                this.displayTempElement = null;
            }
        }
        if (!this.displayTempElement) {
            this.displayTempElement = this.createElement('div');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!this.isReact) {
            this.displayTempElement.innerHTML = '';
        }
        compiledString = compile(this.displayTemplate);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var displayCompTemp = compiledString(this.itemData, this, 'displayTemplate', this.displayTemplateId, this.isStringTemplate, null, this.displayTempElement);
        if (displayCompTemp && displayCompTemp.length > 0) {
            append(displayCompTemp, this.displayTempElement);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!this.isReact) {
            this.renderTemplates();
        }
        else {
            this.renderTemplates(function () {
                _this.updateMentionValue(e);
            });
        }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Mention.prototype.renderTemplates = function (callBack) {
        this.renderReactTemplates(callBack);
    };
    Mention.prototype.setSpinnerTemplate = function () {
        var _this = this;
        var compiledString;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.isReact) {
            this.clearTemplate(['spinnerTemplate']);
            if (this.spinnerTemplateElement) {
                detach(this.spinnerTemplateElement);
                this.spinnerTemplateElement = null;
            }
        }
        if (!this.spinnerTemplateElement) {
            this.spinnerTemplateElement = this.createElement('div');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!this.isReact) {
            this.spinnerTemplateElement.innerHTML = '';
        }
        compiledString = compile(this.spinnerTemplate);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var spinnerCompTemp = compiledString(null, this, 'spinnerTemplate', this.spinnerTemplateId, this.isStringTemplate, null, this.spinnerTemplateElement);
        if (spinnerCompTemp && spinnerCompTemp.length > 0) {
            for (var i = 0; i < spinnerCompTemp.length; i++) {
                this.spinnerTemplateElement.appendChild(spinnerCompTemp[i]);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!this.isReact) {
            this.renderTemplates();
            this.popupObj.element.appendChild(this.spinnerTemplateElement);
        }
        else {
            this.renderTemplates(function () {
                _this.popupObj.element.appendChild(_this.spinnerTemplateElement);
            });
        }
    };
    Mention.prototype.onChangeEvent = function (eve) {
        this.isSelected = false;
        var items = this.detachMentionChanges(this.itemData);
        var preItems;
        if (typeof this.previousItemData === 'string' ||
            typeof this.previousItemData === 'boolean' ||
            typeof this.previousItemData === 'number') {
            preItems = Object.defineProperties({}, {
                value: {
                    value: this.previousItemData,
                    enumerable: true
                },
                text: {
                    value: this.previousItemData,
                    enumerable: true
                }
            });
        }
        else {
            preItems = this.previousItemData;
        }
        var eventArgs = {
            e: eve,
            item: this.item,
            itemData: items,
            previousItem: this.previousSelectedLI,
            previousItemData: preItems,
            isInteracted: eve ? true : false,
            value: this.item.innerHTML,
            element: this.inputElement
        };
        this.trigger('change', eventArgs);
    };
    Mention.prototype.detachMentionChanges = function (value) {
        var items;
        if (typeof value === 'string' ||
            typeof value === 'boolean' ||
            typeof value === 'number') {
            items = Object.defineProperties({}, {
                value: {
                    value: value,
                    enumerable: true
                },
                text: {
                    value: value,
                    enumerable: true
                }
            });
        }
        else {
            items = value;
        }
        return items;
    };
    Mention.prototype.getItemData = function () {
        var fields = this.fields;
        var dataItem = null;
        dataItem = this.itemData;
        var dataValue;
        var dataText;
        if (!isNullOrUndefined(dataItem)) {
            dataValue = getValue(fields.value, dataItem);
            dataText = getValue(fields.text, dataItem);
        }
        var value = (!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataValue : dataItem);
        var text = (!isNullOrUndefined(dataItem) &&
            !isUndefined(dataValue) ? dataText : dataItem);
        return { value: value, text: text };
    };
    Mention.prototype.removeSelection = function () {
        if (this.list) {
            var selectedItems = this.list.querySelectorAll('.' + dropDownBaseClasses.selected);
            if (selectedItems.length) {
                removeClass(selectedItems, dropDownBaseClasses.selected);
                selectedItems[0].removeAttribute('aria-selected');
            }
        }
    };
    Mention.prototype.onMouseOver = function (e) {
        var currentLi = closest(e.target, '.' + dropDownBaseClasses.li);
        this.setHover(currentLi);
    };
    Mention.prototype.setHover = function (li) {
        if (this.isValidLI(li) && !li.classList.contains(dropDownBaseClasses.hover)) {
            this.removeHover();
            addClass([li], dropDownBaseClasses.hover);
        }
    };
    Mention.prototype.removeHover = function () {
        if (this.list) {
            var hoveredItem = this.list.querySelectorAll('.' + dropDownBaseClasses.hover);
            if (hoveredItem && hoveredItem.length) {
                removeClass(hoveredItem, dropDownBaseClasses.hover);
            }
        }
    };
    Mention.prototype.isValidLI = function (li) {
        return (li && li.hasAttribute('role') && li.getAttribute('role') === 'option');
    };
    Mention.prototype.onMouseLeave = function () {
        this.removeHover();
    };
    /**
     * Search the entered text and show it in the suggestion list if available.
     *
     * @returns {void}
     */
    Mention.prototype.search = function (text, positionX, positionY) {
        if (this.isContentEditable(this.inputElement)) {
            this.range = this.getCurrentRange();
        }
        var currentRange = this.getTextRange();
        var lastWordRange = this.getLastLetter(currentRange);
        if ((this.ignoreCase && (text === lastWordRange || text === lastWordRange.toLowerCase()))
            || !this.ignoreCase && text === lastWordRange) {
            this.resetList(this.dataSource, this.fields);
        }
        else {
            if (this.isPopupOpen) {
                this.hidePopup();
            }
            return;
        }
        if (isNullOrUndefined(this.list)) {
            this.renderList();
            this.renderPopup();
        }
        else {
            this.showPopup();
        }
        this.popupObj.element.style.left = formatUnit(positionX);
        this.popupObj.element.style.top = formatUnit(positionY);
    };
    /**
     * Removes the component from the DOM and detaches all its related event handlers. Also it removes the attributes and classes.
     *
     * @method destroy
     * @returns {void}
     */
    Mention.prototype.destroy = function () {
        this.hidePopup();
        this.unWireEvent();
        if (this.list) {
            this.unWireListEvents();
        }
        if (this.inputElement && !this.inputElement.classList.contains('e-' + this.getModuleName())) {
            return;
        }
        this.previousSelectedLI = null;
        this.item = null;
        this.selectedLI = null;
        this.popupObj = null;
        _super.prototype.destroy.call(this);
    };
    Mention.prototype.getLocaleName = function () {
        return 'mention';
    };
    Mention.prototype.getNgDirective = function () {
        return 'EJS-MENTION';
    };
    /**
     * Return the module name of this component.
     *
     * @private
     * @returns {string} Return the module name of this component.
     */
    Mention.prototype.getModuleName = function () {
        return 'mention';
    };
    __decorate([
        Property(null)
    ], Mention.prototype, "cssClass", void 0);
    __decorate([
        Property('@')
    ], Mention.prototype, "mentionChar", void 0);
    __decorate([
        Property(false)
    ], Mention.prototype, "showMentionChar", void 0);
    __decorate([
        Property(false)
    ], Mention.prototype, "allowSpaces", void 0);
    __decorate([
        Property(null)
    ], Mention.prototype, "suffixText", void 0);
    __decorate([
        Property(25)
    ], Mention.prototype, "suggestionCount", void 0);
    __decorate([
        Property(0)
    ], Mention.prototype, "minLength", void 0);
    __decorate([
        Property('None')
    ], Mention.prototype, "sortOrder", void 0);
    __decorate([
        Property(true)
    ], Mention.prototype, "ignoreCase", void 0);
    __decorate([
        Property(false)
    ], Mention.prototype, "highlight", void 0);
    __decorate([
        Property()
    ], Mention.prototype, "locale", void 0);
    __decorate([
        Property('auto')
    ], Mention.prototype, "popupWidth", void 0);
    __decorate([
        Property('300px')
    ], Mention.prototype, "popupHeight", void 0);
    __decorate([
        Property(null)
    ], Mention.prototype, "displayTemplate", void 0);
    __decorate([
        Property(null)
    ], Mention.prototype, "itemTemplate", void 0);
    __decorate([
        Property('No records found')
    ], Mention.prototype, "noRecordsTemplate", void 0);
    __decorate([
        Property(null)
    ], Mention.prototype, "spinnerTemplate", void 0);
    __decorate([
        Property()
    ], Mention.prototype, "target", void 0);
    __decorate([
        Property([])
    ], Mention.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], Mention.prototype, "query", void 0);
    __decorate([
        Property('Contains')
    ], Mention.prototype, "filterType", void 0);
    __decorate([
        Complex({ text: null, value: null, iconCss: null, groupBy: null }, FieldSettings)
    ], Mention.prototype, "fields", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "actionFailure", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "change", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "beforeOpen", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "opened", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "closed", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "select", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "filtering", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "created", void 0);
    __decorate([
        Event()
    ], Mention.prototype, "destroyed", void 0);
    Mention = __decorate([
        NotifyPropertyChanges
    ], Mention);
    return Mention;
}(DropDownBase));
export { Mention };
