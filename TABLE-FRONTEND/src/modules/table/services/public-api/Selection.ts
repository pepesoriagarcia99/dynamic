import type { RowEvent } from '../../models/event/RowEvent';
import type { default as BodyComponent } from '../../components/body/Body.svelte';


export class Selection {

    private bodyRef: BodyComponent;

    constructor(bodyRef: BodyComponent) {
        this.bodyRef = bodyRef;
    }

    public reset() {
        this.bodyRef.deselectAll();
    }

    public selectAll() {
        this.bodyRef.selectAll();
    }

    public select(event: RowEvent) {
        this.bodyRef.onRowClick(event);
    }

    public state(): any[] {
        return this.bodyRef.getSelectedIds();
    }
}