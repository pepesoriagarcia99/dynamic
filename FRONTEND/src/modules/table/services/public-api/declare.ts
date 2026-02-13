import type { default as PaginationComponent } from '../../components/Pagination.svelte';
import type { default as BodyComponent } from '../../components/body/Body.svelte';

import { Pagination } from '../../services/public-api/Pagination';
import { Selection } from './Selection';

export const declarePublicApi = (el: HTMLElement, paginationRef: PaginationComponent, bodyRef: BodyComponent) => {
  if (!el) return;

  const host = (el?.getRootNode() as ShadowRoot)?.host;
  if (!host) return;

  (host as any).pagination = new Pagination(paginationRef);
  (host as any).selection = new Selection(bodyRef);

  // (host as any).filter = entrypoint.filter;

  //   (host as any).selection = selection();
  //   (host as any).sort = sort();
};