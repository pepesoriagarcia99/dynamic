export type SubscriberCallback<T> = (data: T) => void;

export interface Subscriber<T> {
    id: string;
    callback: SubscriberCallback<T>;
}

/**
 * Clase base para manejar suscripciones y emitir eventos
 */
export class Subject<T> {
    private subscribers: Subscriber<T>[] = [];

    constructor() { }

    /**
     * Emite los cambios a los suscriptores
     * 
     * @param value Valor a emitir
     */
    emit(value: T) {
        this.subscribers.forEach(subscriber => subscriber.callback(value));
    }

    /**
     * Suscribe una nueva función a los cambios del Subscription
     * 
     * @param callback Función a ejecutar cuando se emiten cambios
     * @returns Identificador de la suscripción
     */
    subscribe(callback: SubscriberCallback<T>): string {
        const subscribe = {
            id: crypto.randomUUID(),
            callback: callback
        }

        this.subscribers.push(subscribe);

        return subscribe.id;
    }

    /**
     * Elimina una suscripción
     * 
     * @param id Identificador de la suscripción a eliminar
     */
    unsubscribe(id: string): void {
        this.subscribers = this.subscribers.filter(sub => sub.id !== id);
    }

    /**
     * Elimina todas las suscripciones
     */
    clearSubscribers() {
        this.subscribers = [];
    }
}