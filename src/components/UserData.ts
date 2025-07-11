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
			if (data.email && !this.isValidEmail(data.email)) {
				throw new Error('Invalid email format');
			}
			this._userInfo.email = data.email;
		}
		if (data.phone !== undefined) {
			this._userInfo.phone = data.phone;
		}
		if (data.address !== undefined) {
			this._userInfo.address = data.address;
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

	protected isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}
}
