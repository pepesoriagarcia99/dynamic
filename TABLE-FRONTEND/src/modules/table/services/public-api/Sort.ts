import type { default as HeaderComponent } from '../../components/header/Header.svelte';
import type { SortEvent } from '../../models/event/TableEvent';


export class Sort {

    private headerRef: HeaderComponent;

    constructor(headerRef: HeaderComponent) {
        this.headerRef = headerRef;
    }

    reset() {
        this.headerRef.deselectAllSorts();
    }

    state(): SortEvent[] {
        return this.headerRef.getSortState();
    }
}