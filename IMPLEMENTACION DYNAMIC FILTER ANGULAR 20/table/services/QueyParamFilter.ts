import { HttpParams } from '@angular/common/http';
import { FilterEvent } from '../model/FilterEvent';
import { PARAM_FILTER_NAME, PARAM_PAGE_NAME, PARAM_PAGE_SIZE_NAME, PARAM_SORT_NAME } from '../constant';

/**
 * Implementacion de QueryParam de Angular para eventos de filtro
 */
export class QueryParamFilter {
  private params: HttpParams = new HttpParams();

  constructor(filter?: FilterEvent) {
    if (filter) {
      /**
       * Paginacion de los datos
       */
      if (filter.page) {
        this.setParam(PARAM_PAGE_NAME, filter.page.toString());
      }

      if (filter.pageSize) {
        this.setParam(PARAM_PAGE_SIZE_NAME, filter.pageSize.toString());
      }

      /**
       * Filtros de los datos
       */
      if (filter.filters && filter.filters.length > 0) {
        filter.filters.forEach((filter, i) => {
          this.setParam(`${PARAM_FILTER_NAME}[${i}][${filter.field}]`, filter.value);
        });
      }

      /**
       * Ordenacion de los datos
       */
      if (filter.sorts && filter.sorts.length > 0) {
        filter.sorts.forEach((sort, i) => {
          this.setParam(`${PARAM_SORT_NAME}[${i}][${sort.field}]`, sort.type);
        });
      }
    }
  }

  private setParam(key: string, value: string): void {
    this.params = this.params.set(key, value);
  }

  /**
   * Retorna los HttpParams generados
   * 
   * @example http://dominio.es/resource?filter[0][name]=John&filter[1][age]=30&sort[1][name]=ASC&page=1&pageSize=10
   * * Filtra por nombre y edad, ordena por nombre ascendente, pagina 1 con 10 resultados por pagina
   */
  getHttpParams(): HttpParams {
    return this.params;
  }
}
