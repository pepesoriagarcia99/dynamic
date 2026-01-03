import { StoreComponent, type StoreComponentData } from './StoreComponent';
import { Subject } from './Subject';

export interface StoreConfiguration {
  autoCommit: boolean; // Si es true emite cambios al Store automaticamente al cambiar un StoreComponent
}

/**
 * Clase base para manejar un Store que contiene múltiples StoreComponents
 */
export class Store<T> extends Subject<StoreComponentData<T>[]> {
  protected elements: StoreComponent<T>[] = [];

  #configuration: StoreConfiguration;

  constructor(configuration: StoreConfiguration = { autoCommit: true }) {
    super();
    this.#configuration = configuration;
  }

  /**
   * Emite los cambios en el store
   *
   * @param customEvent Evento personalizado para emitir
   */
  emit(customEvent?: any): void {
    const event = customEvent ?? this.elements.map((element) => element.getValue());
    super.emit(event);
  }

  /**
   * Agrega un nuevo componente al store
   *
   * @param key Clave
   * @param initialValue Valor inicial
   * @returns Componente de store creado
   */
  add(key: string, initialValue: T | null): StoreComponent<T> {
    const configuration = { autoCommit: this.#configuration.autoCommit };
    const storeComponent = new StoreComponent(this, configuration, key, initialValue);
    this.elements.push(storeComponent);
    console.log("🚀 ~ Store ~ add ~ this.elements:", this.elements)
    return storeComponent;
  }

  /**
   * Rescata un componente del store por su clave
   * @param key 
   * @returns  Componente de store o undefined si no existe
   */
  get(key: string): StoreComponent<T> | undefined {
    return this.elements.find((el) => el.key === key);
  }

  /**
   * Vacia todos los valores
   */
  clear() {
    this.elements.forEach((el) => el.setValue(null));
    this.emit();
  }

  /**
   * Recupera el estado actual de la Store
   * @returns Lista de StoreComponentData
   */
  state(): StoreComponentData<T>[] {
    return this.elements.map(el => el.getValue());
  }

  /**
   * Total de elementos con valor no nulo
   * @returns Número de elementos con valor no nulo
   */
  count(): number {
    return this.state().filter(el => !!el.value).length;
  }

  /**
   * Indica si hay al menos un elemento con valor no nulo
   * @returns Indica si hay al menos un elemento con valor no nulo
   */
  has(): boolean {
    return this.count() > 0;
  }
}
