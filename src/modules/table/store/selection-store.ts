import { Store } from '../../core/models/Store';
import type { TableConfiguration } from '../models/configuration/TableConfiguration';
import type { EventContext, RowEvent } from '../models/event/RowEvent';
import type { RowData } from '../models/RowData';

/**
 * Store para gestionar la seleccion de filas en la tabla
 */
class SelectionStore extends Store<RowData> {
  private configuration?: TableConfiguration;

  constructor() {
    super({ autoCommit: false });
  }

  init(configuration: TableConfiguration) {
    this.configuration = configuration;
  }

  /**
   * Sistema de seleccion simple (una sola fila)
   * @param key
   */
  private simpleSelect(event: RowEvent) {
    const key = event.row[this.configuration!.primaryKey!];

    this.elements.forEach((el) => {
      if (el.key === key) {
        const state = el.value?.__ctx.isSelected ?? false;
        el.value!.__ctx.isSelected = !state;
        el.setValue(el.value);
      } else if (el.value?.__ctx.isSelected === true) {
        el.value!.__ctx.isSelected = false;
        el.setValue(el.value);
      }
    });
  }

  /**
   * Sistema de seleccion multiple (varias filas)
   * @param key
   */
  private multipleSelect(event: RowEvent) {
    const key = event.row[this.configuration!.primaryKey!];
    const eventContext: EventContext = event.ctx;

    if (eventContext.SHIFT && eventContext.CTRL) {
      /**
       * TODO: Implementar seleccion multiple con SHIFT + CTRL
       */
    } else if (eventContext.CTRL) {
      this.elements.forEach((el) => {
        if (el.key === key) {
          const state = el.value?.__ctx.isSelected ?? false;
          el.value!.__ctx.isSelected = !state;
          el.setValue(el.value);
        }
      });
    } else {
      this.simpleSelect(event);
    }
  }

  /**
   * Maneja el evento de toggle de seleccion de fila
   *
   * @param event Evento de fila
   */
  onSelectToggle(event: RowEvent) {
    if (this.configuration!.selectableType === 'single') {
      this.simpleSelect(event);
    } else if (this.configuration!.selectableType === 'multiple') {
      this.multipleSelect(event);
    }

    this.emit();
  }

  /**
   * Emite cambios en la seleccion
   * @override
   */
  emit() {
    super.emit(
      this.elements.filter((element) => element.value?.__ctx.isSelected === true).map((element) => element.getValue())
    );
  }
}

export const selectionStore = new SelectionStore();
