"use strict";

let title = prompt("Как называется ваш проект?"); //  КаЛьКулятор Верстки
const screens = prompt("Какие типы экранов нужно разработать?"); //Простые, Сложные, Интерактивные
const screenPrice = +prompt("Сколько будет стоить данная работа?");
const rollback = 15;
const adaptive = confirm("Нужен ли адаптив на сайте?");

let services = [];
let fullPrice, allServicePrices, servicePercentPrice, rollbackPrice;

const getTitle = function (title) {
  let result;
  result = title.trim();
  return result[0].toUpperCase() + result.substring(1).toLowerCase();
};

const getAllServicePrices = function (allServices) {
  let sumPrices = 0;

  allServices.forEach((service) => {
    sumPrices += service.price;
  });

  return sumPrices;
};

const getFullPrice = function (basePrice, addPrice) {
  return basePrice + addPrice;
};

const getRollbackPrice = function (price, rbPercent) {
  return (price * rbPercent) / 100;
};

const getServicePercentPrices = function (price, rbPrice) {
  return Math.ceil(price - rbPrice);
};

const showTypeOf = function (varObject) {
  for (let key in varObject) {
    console.warn(`Переменная ${key} содержит тип: ${typeof varObject[key]}`);
  }
};

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

//Функция getRollbackMessage устарела
//Далее следует использовать в getDiscountMessage
const getRollbackMessage = getDiscountMessage;

for (let i = 0; i < 2; i++) {
  services[i] = {};
  services[i].name = prompt("Какой дополнительный тип услуги нужен?");
  services[i].price = +prompt("Сколько это будет стоить?");
}

title = getTitle(title);
allServicePrices = getAllServicePrices(services);
fullPrice = getFullPrice(screenPrice, allServicePrices);
rollbackPrice = getRollbackPrice(fullPrice, rollback);
servicePercentPrice = getServicePercentPrices(fullPrice, rollbackPrice);

showTypeOf({
  title,
  fullPrice,
  adaptive,
});

console.log(screens.toLowerCase().split(", "));
console.log(getRollbackMessage(servicePercentPrice));
console.log(`Итоговую стоимость ${servicePercentPrice} рублей (без учета скидки)`);

// console.log("Стоимость верстки экранов " + screenPrice + " рублей");
// console.log("Стоимость разработки сайта " + fullPrice + " рублей");

// console.log("Откат посреднику за работу " + Math.round(rollbackPrice) + " рублей");
