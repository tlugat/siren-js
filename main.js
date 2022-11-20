import "./reset.css";
import "./style.css";

const $OPEN_MENU_BUTTON = document.getElementById("app_content_menu_icon");
const $CLOSE_MENU_BUTTON = document.getElementById("app_menu_close");
const $MENU = document.getElementById("app_menu");

const $NAVIGATION_LINKS = document.querySelectorAll("#navlink");
const $PAGES = document.querySelectorAll("#page");

const $CHECK_SIREN_FORM = document.getElementById("check_siren_form");
// const $CHECK_SIREN_FORM_ERROR = document.getElementById(
// 	"check_siren_form_error"
// );
const $CHECK_SIREN_MESSAGE = document.getElementById("check_siren_message");

const $GENERATE_PARTIAL_SIREN_FORM = document.getElementById(
	"generate_partial_siren_form"
);
const $GENERATE_PARTIAL_SIREN_FORM_ERROR = document.getElementById(
	"generate_partial_siren_form_error"
);
const $GENERATE_SIREN_BUTTON = document.getElementById("generate_siren_button");
const $DISPLAY_PARTIAL_SIREN = document.getElementById("display_partial_siren");
const $DISPLAY_SIREN = document.getElementById("display_siren");

const ERROR_MESSAGES = {
	type: "Le numéro doit être un nombre",
	length: "Le numéro doit comporter 9 chiffres",
	luhn: "Le numéro doit respecter la formule de Luhn",
	type_length: "Le numéro doit être un nombre et comporter 9 chiffres",
	partial_length: "Veuillez renseigner les 8 premiers chiffres",
};

function displayFormError(element, error) {
	element.style.display = "block";
	element.textContent = ERROR_MESSAGES[error];
}

function checkSiren(siren) {
	let error = null;
	if (isNaN(siren) || siren.length != 9)
		siren.length != 9 && isNaN(siren)
			? (error = "type_length")
			: siren.length != 9
			? (error = "length")
			: (error = "type");
	else {
		let sum = 0;
		let tmp;
		for (let count = 0; count < siren.length; count++) {
			if (count % 2 == 1) {
				tmp = siren.charAt(count) * 2;
				if (tmp > 9) tmp -= 9;
			} else tmp = siren.charAt(count);
			sum += parseInt(tmp);
		}
		if (sum % 10 != 0) error = "luhn";
	}
	return {
		error,
		isValid: !error,
	};
}

function generateSiren(partialSiren = null) {
	let siren = partialSiren
		? partialSiren + String(getRandomNumber(1, 9))
		: String(getRandomNumber(100000000, 999999999));
	if (checkSiren(siren).isValid) return siren;
	return generateSiren(partialSiren);
}

function generateSirenLastNumber(partialSiren) {
	let error = null;
	let siren;
	if (partialSiren.length !== 8) error = "partial_length";
	else siren = generateSiren(partialSiren);
	return { siren, error };
}

function navigate(page) {
	[...$PAGES].forEach(($element) =>
		$element.dataset.page === page
			? ($element.style.display = "flex")
			: ($element.style.display = "none")
	);
	if (window.screen.width <= 780) {
		$MENU.classList.toggle("active");
	}
}

function getRandomNumber(min, max) {
	let randomNumber = crypto.getRandomValues(new Uint32Array(1))[0];
	randomNumber = randomNumber / 4294967296;
	return Math.floor(randomNumber * (max - min + 1)) + min;
}

$GENERATE_SIREN_BUTTON.addEventListener("click", () => {
	const siren = generateSiren();
	$DISPLAY_SIREN.innerHTML = `<p>Votre n° SIREN : ${siren}</p>`;
});
$GENERATE_PARTIAL_SIREN_FORM.addEventListener("submit", (e) => {
	e.preventDefault();
	const { siren, error } = generateSirenLastNumber(
		e.target.elements["partial_siren"].value
	);
	if (error) {
		displayFormError($GENERATE_PARTIAL_SIREN_FORM_ERROR, error);
		return;
	}
	$DISPLAY_PARTIAL_SIREN.innerHTML = `<p>Votre n° SIREN : ${siren}</p>`;
});
$CHECK_SIREN_FORM.addEventListener("submit", (e) => {
	e.preventDefault();
	const { isValid, error } = checkSiren(e.target.elements["siren"].value);
	$CHECK_SIREN_MESSAGE.innerHTML = `<p>${
		isValid
			? "😁 Ce numéro SIREN est valide !"
			: "❌ Ce numéro SIREN est invalide : " + ERROR_MESSAGES[error]
	}</p>`;
	$CHECK_SIREN_MESSAGE.style.color = isValid ? "#32936f" : "#db2b39";
});
[...$NAVIGATION_LINKS].forEach(($element) =>
	$element.addEventListener("click", () => navigate($element.dataset.link))
);

$CLOSE_MENU_BUTTON.addEventListener("click", () => {
	$MENU.classList.toggle("active");
});
$OPEN_MENU_BUTTON.addEventListener("click", () => {
	$MENU.classList.toggle("active");
});
