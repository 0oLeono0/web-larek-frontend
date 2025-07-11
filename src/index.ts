import { AppApi } from './components/AppApi';
import { AppPresenter } from './components/AppPresenter';
import { Api } from './components/base/api';
import { EventEmitter } from './components/base/events';
import { Basket } from './components/Basket';
import { BasketData } from './components/BasketData';
import { CardsContainer } from './components/CardsContainer';
import { Modal } from './components/common/Modal';
import { OrderPresenter } from './components/Order';
import { UserData } from './components/UserData';
import './scss/styles.scss';
import { IModalData } from './types';
import { API_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new AppApi(baseApi);
const basketData = new BasketData(events);
const userData = new UserData(events);
const cardsContainer = new CardsContainer(document.querySelector('.gallery'));
const modal = new Modal<IModalData>(document.querySelector('#modal-container'));
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basket = new Basket(cloneTemplate(basketTemplate), events, basketData);
const orderPresenter = new OrderPresenter(api, userData, basketData, events);
const appPresenter = new AppPresenter(
	api,
	cardsContainer,
	modal,
	basket,
	basketData,
	events
);

const orderButton = basket.getContainer().querySelector('.basket__button');
if (orderButton instanceof HTMLElement) {
	orderPresenter.init(orderButton, modal, events);
} else {
	console.error('Order button not found');
}
