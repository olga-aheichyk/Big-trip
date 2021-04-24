import dayjs from 'dayjs';
import { TYPES, OFFERS } from '../const.js';
import AbstractClassView from './abstract-class.js';

const BLANK_EVENT = {
  dateFrom: dayjs(),
  dateTo: dayjs(dayjs()).add(1, 'day'),
  basePrice: 0,
  type: 'flight',
  info: {
    name: '',
    description: '',
    pictures: {
      src: '',
      description: '',
    },
  },
  offers: [],
};

const createEventEditTemplate = (point) => {
  const {
    dateFrom,
    dateTo,
    basePrice,
    type,
    info,
    offers,
    id,
  } = point;

  const createTypesCheckboxTemplate = (id) => {
    const typesCheckboxTemplate = TYPES.map((item) => {
      return `
      <div class="event__type-item">
        <input
          id="event-type-${item.toLowerCase()}-${id}"
          class="event__type-input  visually-hidden"
          type="radio" name="event-type"
          value="${item.toLowerCase()}"
        />
        <label
        class="event__type-label  event__type-label--${item.toLowerCase()}"
        for="event-type-${item.toLowerCase()}-${id}">
          ${item}
        </label>
      </div>
      `;
    }).join('\n');

    return typesCheckboxTemplate;
  };

  const createOffersCheckboxTemplate = (id) => {
    const offersCheckboxTemplate = OFFERS.map((item) => {
      const isCheckedOffer = offers.map((offer) => offer.shortName).includes(item.shortName);

      if (isCheckedOffer) {
        return `
        <div class="event__offer-selector">
          <input
            class="event__offer-checkbox  visually-hidden"
            id="event-offer-${item.shortName}-${id}"
            type="checkbox"
            name="event-offer-${item.shortName}" checked
          />
          <label
            class="event__offer-label"
            for="event-offer-${item.shortName}-${id}">
              <span class="event__offer-title">${item.name}</span>
                &plus;&euro;&nbsp;
              <span class="event__offer-price">${item.price}</span>
          </label>
        </div>
        `;
      }

      return `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${item.shortName}-${id}"
          type="checkbox"
          name="event-offer-${item.shortName}"
          />
        <label
          class="event__offer-label"
          for="event-offer-${item.shortName}-1">
            <span class="event__offer-title">${item.name}</span>
              &plus;&euro;&nbsp;
            <span class="event__offer-price">${item.price}</span>
        </label>
      </div>
      `;
    }).join('\n');

    return offersCheckboxTemplate;
  };

  const createDestinationTemplate = () => {

    const createImagesTemplate = () => {
      if (info.pictures) {
        const imagesMarkup = info.pictures.map((item) => {
          return `
          <img
            class="event__photo"
            src = "${item.src}"
            alt = "${item.description}"
          />
        `;
        }).join('\n');

        return `
        <div class="event__photos-container">
          <div class="event__photos-tape">
            ${imagesMarkup}
          </div>
        </div>`;
      }

      return '';
    };

    if (info.description) {
      return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">${info.name}</h3>
        <p class="event__destination-description">
          ${info.description}
        </p>
        ${createImagesTemplate()}
      </section>
      `;
    }
    return '';
  };

  return `
  <li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>

          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox"/>

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${createTypesCheckboxTemplate(id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value="${info.name}"
            list="destination-list-1"
          />
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-1"
            type="text"
            name="event-start-time"
            value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}"
          />
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-1"
            type="text"
            name="event-end-time"
            value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}"
          />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-1"
            type="text"
            name="event-price"
            value="${basePrice}"
          />
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
            ${createOffersCheckboxTemplate(id)}
          </div>
        </section>
        ${createDestinationTemplate()}
      </section>
    </form>
  </li>
  `;
};

export default class EventEdit extends AbstractClassView {
  constructor(point = BLANK_EVENT) {
    super();
    this._point = point;

    this._handleEditArrowClick = this._handleEditArrowClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
  }

  getTemplate() {
    return createEventEditTemplate(this._point);
  }

  _handleEditArrowClick(evt) {
    evt.preventDefault();
    this._callback.editArrowClick();
  }

  setEditArrowClickHandler(callback) {
    this._callback.editArrowClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._handleEditArrowClick);
  }

  _handleFormSubmit(evt) {
    evt.preventDefault();
    this._callback.submitClick();
  }

  setFormSubmitHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._handleFormSubmit);
  }
}