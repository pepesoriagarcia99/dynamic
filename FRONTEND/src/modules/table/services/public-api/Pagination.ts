import type PaginationComponent from '../components/Pagination.svelte';

export class Pagination {

    private paginationRef: PaginationComponent;

    constructor(paginationRef: PaginationComponent) {
        this.paginationRef = paginationRef;
    }

}