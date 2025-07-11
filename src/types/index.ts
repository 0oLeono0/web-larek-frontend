import { ApiPostMethods } from '../components/base/api';
import { IEvents } from '../components/base/events';
import { Modal } from '../components/common/Modal';

export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IUser {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface ICardData {
	items: ICard[];
	preview: string | null;
	getCard(cardId: string): ICard | undefined;
}

export interface IBasket {
	items: string[];
	total: number;
	addItem(id: string): void;
	removeItem(id: string): void;
}

export interface IUserData {
	getUserInfo(): IUser;
	setUserInfo(userData: IUser): void;
}

export interface IOrderPresenter {
	init(
		orderButton: HTMLElement,
		modal: Modal<IModalData>,
		events: IEvents
	): void;
}

export type TUserPay = Pick<IUser, 'payment' | 'address'>;
export type TUserEmail = Pick<IUser, 'email' | 'phone'>;
export type TUserInfo = Pick<IUser, 'email' | 'phone' | 'payment' | 'address'>;

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IModalData {
	modal: HTMLElement;
}

export interface IEventData {
	[key: string]: unknown;
}

export interface ICardEventData extends IEventData {
	cardId: string;
}

export interface IBasketEventData extends IEventData {
	ids: string[];
}

export interface IRemoveCardEventData extends IEventData {
	id: string;
}

export interface IOrderSuccessEventData extends IEventData {
	id: string;
	total: number;
}
