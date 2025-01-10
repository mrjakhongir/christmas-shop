// Implementation of the timer
const DAYS = document.querySelector("#days");
const HOURS = document.querySelector("#hours");
const MINUTES = document.querySelector("#minutes");
const SECONDS = document.querySelector("#seconds");

const targetDate = new Date("2025-12-31T00:00:00Z").getTime();
let remainingTime = targetDate - Date.now();

setInterval(() => {
  remainingTime -= 1000;

  if (remainingTime <= 0) {
    DAYS.textContent = 0;
    HOURS.textContent = 0;
    MINUTES.textContent = 0;
    SECONDS.textContent = 0;
    return;
  }

  const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remainingTime / (1000 * 60)) % 60);
  const seconds = Math.floor((remainingTime / 1000) % 60);

  DAYS.textContent = days;
  HOURS.textContent = hours;
  MINUTES.textContent = minutes;
  SECONDS.textContent = seconds;
}, 1000);

// Implementation of the slider

const SLIDER_WRAPPER = document.querySelector(".slider-wrapper");
const SLIDER = document.querySelector(".slider");
const SLIDER_ITEMS = document.querySelectorAll(".slider__item");
const PREV_BTN = document.querySelector(".prev-btn");
const NEXT_BTN = document.querySelector(".next-btn");

let currentMovement = 0;
let screenWidth = window.innerWidth > 1440 ? 1440 : window.innerWidth;
let maxSlideCount = screenWidth <= 768 ? 6 : 3;
let padding = screenWidth <= 1024 ? 8 : 82;
const fullSliderWidth = SLIDER.scrollWidth;
let stepWidth = Math.ceil(
  (fullSliderWidth + padding * 2 - screenWidth) / maxSlideCount
);
function updateSizes() {
  resetSlider();
}

function resetSlider() {
  disableBtn(PREV_BTN);
  enableBtn(NEXT_BTN);
  SLIDER.style.transform = "translateX(0)";
  currentMovement = 0;
  screenWidth = window.innerWidth > 1440 ? 1440 : window.innerWidth;
  maxSlideCount = screenWidth <= 768 ? 6 : 3;
  padding = screenWidth <= 1024 ? 8 : 82;
  stepWidth = Math.ceil(
    (fullSliderWidth + padding * 2 - screenWidth) / maxSlideCount
  );
  SLIDER_WRAPPER.style.padding = `0 ${padding}px`;
}

window.addEventListener("resize", updateSizes);
PREV_BTN.addEventListener("click", moveRight);
NEXT_BTN.addEventListener("click", moveLeft);

function moveLeft() {
  currentMovement += stepWidth;
  if (currentMovement < fullSliderWidth + padding * 2 - screenWidth) {
    SLIDER.style.transform = `translateX(-${currentMovement}px)`;
    enableBtn(PREV_BTN);
  } else {
    SLIDER.style.transform = `translateX(-${currentMovement}px)`;
    disableBtn(NEXT_BTN);
  }
}

function moveRight() {
  currentMovement -= stepWidth;
  console.log(currentMovement, stepWidth);
  if (currentMovement > 0) {
    SLIDER.style.transform = `translateX(-${currentMovement}px)`;
    enableBtn(NEXT_BTN);
  } else {
    SLIDER.style.transform = `translateX(-${currentMovement}px)`;
    disableBtn(PREV_BTN);
  }
}

function disableBtn(btn) {
  btn.setAttribute("disabled", "true");
}

function enableBtn(btn) {
  btn.removeAttribute("disabled");
}

// Implementation of the random gifts

const BEST_GIFTS_WRAPPER = document.querySelector(".best-gifts__wrapper");
let currentGifts = [];

