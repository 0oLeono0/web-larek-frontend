import { IBasket } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { BasketData } from './BasketData';

export class Basket extends Component<IBasket> {
	protected counter: HTMLElement;
	protected totalPrice: HTMLElement;
	protected basketList: HTMLElement;
	protected basketButton: HTMLElement;

	constructor(
		protected container: HTMLElement,
		protected events: IEvents,
		protected basketData: BasketData
	) {
		super(container);
		this.counter = ensureElement<HTMLElement>('.header__basket-counter');
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', container);
		this.basketList = ensureElement<HTMLElement>('.basket__list', container);
		this.basketButton = ensureElement<HTMLElement>('.header__basket');

		this.basketButton.addEventListener('click', () => {
			this.events.emit('busket:open', { ids: this.items });
		});
	}

	set items(items: string[]) {
		this.counter.textContent = String(items.length);
	}

	get items(): string[] {
		return this.basketData.items;
	}

	set total(total: number) {
		this.totalPrice.textContent = `${total} синапсов`;
	}

	get busketList(): HTMLElement {
		return this.basketList;
	}

	getContainer(): HTMLElement {
		return this.container;
	}
}
