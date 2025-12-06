import type { RowEvent } from "./RowEvent";
import type { SelectionEvent } from "./SelectionEvent";

export interface ContextMenuEvent {
    row: RowEvent;
    selection: SelectionEvent[];
}