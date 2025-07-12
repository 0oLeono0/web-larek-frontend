import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IBasket } from '../types';
import { BasketData } from './BasketData';

export class Basket extends Component<IBasket> {
	protected counter: HTMLElement;
	protected totalPrice: HTMLElement;
	protected basketList: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents, basketData: BasketData) {
		super(container);
		this.events = events;
		this.counter = ensureElement<HTMLElement>('.header__basket-counter');
		this.totalPrice = ensureElement<HTMLElement>('.basket__price', container);
		this.basketList = ensureElement<HTMLElement>('.basket__list', container);
		this.basketButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			container
		);

		const headerBasketButton =
			ensureElement<HTMLButtonElement>('.header__basket');
		headerBasketButton.addEventListener('click', () => {
			this.events.emit('busket:open', { ids: basketData.items });
		});

		this.basketButton.addEventListener('click', () => {
			if (basketData.items.length > 0) {
				this.events.emit('order:open');
			}
		});
	}

	set items(items: string[]) {
		this.counter.textContent = String(items.length);
		this.basketButton.disabled = items.length === 0;
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
