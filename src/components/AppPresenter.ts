import {
	IModalData,
	ICardEventData,
	IBasketEventData,
	IRemoveCardEventData,
	IOrderSuccessEventData,
} from '../types';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { AppApi } from './AppApi';
import { IEvents } from './base/events';
import { Basket } from './Basket';
import { BasketData } from './BasketData';
import { CardsContainer } from './CardsContainer';
import { Modal } from './common/Modal';
import { CompactCard } from './CompactCard';
import { FullCard } from './FullCard';
import { GalleryCard } from './GalleryCard';

export class AppPresenter {
	private cardTemplate: HTMLTemplateElement;
	private cardPreviewTemplate: HTMLTemplateElement;
	private cardBasketTemplate: HTMLTemplateElement;
	private basketTemplate: HTMLTemplateElement;
	private successTemplate: HTMLTemplateElement;

	constructor(
		private api: AppApi,
		private cardsContainer: CardsContainer,
		private modal: Modal<IModalData>,
		private basket: Basket,
		private basketData: BasketData,
		private events: IEvents
	) {
		this.cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
		this.cardPreviewTemplate =
			ensureElement<HTMLTemplateElement>('#card-preview');
		this.cardBasketTemplate =
			ensureElement<HTMLTemplateElement>('#card-basket');
		this.basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
		this.successTemplate = ensureElement<HTMLTemplateElement>('#success');
		this.init();
	}

	private async init() {
		const { items } = await this.api.getCards();
		const cardsArray = items.map((card) => {
			const cardInstance = new GalleryCard(
				cloneTemplate(this.cardTemplate),
				this.events
			);
			return cardInstance.render(card);
		});
		this.cardsContainer.render({ catalog: cardsArray });

		this.events.on('card:open', (data: ICardEventData) => {
			this.api.getCard(data.cardId).then((card) => {
				const cardInstance = new FullCard(
					cloneTemplate(this.cardPreviewTemplate),
					this.events
				);
				const cardFull = cardInstance.render(card);
				this.modal.render({ modal: cardFull });
				this.modal.open();
			});
		});

		this.events.on('busket:add', async (data: ICardEventData) => {
			const card = await this.api.getCard(data.cardId);
			this.basketData.addItem(data.cardId);
			this.basketData.total += card.price || 0;
			this.basket.items = this.basketData.items;
			this.basket.total = this.basketData.total;
		});

		this.events.on('busket:open', (data: IBasketEventData) => {
			this.renderBasket(data.ids || []);
		});

		this.events.on('card:remove', async (data: IRemoveCardEventData) => {
			const card = await this.api.getCard(data.id);
			this.basketData.removeItem(data.id);
			this.basketData.total -= card.price || 0;
			this.basket.items = this.basketData.items;
			this.basket.total = this.basketData.total;
			if (this.modal.isOpen()) {
				this.renderBasket(this.basketData.items);
			}
		});

		this.events.on('order:success', (data: IOrderSuccessEventData) => {
			const successContent = cloneTemplate(this.successTemplate);
			const description = ensureElement<HTMLParagraphElement>(
				'.order-success__description',
				successContent
			);
			description.textContent = `Списано ${data.total} синапсов`;
			const closeButton = ensureElement<HTMLButtonElement>(
				'.order-success__close',
				successContent
			);
			closeButton.addEventListener('click', () => {
				this.modal.close();
			});
			this.modal.render({ modal: successContent });
			this.modal.open();
			this.basketData.items = [];
			this.basketData.total = 0;
			this.basket.items = [];
			this.basket.total = 0;
		});
	}

	private async renderBasket(ids: string[]) {
		let cardIndex = 1;
		const cardsPromises = ids.map(async (id) => {
			const card = await this.api.getCard(id);
			const cardInstance = new CompactCard(
				cloneTemplate(this.cardBasketTemplate),
				this.events
			);
			cardInstance.cardIndex = cardIndex++;
			return cardInstance.render(card);
		});
		const cardsArray = ids.length ? await Promise.all(cardsPromises) : [];
		const basketList = this.basket.busketList;
		const basketContainer = new CardsContainer(basketList);
		basketContainer.render({ catalog: cardsArray });
		this.modal.render({ modal: this.basket.getContainer() });
		this.modal.open();
	}
}
