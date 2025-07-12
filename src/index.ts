import { AppApi } from './components/AppApi';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketData } from './components/BasketData';
import { CardsContainer } from './components/CardsContainer';
import { CardsData } from './components/CardsData';
import { Modal } from './components/common/Modal';
import { CompactCard } from './components/CompactCard';
import { ContactsForm } from './components/ContactsForm';
import { FullCard } from './components/FullCard';
import { GalleryCard } from './components/GalleryCard';
import { OrderForm } from './components/OrderForm';
import { Success } from './components/Success';
import { UserData } from './components/UserData';
import './scss/styles.scss';
import {
	IModalData,
	ICardEventData,
	IBasketEventData,
	IRemoveCardEventData,
	IOrder,
	IOrderSuccessEventData,
} from './types';
import { API_URL } from './utils/constants';
import { ensureElement, cloneTemplate } from './utils/utils';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const userData = new UserData(events);
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const modal = new Modal<IModalData>(document.querySelector('#modal-container'));
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basket = new Basket(cloneTemplate(basketTemplate), events, basketData);
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

api
	.getCards()
	.then(({ items }) => {
		cardsData.items = items;
		const cardsArray = items.map((card) => {
			const cardInstance = new GalleryCard(cloneTemplate(cardTemplate), events);
			return cardInstance.render(card);
		});
		cardsContainer.catalog = cardsArray;
	})
	.catch((error) => {
		console.error('Failed to load cards:', error);
	});

events.on('card:open', (data: ICardEventData) => {
	const card = cardsData.getCard(data.cardId);
	if (card) {
		const cardInstance = new FullCard(
			cloneTemplate(cardPreviewTemplate),
			events
		);
		const cardFull = cardInstance.render(card);
		modal.modal = cardFull;
		modal.open();
	}
});

events.on('busket:add', (data: ICardEventData) => {
	const card = cardsData.getCard(data.cardId);
	if (card && card.price !== null && !basketData.items.includes(data.cardId)) {
		basketData.addItem(data.cardId);
		basketData.total += card.price;
		basket.items = basketData.items;
		basket.total = basketData.total;
	}
});

events.on('busket:open', (data: IBasketEventData) => {
	let cardIndex = 1;
	const cardsArray = data.ids.map((id) => {
		const card = cardsData.getCard(id);
		const cardInstance = new CompactCard(
			cloneTemplate(cardBasketTemplate),
			events
		);
		cardInstance.cardIndex = cardIndex++;
		return cardInstance.render(card);
	});
	const basketList = basket.busketList;
	const basketContainer = new CardsContainer(basketList);
	basketContainer.catalog = cardsArray;
	modal.modal = basket.getContainer();
	modal.open();
});

events.on('card:remove', (data: IRemoveCardEventData) => {
	const card = cardsData.getCard(data.id);
	if (card) {
		basketData.removeItem(data.id);
		basketData.total -= card.price || 0;
		basket.items = basketData.items;
		basket.total = basketData.total;
		if (modal.isOpen()) {
			events.emit('busket:open', { ids: basketData.items });
		}
	}
});

events.on('order:open', () => {
	modal.modal = orderForm.getContainer();
	modal.open();
	const userInfo = userData.getUserInfo();
	orderForm.updateFormValues(userInfo);
});

events.on('form:validate:order', () => {
	const validationResult = userData.validateOrder();
	orderForm.validate(validationResult);
});

events.on('order:email', () => {
	modal.modal = contactsForm.getContainer();
	modal.open();
	const userInfo = userData.getUserInfo();
	contactsForm.updateFormValues(userInfo);
});

events.on('form:validate:contacts', () => {
	const validationResult = userData.validateContacts();
	contactsForm.validate(validationResult);
});

events.on('order:submit', () => {
	const order: IOrder = {
		...userData.getUserInfo(),
		items: basketData.items.filter((id) => {
			const card = cardsData.getCard(id);
			return card && card.price !== null;
		}),
		total: basketData.total,
	};
	api
		.orderCards(order)
		.then((response) => {
			events.emit('order:success', response);
		})
		.catch((error) => {
			console.error('Failed to submit order:', error);
			contactsForm.setError('Ошибка при отправке заказа. Попробуйте снова.');
		});
});

events.on('order:success', (data: IOrderSuccessEventData) => {
	success.setTotal(data.total);
	modal.modal = success.getContainer();
	modal.open();
	basketData.items = [];
	basketData.total = 0;
	basket.items = [];
	basket.total = 0;
});

events.on('form:order:change', (data: Partial<IOrder>) => {
	userData.setUserInfo(data);
});

events.on('form:contacts:change', (data: Partial<IOrder>) => {
	userData.setUserInfo(data);
});

events.on('user:change', (data: IOrder) => {
	if (modal.isOpen() && modal.modal === orderForm.getContainer()) {
		orderForm.updateFormValues(data);
	} else if (modal.isOpen() && modal.modal === contactsForm.getContainer()) {
		contactsForm.updateFormValues(data);
	}
});

events.on('modal:close', () => {
	modal.close();
});
