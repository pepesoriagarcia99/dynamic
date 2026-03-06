

/**
 * Global form values state
 */
/**
 * Patrón Mediator para comunicación entre Artifacts
 * Gestiona el estado compartido y notifica cambios a todos los artifacts suscritos
 */

export interface GlobalValue {
  columnName: string;
  value: any;
  artifactId: string;
}

export type GlobalValueListener = (change: GlobalValue) => void;

export class GlobalValueMediator {
  private values: Map<string, any> = new Map();
  private listeners: Map<string, GlobalValueListener[]> = new Map();

  constructor(initialValues?: Map<string, any>) { 
    if (initialValues) {
      this.values = new Map(initialValues);
    }
  }

  /**
   * Registra un artifact para escuchar cambios
   */
  public subscribe(artifactId: string, listener: GlobalValueListener): void {
    if (!this.listeners.has(artifactId)) {
      this.listeners.set(artifactId, []);
    }
    this.listeners.get(artifactId)!.push(listener);
  }

  /**
   * Desregistra un artifact
   */
  public unsubscribe(artifactId: string): void {
    this.listeners.delete(artifactId);
  }

  /**
   * Notifica un cambio de valor desde un artifact
   */
  public notifyChange(change: GlobalValue): void {
    // Actualiza el valor en el mediador
    this.values.set(change.columnName, change.value);

    // Notifica a todos los listeners excepto al que emitió el cambio
    this.listeners.forEach((listeners, listenerId) => {
      if (listenerId !== change.artifactId) {
        listeners.forEach(listener => listener(change));
      }
    });
  }

  /**
   * Obtiene el valor actual de una columna
   */
  public getValue(columnName: string): any {
    return this.values.get(columnName);
  }

  /**
   * Obtiene todos los valores actuales
   */
  public getAllValues(): Record<string, any> {
    const result: Record<string, any> = {};
    this.values.forEach((value, columnName) => {
      result[columnName] = value;
    });
    return result;
  }

  // /**
  //  * Establece múltiples valores iniciales
  //  */
  // public setInitialValues(values: Record<string, any>): void {
  //   Object.entries(values).forEach(([columnName, value]) => {
  //     this.values.set(columnName, value);
  //   });
  // }
}




// Change state


