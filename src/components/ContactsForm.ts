import { Form, IFormValidationResult } from './Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IOrder } from '../types';

export class ContactsForm extends Form<IOrder> {
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);

		this.emailInput.addEventListener('input', () => {
			const emailValue = this.emailInput.value.trim();
			this.events.emit('form:contacts:change', { email: emailValue });
			this.events.emit('form:validate:contacts');
		});

		this.phoneInput.addEventListener('input', () => {
			const phoneValue = this.phoneInput.value.trim();
			this.events.emit('form:contacts:change', { phone: phoneValue });
			this.events.emit('form:validate:contacts');
		});

		this.submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.events.emit('order:submit');
		});
	}

	updateFormValues(userData: IOrder): void {
		this.emailInput.value = userData.email || '';
		this.phoneInput.value = userData.phone || '';
		this.events.emit('form:validate:contacts');
	}

	validate(validationResult: IFormValidationResult): void {
		this.setSubmitDisabled(!validationResult.isValid);
		this.setError(validationResult.errorMessage);
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim());
	}
}
