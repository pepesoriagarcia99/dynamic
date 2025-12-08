import { Component, Input, Output, signal, Signal, TemplateRef, ViewChild } from '@angular/core';
import moment from 'moment';

import { Column, ColumnDateConfiguration } from '../../model/Column';
import { FilterEvent } from '../../model/FilterEvent';
import { DEFAULT_DATE_FORMAT, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS } from '../../constant';
import { Subject } from 'rxjs';
import { Table } from 'primeng/table';

interface InternalColumn extends Column {
  strType: string;
}

@Component({
  selector: 'main-table',
  templateUrl: './main-table.html',
  styleUrls: ['./main-table.scss'],
  standalone: false
})
export class MainTable {
  @ViewChild('dt') dt!: Table;

  /**
   * Clave unica de los datos
   * * Es requerida para la seleccion de filas
   *
   * @Optional
   */
  @Input() dataKey?: string;

  /**
   * Columnas de la tabla
   * @Required
   */
  @Input() columns!: Column[];

  /**
   * Datos a mostrar en la tabla
   * @Required
   */
  @Input() data!: any[];

  /**
   * Indica si la tabla esta en estado de carga
   * @Optional
   */
  @Input() loading: Signal<boolean> = signal(false);

  /**
   * Cantidad total de registros (para paginación)
   * @Optional
   */
  @Input() count: number = 0;

  /**
   * Template para detalle de fila
   * @Optional
   */
  @Input() detail: TemplateRef<any> | null = null;

  /**
   * Configuraciones
   */
  @Input() isPageable: boolean = false; // Activa la paginacion

  @Input() pageSizeOptions?: number[];

  @Input() isSortable: boolean = false; // Activa el ordenamiento

  @Input() isFilterable: boolean = false; // Activa los filtros

  @Input() isSelectable: boolean = false; // Activa la seleccion de filas

  @Input() isAllSelectable: boolean = false; // Activa la seleccion de todas las filas

  /**
   * Eventos
   */

  @Output() pageChange: Subject<FilterEvent> = new Subject<FilterEvent>();

  @Output() sortChange: Subject<FilterEvent> = new Subject<FilterEvent>();

  @Output() filterChange: Subject<FilterEvent> = new Subject<FilterEvent>();

  @Output() selectionChange: Subject<any[]> = new Subject<any[]>();

  @Output() selectionChangeSingle: Subject<any> = new Subject<any>();

