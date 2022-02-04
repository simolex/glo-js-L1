"use strict";

const appData = {
  title: "",
  screens: "",
  screenPrice: 0,
  adaptive: false,
  services: [],
  rollback: 15,
  allServicePrices: 0,
  fullPrice: 0,
  rollbackPrice: 0,
  servicePercentPrice: 0,

  //Методы валидации
  isNumber: function (num) {
    num += "";
    return !isNaN(parseFloat(num)) && isFinite(num); // && num.trim().length == num.length;
    //Реализована проверка по Усл. заданию 1 ----------^^^
  },

  isNoEmpty: function (text) {
    text += "";
    return text && text.trim().length > 0;
  },

  //Нормализация имени проекта
  getTitle: function (title) {
    let result;
    result = title.trim();
    return result[0].toUpperCase() + result.substring(1).toLowerCase();
  },

  getNumber: function (num) {
    return parseFloat(num);
  },

  //Анкетироване пользователя по проекту
  asking: function () {
    do {
      this.title = prompt("Как называется ваш проект?", "КаЛьКулятор Верстки");
    } while (!this.isNoEmpty(title));
    do {
      this.screens = prompt(
        "Какие типы экранов нужно разработать?",
        "Простые, Сложные, Интерактивные"
      );
    } while (!this.isNoEmpty(screens));
    do {
      this.screenPrice = prompt("Сколько будет стоить данная работа?", 30000);
    } while (!this.isNumber(screenPrice));
    this.screenPrice = this.getNumber(screenPrice);
    this.adaptive = confirm("Нужен ли адаптив на сайте?");
  },

  //Обработка дополнительных услуг
  getAllServicePrices: function () {
    let oneService;
    let sumPrices = 0;

    for (let i = 0; i < 2; i++) {
      oneService = {};

      do {
        oneService.name = prompt("Какой дополнительный тип услуги нужен?");
      } while (!this.isNoEmpty(oneService.name));

      do {
        oneService.price = prompt(`Сколько это будет стоить, услуга: "${oneService.name}"?`);
      } while (!this.isNumber(oneService.price));

      oneService.price = this.getNumber(oneService.price);

      sumPrices += oneService.price;
      this.services[i] = oneService;
    }
    return sumPrices;
  },

  //Вычисление полной стоимости
  getFullPrice: function () {
    return this.screenPrice + this.allServicePrices;
  },

  //Вычисление ставки посредника
  getRollbackPrice: function () {
    return (this.fullPrice * this.rollback) / 100;
  },

  //Вычисление ставки разработчика
  getServicePercentPrices: function () {
    return Math.ceil(this.fullPrice - this.rollbackPrice);
  },

  //Дамп переменных
  showTypeOf: function (varObject) {
    for (let key in varObject) {
      console.log(varObject[key], `Имя: ${key}, тип: ${typeof varObject[key]}`);
    }
  },

  //Вычисление возможности предоставить скидку
  //const getRollbackMessage = getDiscountMessage;
  getDiscountMessage: function (price) {
    let message;
    switch (true) {
      case price > 30000:
        message = "Даем скидку в 10%";
        break;
      case price > 15000 && price <= 30000:
        message = "Даем скидку в 5%";
        break;
      case price >= 0 && price <= 15000:
        message = "Скидка не предусмотрена";
        break;
      case price <= 0:
        message = "Что-то пошло не так!!!";
        break;
      default:
        message = "Что-то пошло, совсем, не так!!!";
        break;
    }
    return message;
  },
  start: function () {
    this.asking();
    this.title = this.getTitle(this.title);
    this.allServicePrices = this.getAllServicePrices();
    this.fullPrice = this.getFullPrice();
    this.rollbackPrice = this.getRollbackPrice();
    this.servicePercentPrice = this.getServicePercentPrices();
  },
};

appData.start();
