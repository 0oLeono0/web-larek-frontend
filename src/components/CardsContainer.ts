import { Component } from './base/Component';

interface ICardsContainer {
	catalog: HTMLElement[];
}

export class CardsContainer extends Component<ICardsContainer> {
	constructor(protected container: HTMLElement) {
		super(container);
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
