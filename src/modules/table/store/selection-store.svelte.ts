import { Store } from "../../core/models/Store";
import type { TableConfiguration } from "../models/configuration/TableConfiguration";
import type { EventContext, RowEvent } from "../models/TableEvents";


/**
 * Store para gestionar la seleccion de filas en la tabla
 */
class SelectionStore extends Store<boolean> {

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
    const key = event.row.__key;

    this.elements.forEach(el => {
      if (el.key === key) {
        el.setValue(!el.value);
      } else if (el.value === true) {
        el.setValue(false);
      }
    });
  }

  /**
 * Sistema de seleccion multiple (varias filas)
 * @param key 
 */
  private multipleSelect(event: RowEvent) {
    const key = event.row.__key;
    const eventContext: EventContext = event.ctx;

    if (eventContext.SHIFT && eventContext.CTRL) {
      /**
       * TODO: Implementar seleccion multiple con SHIFT + CTRL
       */
    } else if (eventContext.CTRL) {
      this.elements.forEach(el => {
        if (el.key === key) {
          el.setValue(!el.value);
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
    const event = this.elements.filter(element => element.value);
    super.emit(event.map(element => element.getValue()));
  }
}

export const selectionStore = new SelectionStore();
