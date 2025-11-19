import type { StoreComponentData } from "./StoreComponent";

export interface Subscriber<T> {
    id: string;
    callback: (data: StoreComponentData<T | T[]>) => void;
}


export class Subscription<T> {
    private subscribers: Subscriber<T>[] = [];

    constructor() { }

    emit(value: any) {
        this.subscribers.forEach(subscriber => subscriber.callback(value));
    }

    subscribe(callback: (value: any) => void): string {
        const subscribe = {
            id: crypto.randomUUID(),
            callback: callback
        }

        this.subscribers.push(subscribe);

        return subscribe.id;
    }

    unsubscribe(id: string): void {
        this.subscribers = this.subscribers.filter(sub => sub.id !== id);
    }

    clearSubscribers() {
        this.subscribers = [];
    }
}