import { ICard, ICardData } from '../types';
import { IEvents } from './base/events';

export class CardsData implements ICardData {
	protected _items: ICard[];
	protected _preview: string | null;

	constructor(protected events: IEvents) {
		this._items = [];
		this._preview = null;
	}

	set items(items: ICard[]) {
		this._items = items;
		this.notifyCardsChanged();
	}

	get items(): ICard[] {
		return this._items;
	}

	addCard(item: ICard) {
		this._items = [item, ...this._items];
		this.notifyCardsChanged();
	}

	getCard(cardId: string): ICard | undefined {
		return this._items.find((item) => item.id === cardId);
	}

	set preview(cardId: string | null) {
		if (!cardId) {
			this._preview = null;
			return;
		}
		if (this.getCard(cardId)) {
			this._preview = cardId;
			this.events.emit('card:selected');
		} else {
			throw new Error(`Card with ID ${cardId} not found`);
		}
	}

	get preview(): string | null {
		return this._preview;
	}

	private notifyCardsChanged() {
		this.events.emit('cards:changed');
	}
}
