import { Store } from "../../core/models/Store";
import type { TableConfiguration } from "../models/configuration/TableConfiguration";
import type { SortOrder } from "../models/event/TableEvent";

/**
 * Store para gestionar la ordenacion de columnas en la tabla
 */
class SortStore extends Store<SortOrder> {

    private configuration?: TableConfiguration;

    constructor() {
        super({ autoCommit: false });
    }

    private getValue(direction: SortOrder | null): SortOrder | null {
        if (direction === 'asc') return 'desc';
        if (direction === 'desc') return null;
        return 'asc';
    }

    init(configuration: TableConfiguration) {
        this.configuration = configuration;
    }

    simpleChange(id: string) {
        this.elements.forEach(el => {
            if (el.key === id) {
                const newValue = this.getValue(el.value);
                el.setValue(newValue);
            } else if (el.value !== null) {
                el.setValue(null);
            }
        });
    }

    multipleChange(id: string) {
        const element = this.elements.find(el => el.key === id);
        element?.setValue(this.getValue(element.value));
    }

    onSortToggle(id: string) {
        if (this.configuration!.sortableType === 'single') {
            this.simpleChange(id);
        } else if (this.configuration!.sortableType === 'multiple') {
            this.multipleChange(id);
        }

        this.emit();
    }

    /**
     * Emite cambios en la seleccion
     * @override
     */
    emit() {
        const event = this.elements.filter(element => element.value);
        super.emit(event.map(element => element.getValue()));
    }
}

export const sortStore = new SortStore();