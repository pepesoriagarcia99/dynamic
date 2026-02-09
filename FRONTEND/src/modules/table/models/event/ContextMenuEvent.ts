import type { RowEvent } from "./RowEvent";
import type { SelectionEvent } from "./TableEvent";

export interface ContextMenuEvent {
    row: RowEvent;
    selection: SelectionEvent[];
}