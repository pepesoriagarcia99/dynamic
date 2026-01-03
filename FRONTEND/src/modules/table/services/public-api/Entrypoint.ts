// import type { FilterApi } from '../../models/public-api/FilterApi';
// import type { PaginationApi } from '../../models/public-api/PaginationApi';
// import type { SelectionApi } from '../../models/public-api/SelectionApi';

// import { selectionStore } from '../../store/selection-store';
// import { filterStore } from '../../store/filter-store';
// import type Pagination from '../components/Pagination.svelte';
// import { sortStore } from '../../store/sort-store';
// import type { SortApi } from '../../models/public-api/SortApi';

/**
 * * El plan
 *  Eliminar la store de filter
 * 
 * Crear una especie de public api por cada CONTROL, esto da acceso a capturar eventos, a paginar o resetar
 * Se debe mantener el CustomEvent de onFilterChange del table para compatibilidad 
 */

/**
 * En vez de dar el control desde Table y a traves de store controlar subcomponentes (Paginacion, Sort, Filter). Es mejor plan crear un public API que de acceso directo a los metodos del componente
 */


/**
 * TODO: esto puede ser una clase
 * 
 * * Esto puede ser un patron Facade!!!!!!!!!!!!!!!
 */
// const filter: FilterApi = {
//     controls: [],
//     reset: filterStore.clear,
// }

// const pagination = (paginationRef: Pagination): PaginationApi => {
//   return {
//     setPage: paginationRef.setPage,
//     resetPage: paginationRef.resetPage
//   };
// };

// const selection = (): SelectionApi => {
//   return {
//     reset: selectionStore.clear
//   };
// };

// const sort = (): SortApi => {
//   return {
//     reset: sortStore.clear
//   };
// };


import { Filter } from "./Filter";
import { Pagination } from "./Pagination";

import type { default as PaginationComponent } from '../../components/Pagination.svelte';

export class Entrypoint {

  pagination: Pagination;

  filter: Filter;

  constructor(paginationRef: PaginationComponent) {
    this.pagination = new Pagination(paginationRef);
    this.filter = new Filter();
  }
}

// export const declarePublicApi = (el: HTMLElement, paginationRef: Pagination) => {
//   if (!el) return;

//   const host = (el?.getRootNode() as ShadowRoot)?.host;
//   if (!host) return;

//   (host as any).filter = filter;
//   (host as any).pagination = pagination(paginationRef);
//   (host as any).selection = selection();
//   (host as any).sort = sort();
// };
