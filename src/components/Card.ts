import { ICard } from '../types';
import { CDN_URL } from '../utils/constants';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

export abstract class Card extends Component<ICard> {
	protected cardId: string;
	protected cardCategory?: HTMLSpanElement; // Сделано опциональным
	protected cardTitle: HTMLElement;
	protected cardImage: HTMLImageElement;
	protected cardPrice: HTMLSpanElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		// Проверяем наличие элементов, если их нет — не инициализируем
		this.cardCategory = container.querySelector('.card__category');
		this.cardTitle = ensureElement<HTMLElement>('.card__title', container);
		this.cardImage = ensureElement<HTMLImageElement>('.card__image', container);
		this.cardPrice = ensureElement<HTMLSpanElement>('.card__price', container);
	}

	protected setCategory(category: string) {
		if (this.cardCategory) {
			const categoryClasses: Record<string, string> = {
				'софт-скил': 'card__category_soft',
				другое: 'card__category_other',
				дополнительное: 'card__category_additional',
				кнопка: 'card__category_button',
				'хард-скил': 'card__category_hard',
			};
			this.cardCategory.textContent = category;
			this.cardCategory.classList.add(categoryClasses[category] || '');
		}
	}

	set id(id: string) {
		this.cardId = id;
	}

	get id(): string {
		return this.cardId;
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
	}

	set image(image: string) {
		this.cardImage.src = `${CDN_URL}${image}`;
	}

	set price(price: number | null) {
		this.cardPrice.textContent =
			price === null ? '0 синапсов' : `${price} синапсов`;
	}

	removeCard() {
		this.container.remove();
		this.container = null;
	}
}
