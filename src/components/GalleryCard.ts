import { ICard } from '../types';
import { IEvents } from './base/events';
import { Card } from './Card';

export class GalleryCard extends Card {
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.container.addEventListener('click', () => {
			this.events.emit('card:open', { cardId: this.cardId });
		});
	}

	render(data: Partial<ICard>): HTMLElement {
		if (data.category) this.setCategory(data.category);
		return super.render(data);
	}
}
