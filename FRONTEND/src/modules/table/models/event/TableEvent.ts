import type { FilterEvent } from "./FilterEvent";
import type { PageEvent } from "./PageEvent";
import type { SortEvent } from "./SortEvent";

export interface TableEvent {
    filter: FilterEvent[],
    page: PageEvent,
    sort: SortEvent[]
}