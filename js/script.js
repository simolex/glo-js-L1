"use strict";

const titleProject = document.getElementsByTagName("h1")[0]; //.textContent;

const handlerButtons = document.getElementsByClassName("handler_btn");
const btnStart = handlerButtons.start;
const btnReset = handlerButtons.reset;

const btnPlus = document.querySelector(".screen-btn");

const percentItems = document.querySelectorAll(".other-items.percent");
const numberItems = document.querySelectorAll(".other-items.number");

const controlRollback = document.querySelector(".rollback input[type=range]");
const valueRollback = document.querySelector(".rollback .range-value");

const total = document.getElementById("total");
const totalCount = document.getElementById("total-count");
const totalCountOther = document.getElementById("total-count-other");
const totalFullCount = document.getElementById("total-full-count");
const totalCountRollback = document.getElementById("total-count-rollback");

let screens = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: false,
  servicesPercent: {},
  servicesNumber: {},
  servicePricesPercent: 0,
  servicePricesNumber: 0,

  rollback: 15,
  fullPrice: 0,
  rollbackPrice: 0,
  servicePercentPrice: 0,
  count: 0,
  hasResult: false,

  //Методы валидации
  isNoStrongNumber: function (num) {
    num += "";
    return !isNaN(parseFloat(num)) && isFinite(num);
  },

  isText: function (text) {
    text += "";
    return text && text.trim().length > 0 && !appData.isNoStrongNumber(text);
  },

  init: function () {
    this.addTitle();
    btnStart.addEventListener("click", appData.start);
    btnReset.addEventListener("click", appData.reset);
    btnPlus.addEventListener("click", appData.addScreenBlock);

    screens.forEach((screen) => {
      appData.addScreenEvents(screen);
    });

    controlRollback.value = appData.rollback;
    valueRollback.innerText = appData.rollback + "%";
    controlRollback.addEventListener("input", () => {
      appData.rollback = +controlRollback.value;
      valueRollback.innerText = controlRollback.value + "%";
      if (appData.hasResult) {
        appData.getServicePercentPrices();
        appData.showResult();
      }
    });
  },

  addTitle: function () {
    document.title = titleProject.textContent.trim();
  },

  start: function () {
    if (!appData.addScreens()) {
      return false;
    }
    appData.addServicesPercent();
    appData.addServicesNumber();
    appData.getFullPrice();
    if (appData.hasResult) {
      btnReset.style.display = "";
      btnStart.style.display = "none";
    }
    appData.showResult();
    //appData.logger(appData);
  },
  reset: function () {
    document.location.reload();
  },

  addScreenEvents: function (screen) {
    const select = screen.querySelector("select");
    const input = screen.querySelector("input");

    select.addEventListener("change", () => {
      select.style.borderColor = "";
      select.style.color = "";
    });

    input.addEventListener("input", () => {
      input.style.borderColor = "";
      input.style.color = "";
    });
  },

  addScreens: function () {
    let isValid = true;
    screens.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const nameSelected = select.options[select.selectedIndex].textContent;

      if (select.selectedIndex === 0) {
        select.style.borderColor = "red";
        select.style.color = "red";
        isValid = false;
      }
      if (input.value === "") {
        input.style.borderColor = "red";
        input.style.color = "red";
        isValid = false;
      }

      appData.screens.push({
        id: index,
        name: nameSelected,
        price: +select.value * +input.value,
      });
      appData.count += +input.value;
    });

    if (!isValid) {
      appData.screens = [];
      appData.count = 0;
      alert("Не все параметры Экранов заполнены");
    }

    return isValid;
  },

  addScreenBlock: function () {
    const lastIndex = screens.length - 1;
    const cloneScreen = screens[lastIndex].cloneNode(true);

    appData.addScreenEvents(cloneScreen);
    screens[lastIndex].after(cloneScreen);
    screens = document.querySelectorAll(".screen");
  },

  addServicesPercent: function () {
    percentItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      } else {
        delete appData.servicesPercent[label.textContent];
      }
    });
    //console.log(appData.servicesPercent);
  },

  addServicesNumber: function () {
    numberItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      } else {
        delete appData.servicesNumber[label.textContent];
      }
    });
    //console.log(appData.servicesNumber);
  },

  //Вычисление полной стоимости
  getFullPrice: function () {
    //Расчет стоимости экранов
    appData.screenPrice = appData.screens.reduce(
      (screenPrice, oneScreen) => screenPrice + oneScreen.price,
      0
    );

    //Расчет дополнительных услуг
    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key];
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricesPercent += (appData.screenPrice * appData.servicesPercent[key]) / 100;
    }

    appData.fullPrice =
      appData.screenPrice + appData.servicePricesNumber + appData.servicePricesPercent;

    appData.getServicePercentPrices();
    appData.hasResult = true;
  },

  //Вычисление ставки посредника
  getRollbackPrice: function () {
    appData.rollbackPrice = (appData.fullPrice * appData.rollback) / 100;
  },

  //Вычисление ставки разработчика
  getServicePercentPrices: function () {
    appData.getRollbackPrice();
    appData.servicePercentPrice = Math.ceil(appData.fullPrice - appData.rollbackPrice);
  },

  showResult: function () {
    total.value = appData.screenPrice;
    totalCount.value = appData.count;
    totalCountOther.value = appData.servicePricesPercent + appData.servicePricesNumber;
    totalFullCount.value = appData.fullPrice;
    totalCountRollback.value = appData.servicePercentPrice;
  },

  //Дамп переменных
  logger: function (varObject) {
    for (let key in varObject) {
      if (typeof varObject[key] == "function") {
        console.log(`%cИмя: ${key}, тип: ${typeof varObject[key]}`, "color: blue;");
      } else {
        console.log(`%cИмя: ${key}, тип: ${typeof varObject[key]}, значение:`, "color: green;");
        console.log(varObject[key]);
      }
    }
  },
};

appData.init();

// appData.logger({
//   titleProject,
//   btnStart,
//   btnReset,
//   btnPlus,
//   percentItems,
//   numberItems,
//   controlRollback,
//   valueRollback,
//   total,
//   totalCount,
//   totalCountOther,
//   totalFullCount,
//   totalCountRollback,

//   screens,
// });
