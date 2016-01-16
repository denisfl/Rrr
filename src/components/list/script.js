'use strict';
console.log('yep');
import styles from './style.scss';

const classLoading = 'loading';
const PAGE_SIZE = 5;

var container = document.getElementById('app');
var renderedCards = [];
var currentPage = 0;
var cards = [];
var filteredCards = [];

var scrollTimeout;

/**
 * Слушаем скролл. По скроллу очищаем таймаут и
 * запускаем проверку высоты окна
 * @event
 */
window.addEventListener('scroll', function() {
  clearTimeout(scrollTimeout);
  checkWindowsHeight();
});

/**
 * Проверяем высоту окна по таймауту
 * @param {number} scrollHeight
 */
function checkWindowsHeight() {
  var scrollHeight = Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
  scrollTimeout = setTimeout(function() {

    if (document.body.scrollTop >= scrollHeight - window.innerHeight) {
      if (currentPage < Math.ceil(filteredCards.length / PAGE_SIZE)) {
        renderCards(filteredCards, ++currentPage);
      }
    }
  }, 100);
}

/**
 * Перемешиваем карточки
 */
function shuffleCards(array) {
  var currentIndex = array.length
  var temporaryValue;
  var randomIndex;

  while (0 != currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/**
 * Учитываем состояние фильтра
 * Он пока в планах.
 */
function setActiveFilter(id) {
  // if (activeFilter === id) {
  //   return;
  // }

  filteredCards = cards.slice(0);

  filteredCards = shuffleCards(filteredCards);


  currentPage = 0;
  renderCards(filteredCards, currentPage, true);
  // activeFilter = id;
}

function renderCards(cardsToRender, pageNumber, replace) {
  if (replace) {
    var el;
    while ((el = renderedCards.shift())) {
      el.remove();
    }
  }

  var fragment = document.createDocumentFragment();
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;

  var pageCards = cardsToRender.slice(from, to);

  renderedCards = renderedCards.concat(pageCards.map(function(card) {
    var cardElement = new Card(card);
    cardElement.render(container);
  }));

  container.appendChild(fragment);
}

function updateLoadedCards(loadedCards) {
  cards = loadedCards;
  setActiveFilter();
}

/**
 * Загружаем карточки
 */
function getCards() {
  var xhr = new XMLHttpRequest();
  container.classList.add(classLoading);

  xhr.open('GET', './data/cards.json');
  xhr.onload = function(event) {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var data = event.target.response;
        var loadedCards = JSON.parse(data);
        container.classList.remove(classLoading);
        updateLoadedCards(loadedCards);
      } else {
        setErrorXHRLoad();
        return;
      }
    }
  };
  xhr.send();

  xhr.timeout = 1000;
  xhr.ontimeout = function() {
    setErrorXHRLoad();
  };
}

// Обрабатываем ошибку загрузки, если данные не загрузились
function setErrorXHRLoad() {
  container.classList.remove(classLoading);
  console.log('Error loading data');
}

/**
 * Запускаем проверку высоты окна
 */
checkWindowsHeight();
/**
 * Вызываем загрузку карточек
 */
getCards();
