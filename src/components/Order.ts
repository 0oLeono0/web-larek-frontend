import { IOrder, IOrderPresenter, IModalData } from '../types';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { AppApi } from './AppApi';
import { Component } from './base/Component';
import { IEvents } from './base/events';
import { BasketData } from './BasketData';
import { Modal } from './common/Modal';
import { UserData } from './UserData';

export class OrderPresenter
	extends Component<IOrder>
	implements IOrderPresenter
{
	protected paymentContainer: HTMLElement;
	protected addressInput: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected modalContent: HTMLElement;
	protected nextButton: HTMLButtonElement;
	protected modal: Modal<IModalData>;
	protected errorElement: HTMLSpanElement;

	constructor(
		protected api: AppApi,
		protected userData: UserData,
		protected basketData: BasketData,
		protected events: IEvents
	) {
		super(document.createElement('div'));
	}

	init(
		orderButton: HTMLElement,
		modal: Modal<IModalData>,
		events: IEvents
	): void {
		this.modal = modal;
		this.events = events;
		orderButton.addEventListener('click', () => {
			this.events.emit('order:open');
		});

		this.events.on('order:open', () => {
			this.setupOrderForm();
		});

		this.events.on('order:email', () => {
			this.setupEmailForm();
		});
	}

	private async setupOrderForm() {
		const template = ensureElement<HTMLTemplateElement>('#order');
		this.modalContent = cloneTemplate(template);
		this.paymentContainer = ensureElement<HTMLElement>(
			'.order__buttons',
			this.modalContent
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.modalContent
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			this.modalContent
		);
		this.errorElement = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.modalContent
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
				try {
					this.userData.setUserInfo({ payment: paymentValue });
					this.errorElement.textContent = '';
				} catch (error) {
					this.errorElement.textContent = (error as Error).message;
				}
				this.validateForm();
			});
		});

		this.addressInput.addEventListener('input', () => {
			try {
				this.userData.setUserInfo({ address: this.addressInput.value });
				this.errorElement.textContent = '';
			} catch (error) {
				this.errorElement.textContent = (error as Error).message;
			}
			this.validateForm();
		});

		this.submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			const { address, payment } = this.userData.getUserInfo();
			if (address && payment) {
				this.events.emit('order:email');
				this.errorElement.textContent = '';
			} else {
				this.errorElement.textContent = this.getErrorMessage(address, payment);
			}
		});

		this.validateForm();

		this.modal.render({ modal: this.modalContent });
		this.modal.open();
	}

	private validateForm() {
		const { address, payment } = this.userData.getUserInfo();
		this.submitButton.disabled = !address || !payment;
		this.errorElement.textContent = this.submitButton.disabled
			? this.getErrorMessage(address, payment)
			: '';
	}

	private getErrorMessage(address: string, payment: string): string {
		if (!address && !payment) {
			return 'Пожалуйста, выберите способ оплаты и укажите адрес';
		} else if (!address) {
			return 'Пожалуйста, укажите адрес';
		} else if (!payment) {
			return 'Пожалуйста, выберите способ оплаты';
		}
		return '';
	}

	private async setupEmailForm() {
		const template = ensureElement<HTMLTemplateElement>('#contacts');
		this.modalContent = cloneTemplate(template);
		const emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.modalContent
		);
		const phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.modalContent
		);
		this.nextButton = ensureElement<HTMLButtonElement>(
			'.button[type="submit"]',
			this.modalContent
		);
		this.errorElement = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.modalContent
		);

		emailInput.addEventListener('input', () => {
			try {
				this.userData.setUserInfo({ email: emailInput.value });
				this.errorElement.textContent = '';
			} catch (error) {
				this.errorElement.textContent = (error as Error).message;
			}
			this.validateEmailForm();
		});

		phoneInput.addEventListener('input', () => {
			try {
				this.userData.setUserInfo({ phone: phoneInput.value });
				this.errorElement.textContent = '';
			} catch (error) {
				this.errorElement.textContent = (error as Error).message;
			}
			this.validateEmailForm();
		});

		this.nextButton.addEventListener('click', (event) => {
			event.preventDefault();
			const { email, phone } = this.userData.getUserInfo();
			if (email && phone) {
				this.submitOrder();
				this.errorElement.textContent = '';
			} else {
				this.errorElement.textContent = this.getEmailFormErrorMessage(
					email,
					phone
				);
			}
		});

		this.validateEmailForm();

		this.modal.render({ modal: this.modalContent });
		this.modal.open();
	}

	private validateEmailForm() {
		const { email, phone } = this.userData.getUserInfo();
		this.nextButton.disabled = !email || !phone;
		this.errorElement.textContent = this.nextButton.disabled
			? this.getEmailFormErrorMessage(email, phone)
			: '';
	}

	private getEmailFormErrorMessage(email: string, phone: string): string {
		if (!email && !phone) {
			return 'Пожалуйста, укажите email и телефон';
		} else if (!email) {
			return 'Пожалуйста, укажите email';
		} else if (!phone) {
			return 'Пожалуйста, укажите телефон';
		}
		return '';
	}

	private async submitOrder() {
		const order: IOrder = {
			...this.userData.getUserInfo(),
			items: this.basketData.items,
			total: this.basketData.total,
		};
		try {
			const response = await this.api.orderCards(order);
			this.events.emit('order:success', response);
		} catch (error) {
			console.error('Failed to submit order:', error);
			this.errorElement.textContent =
				'Ошибка при отправке заказа. Попробуйте снова.';
		}
	}
}
