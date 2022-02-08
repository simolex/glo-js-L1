"use strict";

const appData = {
  title: "",
  screens: [],
  adaptive: false,
  services: [],
  rollback: 15,
  fullPrice: 0,
  rollbackPrice: 0,
  servicePercentPrice: 0,

  //Методы валидации
  isNoStrongNumber: function (num) {
    num += "";
    return !isNaN(parseFloat(num)) && isFinite(num);
  },
  isNumber: function (num) {
    num += "";
    return appData.isNoStrongNumber(num) && num.trim().length == num.length;
    //Реализована проверка по Усл. заданию 1 ----------^^^
  },

  isText: function (text) {
    text += "";
    return text && text.trim().length > 0 && !appData.isNoStrongNumber(text);
  },

  getNumber: function (num) {
    return parseFloat(num);
  },

  start: function () {
    appData.asking();
    appData.getTitle();
    appData.getFullPrice();
    appData.getRollbackPrice();
    appData.getServicePercentPrices();

    appData.logger(appData);
  },

  //Анкетироване пользователя по проекту
  asking: function () {
    do {
      appData.title = prompt("Как называется ваш проект?", "КаЛьКулятор Верстки");
    } while (!appData.isText(appData.title));

    //Запрос разрабатываемых экранов
    for (let i = 0; i < 2; i++) {
      let name, price;

      do {
        name = prompt("Какой тип экрана нужно разработать?", "Простые");
      } while (!appData.isText(name));
      name = name.trim();

      do {
        price = prompt(`Сколько будет стоить, экран: "${name}"?`, "10000");
      } while (!appData.isNumber(price));
      price = appData.getNumber(price);

      appData.screens.push({ id: i, name, price });
    }

    appData.adaptive = confirm("Нужен ли адаптив на сайте?");

    //Запрос дополнительных услуг
    for (let i = 0; i < 2; i++) {
      let name, price;

      do {
        name = prompt("Какой дополнительный тип услуги нужен?");
      } while (!appData.isText(name));
      name = name.trim();

      do {
        price = prompt(`Сколько будет стоить, услуга: "${name}"?`);
      } while (!appData.isNumber(price));
      price = appData.getNumber(price);

      appData.services.push({ id: i, name, price });
    }
  },

  //Нормализация имени проекта
  getTitle: function () {
    const result = appData.title.trim();
    appData.title = result[0].toUpperCase() + result.substring(1).toLowerCase();
  },

  //Вычисление полной стоимости
  getFullPrice: function () {
    //Расчет стоимости экранов
    const screenPrice = appData.screens.reduce(
      (sumPrices, oneScreen) => sumPrices + oneScreen.price,
      0
    );
    //Расчет дополнительных услуг
    const allServicePrices = appData.services.reduce(
      (sumPrices, oneService) => sumPrices + oneService.price,
      0
    );
    appData.fullPrice = screenPrice + allServicePrices;
  },

  //Вычисление ставки посредника
  getRollbackPrice: function () {
    appData.rollbackPrice = (appData.fullPrice * appData.rollback) / 100;
  },

  //Вычисление ставки разработчика
  getServicePercentPrices: function () {
    appData.servicePercentPrice = Math.ceil(appData.fullPrice - appData.rollbackPrice);
  },

  //Дамп переменных
  logger: function (varObject) {
    for (let key in varObject) {
      if (typeof varObject[key] == "function") {
        console.log(`Имя: ${key}, тип: ${typeof varObject[key]}`);
      } else {
        console.log(varObject[key], `Имя: ${key}, тип: ${typeof varObject[key]}`);
      }
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
};

appData.start();
