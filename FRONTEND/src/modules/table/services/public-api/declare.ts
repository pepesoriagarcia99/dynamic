import type { default as PaginationComponent } from '../../components/Pagination.svelte';
import { Pagination } from '../../services/public-api/Pagination';

export const declarePublicApi = (el: HTMLElement, paginationRef: PaginationComponent) => {
  if (!el) return;

  const host = (el?.getRootNode() as ShadowRoot)?.host;
  if (!host) return;

  (host as any).pagination = new Pagination(paginationRef);
  // (host as any).filter = entrypoint.filter;

  //   (host as any).selection = selection();
  //   (host as any).sort = sort();
};