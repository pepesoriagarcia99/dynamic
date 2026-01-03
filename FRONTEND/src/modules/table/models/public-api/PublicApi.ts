import type { FilterApi } from "./FilterApi";
import type { PaginationApi } from "./PaginationApi";
import type { SelectionApi } from "./SelectionApi";
import type { SortApi } from "./SortApi";

export interface PublicApi {
    pagination: PaginationApi;
    selection: SelectionApi;
    filter: FilterApi;
    sort: SortApi;
}