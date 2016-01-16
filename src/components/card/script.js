'use strict';

import styles from './style.scss';

function Card(data) {
  this._data = data;
  this._onClick = this._onClick.bind(this);
}

Card.prototype.render = function(container) {
  var template = document.querySelector('#card-template');

  if ('content' in template) {
    this.element = template.content.children[0].cloneNode(true);
  } else {
    this.element = template.children[0].cloneNode(true);
  }

  this.element.querySelector('.card__title').textContent = this._data.verbForm1;
  this.element.querySelector('.card__second-form').textContent = this._data.verbForm2;
  this.element.querySelector('.card__third-form').textContent = this._data.verbForm3;
  this.element.querySelector('.card__translation').textContent = this._data.verbTranslate;

  if (container) {
    container.appendChild(this.element);
    this.container = container;
  }

  this.element.addEventListener('click', this._onClick);
};

Card.prototype._onClick = function(event) {
  var card = event.currentTarget;
  var waveBloskParam = card.getBoundingClientRect();
  var waveBlockRect = Math.max(waveBloskParam.width, waveBloskParam.height);
  var waveBlock = card.querySelector('.click-wave');

  event.preventDefault();

  card.classList.toggle('active');

  if (waveBlock.classList.contains('animate')) {
    waveBlock.classList.remove('animate');
  }

  waveBlock.style.width = waveBlockRect + 'px';
  waveBlock.style.height = waveBlockRect + 'px';

  waveBlock.style.left = event.clientX - card.getBoundingClientRect().left - card.getBoundingClientRect().width/2 + 'px';
  waveBlock.style.top = event.clientY - card.getBoundingClientRect().top - card.getBoundingClientRect().height/2 + 'px';

  waveBlock.classList.add('animate');
};

window.Card = Card;
