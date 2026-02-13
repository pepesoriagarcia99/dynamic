import type { default as BodyComponent } from '../../components/body/Body.svelte';

export class Selection {

    private bodyRef: BodyComponent;

    constructor(bodyRef: BodyComponent) {
        this.bodyRef = bodyRef;
    }

    // public reset() {
    //     this.paginationRef.resetPage(true);
    // }
}