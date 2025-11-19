import { Store } from "../../core/models/Store";
import type { FilterItem } from "../models/FilterEvent";

class FilterStore extends Store<FilterItem> {

    constructor() {
        super();
    }

    /**
     * Emite cambios en el filtro
     * @override
     */
    emit() {
        // const event = this.elements.filter(element => element.value);
        // super.emit(event.map(element => element.getValue()));
    }
}

export const filterStore = new FilterStore();
