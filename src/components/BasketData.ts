import { IBasket } from "../types";
import { IEvents } from "./base/events";

export class BasketData implements IBasket {
	protected _items: string[];
	protected _total: number;

	constructor(protected events: IEvents) {
		this._items = [];
		this._total = 0;
	}

	set items(items: string[]) {
		this._items = items;
		this.notifyBasketChanged();
	}

	get items(): string[] {
		return this._items;
	}

	set total(total: number) {
		this._total = Math.max(0, total);
		this.notifyBasketChanged();
	}

	get total(): number {
		return this._total;
	}

	addItem(id: string): void {
		if (!this._items.includes(id)) {
			this._items = [...this._items, id];
			this.notifyBasketChanged();
		}
	}

	removeItem(id: string): void {
		this._items = this._items.filter((item) => item !== id);
		this.notifyBasketChanged();
	}

	private notifyBasketChanged() {
		this.events.emit('basket:changed', { ids: this._items });
	}
}
