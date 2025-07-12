import { IEvents } from './base/events';
import { IOrder } from '../types';

export class UserData {
	protected _userInfo: IOrder = {
		payment: '',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	setUserInfo(data: Partial<IOrder>): void {
		if (data.email !== undefined) {
			this._userInfo.email = data.email.trim();
		}
		if (data.phone !== undefined) {
			this._userInfo.phone = data.phone.trim();
		}
		if (data.address !== undefined) {
			this._userInfo.address = data.address.trim();
		}
		if (data.payment !== undefined) {
			this._userInfo.payment = data.payment;
		}
		if (data.items !== undefined) {
			this._userInfo.items = data.items;
		}
		if (data.total !== undefined) {
			this._userInfo.total = data.total;
		}
		this.events.emit('user:change', this._userInfo);
	}

	getUserInfo(): IOrder {
		return { ...this._userInfo };
	}

	validateOrder(): { isValid: boolean; errorMessage: string } {
		const { address, payment } = this._userInfo;
		const isAddressValid = address && address.trim().length >= 3;
		const isPaymentValid = payment === 'online' || payment === 'cash';
		const result = {
			isValid: isAddressValid && isPaymentValid,
			errorMessage:
				!isAddressValid && !isPaymentValid
					? 'Пожалуйста, выберите способ оплаты и укажите адрес'
					: !isAddressValid
					? 'Пожалуйста, укажите корректный адрес (минимум 3 символа)'
					: !isPaymentValid
					? 'Пожалуйста, выберите способ оплаты'
					: '',
		};
		return result;
	}

	validateContacts(): { isValid: boolean; errorMessage: string } {
		const { email, phone } = this._userInfo;
		const isEmailValid = email && this.isValidEmail(email);
		const isPhoneValid = phone && phone.trim().length >= 5;
		const result = {
			isValid: isEmailValid && isPhoneValid,
			errorMessage:
				!isEmailValid && !isPhoneValid
					? 'Пожалуйста, укажите email и телефон'
					: !isEmailValid
					? 'Пожалуйста, укажите корректный email'
					: !isPhoneValid
					? 'Пожалуйста, укажите корректный телефон'
					: '',
		};
		return result;
	}

	protected isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email.trim());
	}
}
