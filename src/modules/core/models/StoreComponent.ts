import type { Store } from "./Store";
import { Subscription } from "./Subscription";

export interface StoreComponentData<T> {
    key: string;
    value: T | null;
}

export interface StoreComponentConfiguration {
    autoCommit: boolean; // Configuracion heredada del Store
}

/**
 * Componente de un Store que maneja su propio estado y notifica cambios
 */
export class StoreComponent<T> extends Subscription<StoreComponentData<T>> {

    key: string;

    value: T | null;

    #store: Store<T>;

    #configuration: StoreComponentConfiguration;

    constructor(store: Store<T>, configuration: StoreComponentConfiguration, key: string, initialValue: T | null) {
        super();

        this.#store = store;
        this.#configuration = configuration;

        this.key = key;
        this.value = initialValue;
    }

    /**
     * Emite los cambios del componente
     */
    emit() {
        super.emit(this.getValue());
    }

    /**
     * Establece el valor del componente
     * * Emite los cambios en el componente y en el store
     * @param value Valor a establecer
     */
    setValue(value: T | null) {
        this.value = value;

        this.emit();
        if(this.#configuration.autoCommit) {
            this.#store.emit();
        }
    }

    /**
     * Obtiene el valor del componente
     * @returns Datos del componente de store
     */
    getValue(): StoreComponentData<T> {
        return { key: this.key, value: this.value };
    }


    // emit() {
    //     this.subscribers.forEach(subscriber => subscriber.callback({ id: this.id, value: this.value }));
    // }

    // subscribe(callback: (value: any) => void): string {
    //     const subscribe = {
    //         id: crypto.randomUUID(),
    //         callback: callback
    //     }

    //     this.subscribers.push(subscribe);

    //     return subscribe.id;
    // }

    // unsubscribe(id: string): void {
    //     this.subscribers = this.subscribers.filter(sub => sub.id !== id);
    // }

    // clearSubscribers() {
    //     this.subscribers = [];
    // }
}