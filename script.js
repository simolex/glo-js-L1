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
  getTitle: function () {
    let result = appData.title.trim();
    return result[0].toUpperCase() + result.substring(1).toLowerCase();
  },

  getNumber: function (num) {
    return parseFloat(num);
  },

  //Анкетироване пользователя по проекту
  asking: function () {
    do {
      appData.title = prompt("Как называется ваш проект?", "КаЛьКулятор Верстки");
    } while (!appData.isNoEmpty(appData.title));
    do {
      appData.screens = prompt(
        "Какие типы экранов нужно разработать?",
        "Простые, Сложные, Интерактивные"
      );
    } while (!appData.isNoEmpty(appData.screens));
    do {
      appData.screenPrice = prompt("Сколько будет стоить данная работа?", 30000);
    } while (!appData.isNumber(appData.screenPrice));
    appData.screenPrice = appData.getNumber(appData.screenPrice);
    appData.adaptive = confirm("Нужен ли адаптив на сайте?");
  },

  //Обработка дополнительных услуг
  getAllServicePrices: function () {
    let oneService;
    let sumPrices = 0;

    for (let i = 0; i < 2; i++) {
      oneService = {};

      do {
        oneService.name = prompt("Какой дополнительный тип услуги нужен?");
      } while (!appData.isNoEmpty(oneService.name));

      do {
        oneService.price = prompt(`Сколько это будет стоить, услуга: "${oneService.name}"?`);
      } while (!appData.isNumber(oneService.price));

      oneService.price = appData.getNumber(oneService.price);

      sumPrices += oneService.price;
      appData.services[i] = oneService;
    }
    return sumPrices;
  },

  //Вычисление полной стоимости
  getFullPrice: function () {
    return appData.screenPrice + appData.allServicePrices;
  },

  //Вычисление ставки посредника
  getRollbackPrice: function () {
    return (appData.fullPrice * appData.rollback) / 100;
  },

  //Вычисление ставки разработчика
  getServicePercentPrices: function () {
    return Math.ceil(appData.fullPrice - appData.rollbackPrice);
  },

  //Дамп переменных
  logger: function (varObject) {
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
    appData.asking();
    appData.title = appData.getTitle();
    appData.allServicePrices = appData.getAllServicePrices();
    appData.fullPrice = appData.getFullPrice();
    appData.rollbackPrice = appData.getRollbackPrice();
    appData.servicePercentPrice = appData.getServicePercentPrices();
    appData.logger(appData);
  },
};

appData.start();
