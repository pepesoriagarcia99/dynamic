import type { TableConfiguration } from '../../models/configuration/TableConfiguration';

import type { default as PaginationComponent } from '../../components/Pagination.svelte';
import type { default as BodyComponent } from '../../components/body/Body.svelte';
import type { default as HeaderComponent } from '../../components/header/Header.svelte';

import { Pagination } from '../../services/public-api/Pagination';
import { Filter } from './Filter';
import { Selection } from './Selection';
import { Sort } from './Sort';

export const declarePublicApi = (
  configuration: TableConfiguration,
  el: HTMLElement,
  paginationRef: PaginationComponent,
  bodyRef: BodyComponent,
  headerRef: HeaderComponent
) => {
  if (!el) return;

  const host = (el?.getRootNode() as ShadowRoot)?.host;
  if (!host) return;

  if (configuration.pageableType === 'pagination') {
    (host as any).pagination = new Pagination(paginationRef);
  }

  if(configuration.selectableType !== 'none') {
    (host as any).selection = new Selection(bodyRef);
  }

  if(configuration.sortableType !== 'none') {
    (host as any).sort = new Sort(headerRef);
  }

  if(configuration.filterableType !== 'none') {
    (host as any).filter = new Filter(headerRef);
  }
};
