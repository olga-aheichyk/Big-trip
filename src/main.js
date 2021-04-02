import { createTripInfoMainTemplate } from './view/trip-info-main.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createTripInfoCostTemplate } from './view/trip-info-cost.js'
import { createNavigationTemplate } from './view/navigation.js';
import { createTripFiltersTemplate } from './view/trip-filters.js';
import { createTripSortTemplate } from './view/trip-sort.js';
import { createTripEventsListTemplate } from './view/trip-events-list.js';
import { createTripEventsItemTemplate } from './view/trip-events-item.js';
import { createTripEventsEditTemplate } from './view/trip-events-edit.js';
import { createTripEventsCreateTemplate } from './view/trip-events-create.js';

const TRIP_EVENTS_COUNT = 3;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector('.trip-main');
const tripControlsNavigationElement = document.querySelector('.trip-controls__navigation');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

render(tripMainElement, createTripInfoTemplate(), 'afterbegin');

const tripInfoElement = tripMainElement.querySelector('.trip-info');

render(tripInfoElement, createTripInfoMainTemplate(), 'beforeend');
render(tripInfoElement, createTripInfoCostTemplate(), 'beforeend');

render(tripControlsNavigationElement, createNavigationTemplate(), 'beforeend');
render(tripControlsFiltersElement, createTripFiltersTemplate(), 'beforeend');

// render(tripEventsElement, createTripEventsCreateTemplate(), 'beforeend');

render(tripEventsElement, createTripSortTemplate(), 'beforeend');
render(tripEventsElement, createTripEventsListTemplate(), 'beforeend');

const tripEventsListElement = tripEventsElement.querySelector('.trip-events__list');

render(tripEventsListElement, createTripEventsEditTemplate(), 'afterbegin');

for (let i = 0; i < TRIP_EVENTS_COUNT; i++) {
  render(tripEventsListElement, createTripEventsItemTemplate(), 'beforeend');
};