  dataSkeleton: any[] = Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => `Item #${i}`);

  displayedColumns: InternalColumn[] = [];

  globalFilterFields: string[] = [];

  currentFilter: FilterEvent = {};

  selectionMode?: 'single' | 'multiple';

  selection?: Array<any>;

  constructor() {}

  ngOnInit() {
    // es obligatorio recibir columnas
    if (!this.columns || this.columns.length === 0) {
      throw new Error('Table: Se deben proveer columnas para la tabla');
    }

    //configuracion de paginacion
    if (this.isPageable) {
      if (!this.pageSizeOptions) {
        this.pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS;
      }

      this.currentFilter.page = 1;
      this.currentFilter.pageSize = DEFAULT_PAGE_SIZE;
    }

    // configuracion de ordenamiento
    if (this.isSortable) {
      this.currentFilter.sorts = [];
    }

    // configuracion de filtros
    if (this.isFilterable) {
      this.currentFilter.filters = [];
    }

    // validaciones de la configuracion de seleccion
    if (this.isSelectable) {
      if (!this.dataKey) {
        throw new Error('Table: dataKey es requerido cuando isSelectable es true');
      }

      this.selectionMode = 'single';
      this.selection = []; // si activa la seleccion, inicializo el modelo
    }

    if (this.isAllSelectable) {
      if (!this.isSelectable) {
        throw new Error('Table: isAllSelectable requiere que isSelectable sea true');
      }

      this.selectionMode = 'multiple';
    }

    this.configureColumns();
  }

  private configureColumns() {
    this.displayedColumns = this.columns.map((col) => {
      console.log(col.type);

      const strType = typeof col.type === 'function' ? (col.type as Function).name : col.type.constructor.name;
      const column: InternalColumn = {
        ...col,
        strType
      };

      if (col?.style && !col.style['width']) {
        col.style['width'] = 'auto';
      }

      if (!col.style) {
        col.style = {};
      }

      if (this.isFilterable && col.filterable) {
        this.globalFilterFields.push(col.key);
      }

      console.log('🚀 ~ MainTable ~ configureColumns ~ column:', column);
      return column;
    });
  }

  /**
   * Obtiene la clave de un campo, eliminando el sufijo.
   *
   * @param key
   * @returns
   */
  private getKey(key: string) {
    return key.replace(/_\d+$/, '');
  }

  /**
   * Obtiene el valor de una celda en la fila actual.
   * * Permite acceder a propiedades anidadas utilizando notación de puntos. (ejemplo: "direccion.ciudad")
   *
   * @param column Columna actual
   * @param data Fila de datos
   * @returns Valor de la celda
   */
  getValue(column: Column, element: any): string {
    let value;
    let keys = column.key.split('.');

    if (keys.length > 1) {
      let currentValue = element;
      for (const key of keys) {
        currentValue = currentValue[this.getKey(key)];
      }

      value = currentValue;
    } else {
      value = element[this.getKey(column.key)];
    }

    if (column.type === Date) {
      return moment(element[column.key]).format(
        (column.configuration as ColumnDateConfiguration)?.format ?? DEFAULT_DATE_FORMAT
      );
    } else if (column.type === Array) {
      return value?.join(', ');
    }

    return element[column.key];
  }

  /**
   * Evento de cambio en la tabla de NgPrime
   * @param event
   */
  onLazyLoad(event: any) {
    console.log('🚀 ~ MainTable ~ onLazyLoad ~ event:', event);
  }

  /**
   * Emite un evento de seleccion de fila
   * @param event
   */
  onRowSelect(event: any) {
    this.selectionChangeSingle.next({
      type: 'select',
      data: event.data
    });

    this.onSelectionChange();
  }

  /**
   * Emite un evento de deseleccion de fila
   * @param event
   */
  onRowUnselect(event: any) {
    this.selectionChangeSingle.next({
      type: 'unselect',
      data: event.data
    });

    this.onSelectionChange();
  }

  /**
   * Emite el cambio en la seleccion de filas
   */
  onSelectionChange() {
    this.selectionChange.next(this.selection!);
  }

  // onSort(event: any) {
  //   if (this.isSorted == null || this.isSorted === undefined) {
  //     this.isSorted = true;
  //     this.sortTableData(event);
  //   } else if (this.isSorted == true) {
  //     this.isSorted = false;
  //     this.sortTableData(event);
  //   } else if (this.isSorted == false) {
  //     this.isSorted = null;
  //     this.products = [...this.initialValue];
  //     this.dt.reset();
  //   }
  // }

  // customSort(event: SortEvent) {
  //   if (this.isSorted == null || this.isSorted === undefined) {
  //     this.isSorted = true;
  //     this.sortTableData(event);
  //   } else if (this.isSorted == true) {
  //     this.isSorted = false;
  //     this.sortTableData(event);
  //   } else if (this.isSorted == false) {
  //     this.isSorted = null;
  //     this.products = [...this.initialValue];
  //     this.dt.reset();
  //   }
  // }

  // sortTableData(event: any) {
  // event.data.sort((data1, data2) => {
  //   let value1 = data1[event.field];
  //   let value2 = data2[event.field];
  //   let result = null;
  //   if (value1 == null && value2 != null) result = -1;
  //   else if (value1 != null && value2 == null) result = 1;
  //   else if (value1 == null && value2 == null) result = 0;
  //   else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
  //   else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

  //   return event.order * result;
  // });
  // }
  private sortStates: { [field: string]: 'asc' | 'desc' | null } = {};

  /**
   * Maneja el ordenamiento personalizado con 3 estados
   */
  onSort(event: any) {
    console.log('🚀 ~ MainTable ~ onSort ~ event:', event);
    const field = event.field;
    const currentState = this.sortStates[field] || null;

    // Ciclo de 3 estados: null -> asc -> desc -> null
    switch (currentState) {
      case null:
        this.sortStates[field] = 'asc';
        event.order = 1;
        break;
      case 'asc':
        this.sortStates[field] = 'desc';
        event.order = -1;
        break;
      case 'desc':
        this.sortStates[field] = null;
        event.order = 0; // Sin ordenamiento
        delete this.sortStates[field];

        // Limpiar el estado de ordenamiento visual
        if (this.dt) {
          this.dt.sortField = null;
          this.dt.sortOrder = 0;
          this.dt._sortField = null;
          this.dt._sortOrder = 0;
        }
        break;
    }

    console.log('🚀 ~ Sort state for', field, ':', this.sortStates[field]);

    // Actualizar currentFilter con los ordenamientos activos
    // this.currentFilter.sorts = Object.keys(this.sortStates).map((key) => ({
    //   field: key,
    //   order: this.sortStates[key]!
    // }));

    // Emitir evento de cambio de ordenamiento
    // this.sortChange.next(this.currentFilter);

    // Para lazy loading, no necesitamos ordenar los datos aquí
    if (!event.data) {
      return;
    }

    // Solo si no es lazy loading, ordenar localmente
    // if (event.order === 0) {
    //   // Restaurar orden original - recargar datos sin ordenamiento
    //   this.onLazyLoad({
    //     first: 0,
    //     rows: this.currentFilter.pageSize || DEFAULT_PAGE_SIZE
    //   });
    //   return;
    // }
  }

  getSeverity(column: Column, element: any): any {
    const config = column.configuration;

    if (config?.showValueInRangeColor) {
      const value = this.getValue(column, element);
      const range = config.showValueInRangeColor.find((r) => r.value === value);
      return range?.severity;
    }
  }
}
