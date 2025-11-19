import { Store } from "../../core/models/Store";
import type { FilterItem } from "../models/FilterEvent";

class FilterStore extends Store<FilterItem> {

    constructor() {
        super();
    }
}

export const filterStore = new FilterStore();
