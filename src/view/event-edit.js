import dayjs from 'dayjs';
import he from 'he';
import SmartClassView from './smart-class.js';

import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createEventEditTemplate = (state, cityInfoArray, offersOfType) => {
  const {
    dateFrom,
    dateTo,
    basePrice,
    type,
    info,
    offers,
    id,
    hasOffers,
    hasInfo,
    hasDescription,
    hasImages,
    isDisabled = false,
    isSaving = false,
    isDeleting = false,
  } = state;

  const createTypesCheckboxTemplate = (offersOfType, id) => {
    const types = offersOfType.slice().map((object) => object.type);

    const typesCheckboxTemplate = types.map((type) => {
      return `
      <div class="event__type-item">
        <input
          id="event-type-${type.toLowerCase()}-${id}"
          class="event__type-input  visually-hidden"
          type="radio" name="event-type"
          value="${type.toLowerCase()}"
        />
        <label
        class="event__type-label  event__type-label--${type.toLowerCase()}"
        for="event-type-${type.toLowerCase()}-${id}">
          ${type}
        </label>
      </div>
      `;
    }).join('\n');

    return typesCheckboxTemplate;
  };

  const createOffersCheckboxTemplate = (type, offersOfType) => {
    const typeIndex = offersOfType.findIndex((item) => item.type === type.toLowerCase());
    const availableOffers = offersOfType[typeIndex].offers;
    const offersCheckboxTemplate = availableOffers.map((availableOffer, offerIndex) => {
      const isCheckedOffer = offers.map((offer) => offer.title).includes(availableOffer.title);

      return `
      <div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${type}-${offerIndex}"
          type="checkbox"
          name="event-offer-${type}-${offerIndex}"
          ${isCheckedOffer ? 'checked' : ''}
          />
        <label
          class="event__offer-label"
          for="event-offer-${type}-${offerIndex++}">
            <span class="event__offer-title">${availableOffer.title}</span>
              &plus;&euro;&nbsp;
            <span class="event__offer-price">${availableOffer.price}</span>
        </label>
      </div>
      `;
    }).join('\n');

    if (hasOffers) {
      return `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${offersCheckboxTemplate}
      </div>`;
    }
    return '';
  };

  const createDestinationTemplate = () => {

    const createImagesTemplate = () => {
      if (hasImages) {
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

    const createDescriptionTemplate = () => {
      if (hasDescription) {
        return `
          <p class="event__destination-description">
            ${info.description}
          </p>`;
      }

      return '';
    };

    if (hasDescription || hasImages) {
      return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        ${createDescriptionTemplate()}
        ${createImagesTemplate()}
      </section>
      `;
    }
    return '';
  };

  const createEventDetailsTemplate = () => {
    if (hasOffers || hasInfo) {
      return `
        <section class="event__details">
          ${createOffersCheckboxTemplate(type, offersOfType)}
          ${createDestinationTemplate()}
        </section>`;
    }
    return '';
  };

  const createDestinationListTemplate = (cityInfoArray) => {
    return cityInfoArray
      .map((cityInfo) => `<option value="${cityInfo.name}"></option>`)
      .join('\n');
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
              ${createTypesCheckboxTemplate(offersOfType, id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
            ${type}
          </label>
          <input
            class="event__input  event__input--destination"
            id="event-destination-${id}"
            type="text"
            name="event-destination"
            value="${hasInfo ? he.encode(info.name) : ''}"
            list="destination-list-${id}"
          />
          <datalist id="destination-list-${id}">
          ${createDestinationListTemplate(cityInfoArray)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input
            class="event__input  event__input--time"
            id="event-start-time-${id}"
            type="text"
            name="event-start-time"
            value="${dayjs(dateFrom).format('DD/MM/YY HH:mm')}"
          />
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input
            class="event__input  event__input--time"
            id="event-end-time-${id}"
            type="text"
            name="event-end-time"
            value="${dayjs(dateTo).format('DD/MM/YY HH:mm')}"
          />
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input
            class="event__input  event__input--price"
            id="event-price-${id}"
            type="number"
            min="0"
            name="event-price"
            value="${Number(basePrice)}"
          />
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
        <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}>
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      ${createEventDetailsTemplate()}
    </form>
  </li>
  `;
};

export default class EventEdit extends SmartClassView {
  constructor(point, destinations, offers) {
    super();

    this._destinations = destinations;
    this._offers = offers;
    this._state = EventEdit.parsePointToState(point, this._offers);
    this._datepickerFrom = null;
    this._datepickerTo = null;

    this._handleEditArrowClick = this._handleEditArrowClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFormDeleteClick = this._handleFormDeleteClick.bind(this);

    this._handleTypeChange = this._handleTypeChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
    this._handleDateFromChange = this._handleDateFromChange.bind(this);
    this._handleDateToChange = this._handleDateToChange.bind(this);
    this._handlePriceChange = this._handlePriceChange.bind(this);
    this._handleOffersChange = this._handleOffersChange.bind(this);

    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
  }

  getTemplate() {
    return createEventEditTemplate(this._state, this._destinations, this._offers);
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }
  }

  reset(point) {
    this.updateData(
      EventEdit.parsePointToState(point, this._offers),
    );
  }

  _setDatepickerFrom() {
    if (this._datepickerFrom) {
      this._datepickerFrom.destroy();
      this._datepickerFrom = null;
    }

    if (this._state.dateFrom) {
      this._datepickerFrom = flatpickr(
        this.getElement().querySelectorAll('.event__input--time')[0],
        {
          dateFormat: 'd/m/Y H:i',
          // minDate: 'today',
          enableTime: true,
          //allowInput: true,
          defaultDate: new Date(this._state.dateFrom),
          onClose: this._handleDateFromChange,
        },
      );
    }
  }

  _setDatepickerTo() {
    if (this._datepickerTo) {
      this._datepickerTo.destroy();
      this._datepickerTo = null;
    }

    if (this._state.dateTo) {
      this._datepickerTo = flatpickr(
        this.getElement().querySelectorAll('.event__input--time')[1],
        {
          dateFormat: 'd/m/Y H:i',
          minDate: this._state.dateFrom,
          enableTime: true,
          //allowInput: true,
          defaultDate: new Date(this._state.dateTo),
          onClose: this._handleDateToChange,
        },
      );
    }
  }

  _handleEditArrowClick() {
    this._callback.editArrowClick();
  }

  setEditArrowClickHandler(callback) {
    this._callback.editArrowClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._handleEditArrowClick);
  }

  _handleFormSubmit(evt) {
    evt.preventDefault();
    this._callback.submitClick(EventEdit.parseStateToPoint(this._state));
  }

  setFormSubmitHandler(callback) {
    this._callback.submitClick = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._handleFormSubmit);
  }

  _handleTypeChange(evt) {
    evt.preventDefault();
    const typeIndex = this._offers.findIndex((item) => item.type === evt.target.value);
    this.updateData({
      type: evt.target.value,
      hasOffers: this._offers[typeIndex].offers.length !== 0,
    });
  }

  _handleDestinationChange(evt) {
    evt.preventDefault();
    const cityInfoArray = this._destinations;
    const cityIndex = cityInfoArray.findIndex((item) => item.name === evt.target.value);
    const newInfo = cityInfoArray[cityIndex];
    this.updateData({
      info: newInfo,
      hasInfo: cityInfoArray[cityIndex] !== null,
      hasDescription: newInfo !== null && newInfo.description.length > 0,
      hasImages: newInfo !== null && newInfo.pictures.length !== 0,
    });
  }

  _handleDateFromChange([userDate]) {
    this.updateData({
      dateFrom: userDate,
    });
  }

  _handleDateToChange([userDate]) {
    this.updateData({
      dateTo: userDate,
    });
  }

  _handlePriceChange(evt) {
    evt.preventDefault();
    this.updateData({
      basePrice: Number(evt.target.value),
    });
  }

  _handleOffersChange(evt) {
    evt.preventDefault();

    if (evt.target.tagName !== 'INPUT') {
      return;
    }

    const typeIndex = this._offers.findIndex((item) => item.type === this._state.type);
    const availableOffers = this._offers[typeIndex].offers;

    let checkedOffers = [];

    if (availableOffers.length) {
      const checkedOffersIndexes = Array.from(document.querySelectorAll('.event__offer-checkbox:checked'))
        .slice().map((input) => input.name.slice(-1));

      checkedOffers = checkedOffersIndexes.map((index) => availableOffers[index]);
    }


    this.updateData({
      offers: checkedOffers,
    });

  }

  _handleFormDeleteClick(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseStateToPoint(this._state));
  }

  setFormDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.getElement().querySelector('form').addEventListener('reset', this._handleFormDeleteClick);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.event__type-group')
      .addEventListener('change', this._handleTypeChange);

    this.getElement()
      .querySelector('.event__input--destination')
      .addEventListener('change', this._handleDestinationChange);

    this.getElement()
      .querySelector('.event__input--price')
      .addEventListener('change', this._handlePriceChange);

    if (this._state.hasOffers) {
      this.getElement()
        .querySelector('.event__section--offers')
        .addEventListener('change', this._handleOffersChange);
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickerFrom();
    this._setDatepickerTo();
    this.setFormSubmitHandler(this._callback.submitClick);
    this.setFormDeleteClickHandler(this._callback.deleteClick);
    this.setEditArrowClickHandler(this._callback.editArrowClick);
  }

  static parsePointToState(point, offersOfType) {
    const typeIndex = offersOfType.findIndex((item) => item.type === point.type.toLowerCase());

    return Object.assign(
      {},
      point,
      {
        hasOffers: offersOfType[typeIndex].offers.length !== 0,
        hasInfo: point.info !== null,
        hasDescription: point.info !== null && point.info.description.length !== 0,
        hasImages: point.info !== null && point.info.description.length !== 0,
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }

  static parseStateToPoint(state) {
    state = Object.assign({}, state);

    if (!state.hasOffers) {
      state.offers = [];
    }

    if (!state.hasInfo) {
      state.info = null;
    } else {
      if (!state.hasDescription) {
        state.info.description = '';
      }

      if (!state.hasImages) {
        state.info.pictures = [];
      }
    }


    delete state.hasOffers;
    delete state.hasInfo;
    delete state.hasDescription;
    delete state.hasImages;
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return state;
  }
}
