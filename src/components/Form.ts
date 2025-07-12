import { Component } from './base/Component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

export interface IFormValidationResult {
	isValid: boolean;
	errorMessage: string;
}

export abstract class Form<T> extends Component<T> {
	protected submitButton: HTMLButtonElement;
	protected errorElement: HTMLSpanElement;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			container
		);
		this.errorElement = ensureElement<HTMLSpanElement>(
			'.form__errors',
			container
		);
	}

	setError(message: string) {
		this.errorElement.textContent = message;
	}

	setSubmitDisabled(disabled: boolean) {
		this.submitButton.disabled = disabled;
	}

	getContainer(): HTMLElement {
		return this.container;
	}

	abstract validate(validationResult: IFormValidationResult): void;
}
