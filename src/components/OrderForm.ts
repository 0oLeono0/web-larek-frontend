import { Form, IFormValidationResult } from './Form';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { IOrder } from '../types';

export class OrderForm extends Form<IOrder> {
	protected paymentContainer: HTMLElement;
	protected addressInput: HTMLInputElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.paymentContainer = ensureElement<HTMLElement>(
			'.order__buttons',
			container
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);

		const paymentButtons =
			this.paymentContainer.querySelectorAll<HTMLButtonElement>(
				'[name="card"], [name="cash"]'
			);
		paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				paymentButtons.forEach((btn) =>
					btn.classList.remove('button_alt-active')
				);
				button.classList.add('button_alt-active');
				const paymentValue =
					button.getAttribute('name') === 'card' ? 'online' : 'cash';
				this.events.emit('form:order:change', { payment: paymentValue });
				this.events.emit('form:validate:order');
			});
		});

		this.addressInput.addEventListener('input', () => {
			const addressValue = this.addressInput.value.trim();
			this.events.emit('form:order:change', { address: addressValue });
			this.events.emit('form:validate:order');
		});

		this.submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			this.events.emit('order:email');
		});
	}

	updateFormValues(userData: IOrder): void {
		this.addressInput.value = userData.address || '';
		const paymentButtons =
			this.paymentContainer.querySelectorAll<HTMLButtonElement>(
				'[name="card"], [name="cash"]'
			);
		paymentButtons.forEach((btn) => btn.classList.remove('button_alt-active'));
		if (userData.payment) {
			const activeButton =
				this.paymentContainer.querySelector<HTMLButtonElement>(
					`[name="${userData.payment === 'online' ? 'card' : 'cash'}"]`
				);
			if (activeButton) {
				activeButton.classList.add('button_alt-active');
			}
		}
		this.events.emit('form:validate:order');
	}

	validate(validationResult: IFormValidationResult): void {
		this.setSubmitDisabled(!validationResult.isValid);
		this.setError(validationResult.errorMessage);
	}
}
