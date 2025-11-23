import type { FilterApi } from "./FilterApi";
import type { PaginationApi } from "./PaginationApi";
import type { SelectionApi } from "./SelectionApi";

export interface PublicApi {
    pagination: PaginationApi;
    selection: SelectionApi;
    filter: FilterApi;
}