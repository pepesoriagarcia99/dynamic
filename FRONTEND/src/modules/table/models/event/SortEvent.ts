export type SortOrder = 'asc' | 'desc';

export interface SortEvent {
    key: string;
    value: SortOrder | null;
}
