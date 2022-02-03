"use strict";

const rollback = 15;

let title, screens, screenPrice, adaptive;
let services = [];

//Функции валидации
const isNumber = function (num) {
  num += "";
  return !isNaN(parseFloat(num)) && isFinite(num); // && num.trim().length == num.length;
  //Реализована проверка по Усл. заданию 1 ----------^^^
};

const isNoEmpty = function (text) {
  text += "";
  return text && text.trim().length > 0;
};

//Анкетироване пользователя по проекту
const asking = function () {
  do {
    title = prompt("Как называется ваш проект?", "КаЛьКулятор Верстки");
  } while (!isNoEmpty(title));
  do {
    screens = prompt("Какие типы экранов нужно разработать?", "Простые, Сложные, Интерактивные");
  } while (!isNoEmpty(screens));
  do {
    screenPrice = prompt("Сколько будет стоить данная работа?", 30000);
  } while (!isNumber(screenPrice));
  screenPrice = getNumber(screenPrice);
  adaptive = confirm("Нужен ли адаптив на сайте?");
};

//Нормализация имени проекта
const getTitle = function (title) {
  let result;
  result = title.trim();
  return result[0].toUpperCase() + result.substring(1).toLowerCase();
};

const getNumber = function (num) {
  return parseFloat(num);
};

//Обработка дополнительных услуг
const getAllServicePrices = function (allServices) {
  let oneService;
  let sumPrices = 0;

  for (let i = 0; i < 2; i++) {
    oneService = {};

    do {
      oneService.name = prompt("Какой дополнительный тип услуги нужен?");
    } while (!isNoEmpty(oneService.name));

    do {
      oneService.price = prompt(`Сколько это будет стоить, услуга: "${oneService.name}"?`);
    } while (!isNumber(oneService.price));

    oneService.price = getNumber(oneService.price);

    sumPrices += oneService.price;
    allServices[i] = oneService;
  }
  return sumPrices;
};
//Вычисление полной стоимости
function getFullPrice(basePrice, addPrice) {
  return basePrice + addPrice;
}
//Вычисление ставки посредника
const getRollbackPrice = function (price, rbPercent) {
  return (price * rbPercent) / 100;
};
//Вычисление ставки разработчика
const getServicePercentPrices = function (price, rbPrice) {
  return Math.ceil(price - rbPrice);
};
//Дамп переменных
const showTypeOf = function (varObject) {
  for (let key in varObject) {
    console.log(varObject[key], `Имя: ${key}, тип: ${typeof varObject[key]}`);
  }
};
//Вычисление возможности предоставить скидку
//const getRollbackMessage = getDiscountMessage;
const getDiscountMessage = function (price) {
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
};

asking();
title = getTitle(title);
const allServicePrices = getAllServicePrices(services);
const fullPrice = getFullPrice(screenPrice, allServicePrices);
const rollbackPrice = getRollbackPrice(fullPrice, rollback);
const servicePercentPrice = getServicePercentPrices(fullPrice, rollbackPrice);

console.log(screens.toLowerCase().split(", "));
console.log(getDiscountMessage(servicePercentPrice));
console.log(`Итоговую стоимость ${servicePercentPrice} рублей (без учета скидки)`);

console.log("|-------Damps----->");
showTypeOf({
  title,
  screens,
  screenPrice,
  adaptive,
  services,
  allServicePrices,
  fullPrice,
  rollbackPrice,
  servicePercentPrice,
});
// console.log("Стоимость верстки экранов " + screenPrice + " рублей");
// console.log("Стоимость разработки сайта " + fullPrice + " рублей");

// console.log("Откат посреднику за работу " + Math.round(rollbackPrice) + " рублей");
