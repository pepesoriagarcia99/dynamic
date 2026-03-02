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

    public state(): any[] {
        return this.bodyRef.getSelectedIds();
    }
}