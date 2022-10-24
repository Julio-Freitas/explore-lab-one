const _$ = (selector) => document.querySelector(selector);
const _$All = (selector) => document.querySelectorAll(selector);

const ccForm = _$All("form input");
const animateLogoSpin = _$(".logo-spin");

const _handleAnimateLogoSpin = (action) => () =>
  animateLogoSpin.classList[action || "add"]("active");

ccForm.forEach((input) => {
  input.addEventListener("focus", _handleAnimateLogoSpin("add"));
  input.addEventListener("blur", _handleAnimateLogoSpin("remove"));
});
