import { Store } from "../../core/models/Store";


class FilterStore extends Store<string> {

    constructor() {
        super();
    }

    /**
     * Emite cambios en el filtro
     * @override
     */
    emit() {
        const event = this.elements.filter(element => element.value);
        super.emit(event.map(element => element.getValue()));
    }
}

export const filterStore = new FilterStore();
