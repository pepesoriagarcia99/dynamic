import type { default as PaginationComponent } from '../../components/Pagination.svelte';
import type { default as BodyComponent } from '../../components/body/Body.svelte';
import type { default as HeaderComponent } from '../../components/header/Header.svelte';

import { Pagination } from '../../services/public-api/Pagination';
import { Filter } from './Filter';
import { Selection } from './Selection';

export const declarePublicApi = (el: HTMLElement, paginationRef: PaginationComponent, bodyRef: BodyComponent, headerRef: HeaderComponent) => {
  if (!el) return;

  const host = (el?.getRootNode() as ShadowRoot)?.host;
  if (!host) return;

  (host as any).pagination = new Pagination(paginationRef);
  (host as any).selection = new Selection(bodyRef);
  (host as any).filter = new Filter(headerRef);
};