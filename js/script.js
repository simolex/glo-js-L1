"use strict";

const titleProject = document.getElementById("title");

//const handlerButtons = document.getElementById("start");
const btnStart = document.getElementById("start");
const btnReset = document.getElementById("reset");

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

const checkCmsOpen = document.getElementById("cms-open");
const blockCmsVariants = document.querySelector(".hidden-cms-variants");
const selectCmsType = document.getElementById("cms-select");
const inputCmsPercent = document.getElementById("cms-other-input");

let screenInputs = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
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

  isCmsSelected: false,
  getCmsPercent: () => 0,

  //Методы валидации
  isNoStrongNumber: function (num) {
    num += "";
    return !isNaN(parseFloat(num)) && isFinite(num);
  },

  isText: function (text) {
    text += "";
    return text && text.trim().length > 0 && !this.isNoStrongNumber(text);
  },

  init: function () {
    this.addTitle();
    btnStart.addEventListener("click", () => this.start());
    btnReset.addEventListener("click", () => this.reset());
    btnPlus.addEventListener("click", () => this.addScreenBlock());
    checkCmsOpen.addEventListener("click", (e) => this.openCmsBlock(e.target.checked));
    selectCmsType.addEventListener("input", (e) => {
      this.selectCms(e.target);
    });
    inputCmsPercent.addEventListener("input");
    screenInputs.forEach((screen) => {
      this.addScreenEvents(screen);
    });

    this.updateRollback(this.rollback, true);
    controlRollback.addEventListener("input", () => {
      this.updateRollback(controlRollback.value);
      if (this.hasResult) {
        this.getServicePercentPrices();
        this.showResult();
      }
    });
  },

  addTitle: function () {
    document.title = titleProject.textContent.trim();
  },

  start: function () {
    if (!this.addScreens()) {
      return false;
    }
    if (!this.validateCmsBlock()) {
      return false;
    }
    this.addServicesPercent();
    this.addServicesNumber();
    this.getFullPrice();
    if (this.hasResult) {
      this.disableScreens();
      btnReset.style.display = "";
      btnStart.style.display = "none";
    }
    this.showResult();
    //this.logger(this);
    return true;
  },

  reset: function () {
    this.screens = [];
    screenInputs.forEach((item, index) => {
      if (index > 0) {
        item.remove();
      } else {
        item.querySelector("select").selectedIndex = 0;
        item.querySelector("input").value = "";
      }
    });
    screenInputs = document.querySelectorAll(".screen");
    this.disableScreens(false);

    this.screenPrice = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    percentItems.forEach((item) => {
      item.querySelector("input[type=checkbox]").checked = false;
    });
    numberItems.forEach((item) => {
      item.querySelector("input[type=checkbox]").checked = false;
    });

    this.rollback = 15;
    this.updateRollback(this.rollback, true);
    this.fullPrice = 0;
    this.rollbackPrice = 0;
    this.servicePercentPrice = 0;
    this.count = 0;
    this.hasResult = false;
    [total, totalCount, totalCountOther, totalFullCount, totalCountRollback].forEach((item) => {
      item.value = "0";
    });

    btnReset.style.display = "none";
    btnStart.style.display = "";
  },

  validateCmsBlock: function () {
    let isValid = true;
    if (this.isCmsSelected) {
      if (selectCmsType.selectedIndex === 0) {
        selectCmsType.style.borderColor = "red";
        selectCmsType.style.color = "red";
        isValid = false;
      } else if (selectCmsType.value == "other") {
        if (inputCmsPercent.value === "") {
          inputCmsPercent.style.borderColor = "red";
          inputCmsPercent.style.color = "red";
          isValid = false;
        }
      }
    }
    return isValid;
  },

  openCmsBlock: function (isOpen) {
    this.isCmsSelected = isOpen;
    blockCmsVariants.style.display = isOpen ? "" : "none";
  },

  selectCms: function (that) {
    that.style.borderColor = "";
    that.style.color = "";

    inputCmsPercent.closest(".main-controls__input").style.display =
      that.value == "other" ? "" : "none";

    this.getCmsPercent =
      that.value == "other"
        ? () => +inputCmsPercent.value
        : that.value == "50"
        ? () => 50
        : () => 0;
  },

  addScreens: function () {
    let isValid = true;
    screenInputs.forEach((screen, index) => {
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

      this.screens.push({
        id: index,
        name: nameSelected,
        price: +select.value * +input.value,
      });
      this.count += +input.value;
    });

    if (!isValid) {
      this.screens = [];
      this.count = 0;
      alert("Не все параметры Экранов заполнены");
    }

    return isValid;
  },

  addScreenBlock: function () {
    const lastIndex = screenInputs.length - 1;
    const cloneScreen = screenInputs[lastIndex].cloneNode(true);

    this.addScreenEvents(cloneScreen);
    screenInputs[lastIndex].after(cloneScreen);
    screenInputs = document.querySelectorAll(".screen");
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

  disableScreens: function (state = true) {
    screenInputs.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      select.disabled = state;
      input.disabled = state;
    });
  },

  addServicesPercent: function () {
    percentItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      } else {
        delete this.servicesPercent[label.textContent];
      }
    });
  },

  addServicesNumber: function () {
    numberItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      } else {
        delete this.servicesNumber[label.textContent];
      }
    });
  },

  //Вычисление полной стоимости
  getFullPrice: function () {
    //Расчет стоимости экранов
    this.screenPrice = this.screens.reduce(
      (screenPrice, oneScreen) => screenPrice + oneScreen.price,
      0
    );

    //Расчет дополнительных услуг
    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    for (let key in this.servicesPercent) {
      this.servicePricesPercent += (this.screenPrice * this.servicesPercent[key]) / 100;
    }

    this.fullPrice = this.screenPrice + this.servicePricesNumber + this.servicePricesPercent;

    this.getServicePercentPrices();
    this.hasResult = true;
  },

  updateRollback: function (sizeRollback, needInit = false) {
    if (needInit) {
      controlRollback.value = sizeRollback;
    }
    this.rollback = +sizeRollback;
    valueRollback.innerText = sizeRollback + "%";
  },

  //Вычисление ставки посредника
  getRollbackPrice: function () {
    this.rollbackPrice = (this.fullPrice * this.rollback) / 100;
  },

  //Вычисление ставки разработчика
  getServicePercentPrices: function () {
    this.getRollbackPrice();
    this.servicePercentPrice = Math.ceil(this.fullPrice - this.rollbackPrice);
  },

  showResult: function () {
    total.value = this.screenPrice;
    totalCount.value = this.count;
    totalCountOther.value = this.servicePricesPercent + this.servicePricesNumber;
    totalFullCount.value = this.fullPrice;
    totalCountRollback.value = this.servicePercentPrice;
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
