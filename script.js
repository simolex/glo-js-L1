"use strict";

const title = prompt("Как называется ваш проект?"); //"Учебный проект: JS 23.0";
const screens = prompt("Какие типы экранов нужно разработать?"); //Простые, Сложные, Интерактивные
const screenPrice = +prompt("Сколько будет стоить данная работа?");
const rollback = 15;
let fullPrice = screenPrice;
const adaptive = confirm("Нужен ли адаптив на сайте?");
let services = [];
let servicePercentPrice, rollbackPrice;

for (let i = 0; i < 2; i++) {
  services[i] = {};
  services[i].name = prompt("Какой дополнительный тип услуги нужен?");
  services[i].price = +prompt("Сколько это будет стоить?");
  fullPrice += services[i].price;
}
rollbackPrice = (fullPrice * rollback) / 100;
servicePercentPrice = Math.ceil(fullPrice - rollbackPrice);

// console.log(typeof title);
// console.log(typeof fullPrice);
// console.log(typeof adaptive);

// console.log(screens.length);

console.log("Стоимость верстки экранов " + screenPrice + " рублей");
console.log("Стоимость разработки сайта " + fullPrice + " рублей");

console.log(screens.toLowerCase().split(", "));

console.log("Откат посреднику за работу " + Math.round(rollbackPrice) + " рублей");
console.log(`Итоговую стоимость ${servicePercentPrice} рублей`);