function getRandomGifts(data) {
  const set = new Set();
  let randomIndex;

  do {
    randomIndex = generateRandomNumber(0, data.length - 1);
    set.add(randomIndex);
  } while (set.has(randomIndex) && set.size !== 4);
  const gifts = data.filter((_, index) => set.has(index));
  currentGifts = gifts;
  return gifts;
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function populateGifts() {
  BEST_GIFTS_WRAPPER.innerHTML = "";
  const allGifts = await getData();
  const randomGifts = getRandomGifts(allGifts);
  renderGifts(randomGifts);
}

function renderGifts(gifts) {
  gifts.forEach((gift) => {
    BEST_GIFTS_WRAPPER.innerHTML += `
			<div class="gift-card" onclick="openModal('${gift.name}')">
				<div class="gift-card__img-wrapper">
					<img src=${gift.img} alt="ball" />
				</div>
				<div class="gift-card__content">
					<span class='gift-card__tag ${createTag(gift.category)}'>${gift.category}</span>
					<h3 class="gift-card__title">${gift.name}</h3>
				</div>
			</div>
		`;
  });
}

window.addEventListener("DOMContentLoaded", () => {
  populateGifts();
  SLIDER_WRAPPER.style.padding = `0 ${padding}px`;
  disableBtn(PREV_BTN);
});

async function getData() {
  const response = await fetch("./data/gifts.json");
  const data = await response.json();
  const shuffled = shuffle(data);
  return shuffled;
}

function createTag(category) {
  const short = category.slice(3);
  return short.toLowerCase();
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// MODAL
const MODAL = document.querySelector(".modal");
function openModal(name) {
  MODAL.classList.add("modal-open");
  const selectedGift = currentGifts.find((el) => el.name === name);
  populateModalDOM(selectedGift);
  disableScroll();
}

function populateModalDOM(gift) {
  const modalInner = document.createElement("div");
  modalInner.className = "modal__inner";

  // Modal image
  const modalImg = document.createElement("div");
  modalImg.className = "modal__img";

  const img = document.createElement("img");
  img.src = `${gift.img}`;

  const closeBtn = document.createElement("img");
  closeBtn.src = "./assets/icons/close.svg";
  closeBtn.alt = "cross";
  closeBtn.className = "close-btn";
  closeBtn.addEventListener("click", closeModal);

  modalImg.appendChild(img);
  modalImg.appendChild(closeBtn);
  modalInner.appendChild(modalImg);

  // Modal content
  const modalContent = document.createElement("div");
  modalContent.className = "modal__content";

  // Modal info
  const modalInfo = document.createElement("div");
  modalInfo.className = "modal__info";

  const modalTag = document.createElement("span");
  modalTag.className = createTag(gift.category) + " modal__tag";
  modalTag.textContent = gift.category;

  const modalTitle = document.createElement("h3");
  modalTitle.className = "modal__title";
  modalTitle.textContent = gift.name;

  const modalDescription = document.createElement("p");
  modalDescription.className = "modal__description";
  modalDescription.textContent = gift.description;

  modalInfo.appendChild(modalTag);
  modalInfo.appendChild(modalTitle);
  modalInfo.appendChild(modalDescription);

  // Modal powers
  const modalPowers = document.createElement("div");
  modalPowers.className = "modal__powers";

  const powersTitle = document.createElement("h4");
  powersTitle.className = "powers-title";
  powersTitle.textContent = "Adds superpowers to:";

  const modalPowersList = document.createElement("ul");
  modalPowersList.className = "powers__list";

  modalPowers.appendChild(powersTitle);
  modalPowers.appendChild(modalPowersList);

  Object.entries(gift.superpowers).forEach(([name, power]) => {
    const powerItem = document.createElement("li");
    powerItem.className = "powers__item";

    // Powers info
    const powersInfo = document.createElement("div");
    powersInfo.className = "powers__item_info";

    const powerName = document.createElement("span");
    powerName.textContent = name;

    const powersRate = document.createElement("span");
    powersRate.textContent = power;

    powersInfo.appendChild(powerName);
    powersInfo.appendChild(powersRate);
    powerItem.appendChild(powersInfo);

    // Powers stars
    powerItem.appendChild(generateStars(power));

    modalPowersList.appendChild(powerItem);
  });

  modalContent.appendChild(modalInfo);
  modalContent.appendChild(modalPowers);

  modalInner.appendChild(modalContent);

  MODAL.appendChild(modalInner);
}

function closeModal() {
  MODAL.classList.remove("modal-open");
  MODAL.innerHTML = "";
  enableScroll();
}

function generateStars(power) {
  const activeStars = Number(power.slice(1, 2));

  const powersStars = document.createElement("div");
  powersStars.className = "powers__item_stars";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("img");
    star.src = "./assets/icons/snowflake.svg";
    star.alt = "snowflake";
    star.className =
      activeStars >= i ? "power-star" : "power-star power-star--inactive";
    powersStars.appendChild(star);
  }

  return powersStars;
}

window.addEventListener("click", (e) => {
  if (e.target === MODAL) {
    closeModal();
  }
});

function disableScroll() {
  document.body.style.overflow = "hidden";
}

function enableScroll() {
  document.body.style.overflow = "auto";
}
