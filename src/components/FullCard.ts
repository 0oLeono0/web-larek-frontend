import { ICard } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Card } from './Card';

export class FullCard extends Card {
	protected cardText: HTMLParagraphElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.cardText = ensureElement<HTMLParagraphElement>(
			'.card__text',
			container
		);
		const button = ensureElement<HTMLButtonElement>('.card__button', container);
		button.addEventListener('click', () => {
			this.events.emit('busket:add', { cardId: this.cardId });
		});
	}

	set description(description: string) {
		this.cardText.textContent = description;
	}

	render(data: Partial<ICard>): HTMLElement {
		if (data.category) this.setCategory(data.category);
		return super.render(data);
	}
}
