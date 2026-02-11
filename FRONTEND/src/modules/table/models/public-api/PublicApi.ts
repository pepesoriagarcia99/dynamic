// import type { FilterApi } from "./FilterApi";
// import type { PaginationApi } from "./PaginationApi";
// import type { SelectionApi } from "./SelectionApi";
// import type { SortApi } from "./SortApi";

import type { Pagination } from "../../services/public-api/Pagination";

// import type { Filter } from "../../services/public-api/Filter";
// import type { Pagination } from "../../services/public-api/Pagination";

export interface PublicApi {
    pagination: Pagination;
    
    // filter: Filter;
    // pagination: PaginationApi;
    // selection: SelectionApi;
    // filter: FilterApi;
    // sort: SortApi;
}