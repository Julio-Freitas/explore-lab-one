import IMask from "imask";
import { COLORS_CC, PLACEHOLDER_CC } from "./constant/constants";
import {
  cardNumberPattern,
  expirationDatePattern,
  securityCodePattern,
} from "./patternForm";

const _$ = (selector) => document.querySelector(selector);
const _$All = (selector) => document.querySelectorAll(selector);

const ul = _$(".cards");

const ccBgColor01 = _$(".cc-bg svg > g g:nth-child(1) path");
const ccBgColor02 = _$(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = _$(".cc-logo span:nth-child(2) img");

const securityCode = document.querySelector("#security-code");
const expirationDate = document.querySelector("#expiration-date");
const addButton = _$("form button#add-card");
const cardHolder = _$("#card-holder");

const ccHolder = _$(".cc-holder .value");
const ccNumber = _$(".cc-number");
const ccExpiration = _$(".cc-expiration .value");
const ccSecurity = _$(".cc-security .value");
const form = document.forms["form-register"];
const ccForm = _$All("form input");

const securityCodeMasked = IMask(securityCode, securityCodePattern);
const expirationDateMask = IMask(expirationDate, expirationDatePattern);
const cardNumber = document.querySelector("#card-number");
const cardNumberMasked = IMask(cardNumber, cardNumberPattern);

function setCardType(type = "default") {
  ccBgColor01.setAttribute("fill", COLORS_CC[type][0]);
  ccBgColor02.setAttribute("fill", COLORS_CC[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
}
let inputsValues = {
  name: "",
  number: "",
  date: "",
  cvv: "",
  cardtype: "",
  index: "",
};

const setText =
  ({ ele, value }) =>
  () =>
    (ele.innerText = value);

const changeInputValue = ({ id, target }) =>
  ({
    "card-holder": setText({
      ele: ccHolder,
      value: target.value || PLACEHOLDER_CC.name,
    }),
    "card-number": setText({
      ele: ccNumber,
      value: target.value || PLACEHOLDER_CC.number,
    }),
    "expiration-date": setText({
      ele: ccExpiration,
      value: target.value || PLACEHOLDER_CC.expiration,
    }),
    "security-code": setText({
      ele: ccSecurity,
      value: target.value || PLACEHOLDER_CC.cvv,
    }),
  }[id]());

const _handleChageAllInput = ({ target }) => {
  const { id } = target;
  changeInputValue({ id, target });
};

expirationDateMask.on("accept", ({ target }) => {
  const { id } = target;
  changeInputValue({ id, target });
});

const updateCard = ({ target }) => {
  const { cardtype } = cardNumberMasked.masked.currentMask;
  const { id } = target;
  changeInputValue({ id, target });
  setCardType(cardtype);
  inputsValues = { ...inputsValues, cardtype };
};

cardNumberMasked.on("accept", updateCard);

cardHolder.addEventListener("input", _handleChageAllInput);

securityCodeMasked.on("accept", ({ target }) => {
  const { id } = target;
  changeInputValue({ id, target });
});

ccForm.forEach((inputs) =>
  inputs.addEventListener("input", ({ target }) => {
    const { name, value } = target;
    inputsValues = { ...inputsValues, [name]: value };
  })
);

const resetData = () => {
  form.reset();
  inputsValues = {
    name: "",
    cvv: "",
    date: "",
    number: "",
    index: "",
  };
};

const addCardInStorage = ({ list, value }) => {
  const newListStorage = [];
  if (list.length > 0) {
    const lastIndex = list.length - 1;
    const lastItem = list[lastIndex];
    const newCards = {
      ...value,
      index: (+lastItem.index + 1).toString(),
    };

    newListStorage.push(...list, newCards);
  } else {
    newListStorage.push(value);
  }
  return newListStorage;
};
addButton.addEventListener("click", (event) => {
  const index = "0";
  const getStorageCards = JSON.parse(localStorage.getItem("cards"));
  const value = { ...inputsValues, index };
  const isFieldsEmpty = Object.values(value).some((item) => !item);

  if (isFieldsEmpty) return alert("Preencha todos os dados..");
  const newList = addCardInStorage({ list: getStorageCards, value });

  localStorage.setItem("cards", JSON.stringify(newList));
  updateTable(newList);
  resetData();
});

const updateTable = (list) => {
  ul.innerHTML = "";
  list.forEach((item, index) => {
    const cardItem = document.createElement("li");
    const cardCheckboxLabel = document.createElement("label");
    const cardItemName = document.createElement("span");
    const checkBoxSpan = document.createElement("span");
    const checkBoxInput = document.createElement("input");
    const imgElement = document.createElement("img");
    const iconGgTrash = document.createElement("i");

    cardItem.classList.add("cards-item");

    cardCheckboxLabel.classList.add("checkbox-card__action");
    cardCheckboxLabel.setAttribute("for", `card-checkbox-${index}`);

    imgElement.setAttribute("src", `/cc-${item.cardtype || "default"}.svg`);
    imgElement.setAttribute("alt", "ícone padrão de cartão");

    checkBoxSpan.classList.add("checkbox");
    checkBoxInput.setAttribute("type", "checkbox");
    checkBoxInput.setAttribute("id", `card-checkbox-${index}`);
    checkBoxInput.setAttribute("name", `card-checkbox-${index}`);
    iconGgTrash.classList.add("gg-trash");

    checkBoxInput.appendChild(iconGgTrash);
    cardItemName.classList.add("cards-item__name");
    cardItemName.textContent = item.name || "Fulano da Silva";
    checkBoxSpan.appendChild(checkBoxInput);
    checkBoxSpan.appendChild(iconGgTrash);

    checkBoxInput.addEventListener("click", cardClicked({ ...item, index }));
    cardCheckboxLabel.insertAdjacentElement("afterbegin", imgElement);
    cardCheckboxLabel.insertAdjacentElement("afterbegin", cardItemName);
    cardCheckboxLabel.appendChild(checkBoxSpan);
    cardItem.appendChild(cardCheckboxLabel);
    ul.appendChild(cardItem);
  });
};

const cardClicked = (item) => () => {
  const isDelete = window.confirm(`Deseja deletar o card ${item.name}`);
  if (isDelete) {
    const newList = JSON.parse(localStorage.getItem("cards"));
    const { index } = item;
    newList.splice(index, 1);
    localStorage.setItem("cards", JSON.stringify(newList));
    initialTable();
  }
};
const initialTable = () => {
  const getStorageCards = JSON.parse(localStorage.getItem("cards"));
  if (getStorageCards) updateTable(getStorageCards);
};

document.addEventListener("DOMContentLoaded", initialTable, false);
