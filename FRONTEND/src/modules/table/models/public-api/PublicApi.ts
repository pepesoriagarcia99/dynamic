import type { Filter } from "../../services/public-api/Filter";
import type { Pagination } from "../../services/public-api/Pagination";
import type { Selection } from "../../services/public-api/Selection";
import type { Sort } from "../../services/public-api/Sort";

export interface PublicApi {
    pagination: Pagination;
    selection: Selection;
    sort: Sort;
    filter: Filter;
}