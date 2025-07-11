import {
	IApi,
	ICardData,
	ICard,
	IOrder,
	IOrderSuccessEventData,
} from '../types';
import { Api, ApiPostMethods } from './base/api';

export class AppApi implements IApi {
	readonly baseUrl: string;

	constructor(protected api: Api) {
		this.baseUrl = api.baseUrl;
	}

	get<T>(uri: string): Promise<T> {
		return this.api.get<T>(uri);
	}

	post<T>(
		uri: string,
		data: object,
		method: ApiPostMethods = 'POST'
	): Promise<T> {
		return this.api.post<T>(uri, data, method);
	}

	getCards(): Promise<ICardData> {
		return this.get<ICardData>('/product');
	}

	getCard(id: string): Promise<ICard> {
		return this.get<ICard>(`/product/${id}`);
	}

	orderCards(order: IOrder): Promise<IOrderSuccessEventData> {
		return this.post<IOrderSuccessEventData>('/order', order, 'POST');
	}
}
