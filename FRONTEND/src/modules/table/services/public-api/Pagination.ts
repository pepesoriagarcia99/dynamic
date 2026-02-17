import type { default as PaginationComponent } from '../../components/Pagination.svelte';

export class Pagination {

    private paginationRef: PaginationComponent;

    constructor(paginationRef: PaginationComponent) {
        this.paginationRef = paginationRef;
    }

    public reset() {
        this.paginationRef.resetPage();
    }

    public setPage(page: number) {
        this.paginationRef.setPage(page);
    }

    public setPageSize(size: number) {
        this.paginationRef.setPageSize(size);
    }

    public state(): { page: number, pageSize: number } {
        return this.paginationRef.getState();
    }
}