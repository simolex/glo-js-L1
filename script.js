"use strict";

const title = "Учебный проект: JS 23.0";
const screens = "Простые, Сложные, Интерактивные";
const screenPrice = 20000;
const rollback = 15;
const fullPrice = 150000;
const adaptive = true;

console.log(typeof title);
console.log(typeof fullPrice);
console.log(typeof adaptive);

console.log(screens.length);

console.log("Стоимость верстки экранов " + screenPrice + " рублей");
console.log("Стоимость разработки сайта " + fullPrice + " рублей");

console.log(screens.toLowerCase().split(", "));

console.log("Откат посреднику за работу " + Math.round((fullPrice * rollback) / 100) + " рублей");
