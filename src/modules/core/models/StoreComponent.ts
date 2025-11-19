import type { Store } from "./Store";
import { Subscription } from "./Subscription";

export interface StoreComponentData<T> {
    id: string;
    value?: T;
}

export class StoreComponent<T> extends Subscription<T> {

    private id: string;

    private value?: T;

    private store: Store<T>;

    constructor(store: Store<T>, id: string, initialValue?: T) {
        super();

        this.id = id ?? crypto.randomUUID();
        this.store = store;
        this.value = initialValue;
    }

    emit() {
        super.emit(this.getValue());
    }

    setValue(value: T) {
        this.value = value;

        this.emit();
        this.store.emit();
    }

    getValue(): StoreComponentData<T> {
        return { id: this.id, value: this.value };
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