import { StoreComponent } from "./StoreComponent";
import { Subscription } from "./Subscription";



export class Store<T> extends Subscription<T> {

    private elements: StoreComponent<T>[] = [];

    constructor() {
        super();
    }

    emit() {
        super.emit(this.elements.map(element => element.getValue()));
    }

    add(id: string, initialValue?: T): StoreComponent<T> {
        const storeComponent = new StoreComponent(this, id, initialValue);
        this.elements.push(storeComponent);
        return storeComponent;
    }

    // clear(): void {
    //     this.elements = [];
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
}