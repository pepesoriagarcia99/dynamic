export const DEFAULT_SELECTABLE_TYPE = 'none';
export const DEFAULT_FILTERABLE = 'none';
export const DEFAULT_SORTABLE = 'none';
export const DEFAULT_PAGEABLE = 'none';
export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100, 200];
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_RESIZABLE = false;

export const VALID_SELECTABLE_TYPES = ['none', 'single', 'multiple'];
export const VALID_SORTABLE_TYPES = ['none', 'single', 'multiple'];
export const VALID_FILTERABLE_TYPES = ['none', 'basic', 'simple', 'advanced', 'custom'];
export const VALID_PAGEABLE_TYPES = ['none', 'pagination', 'infinite'];

export const READY_EVENT_NAME = 'Ready';
export const ROW_CLICK_EVENT_NAME = 'RowClick';
export const PAGE_CHANGE_EVENT_NAME = 'PageChange';
export const SORT_EVENT_NAME = 'SortChange';
export const FILTER_EVENT_NAME = 'FilterChange';
export const SELECTION_EVENT_NAME = 'SelectionChange';
export const CONTEXT_MENU_EVENT_NAME = 'ContextMenuEvent';
export const SCROLL_END_EVENT_NAME = 'ScrollEndEvent';

export const TOOLTIP_DELAY = 250;

export const LOADING_STATE = Symbol('loading');
export const CONTEXT_MENU_VISIBLE_STATE = Symbol('context-menu-visible');
export const TABLE_CONFIGURATION_STATE = Symbol('table-configuration');
