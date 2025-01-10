const FILTER_ITEMS = document.querySelectorAll('.filter-item');
const GIFTS_WRAPPER = document.querySelector('.gifts__wrapper');

let currentCategory;
let currentGifts = [];

FILTER_ITEMS.forEach((item) => {
  item.addEventListener('click', () => {
    FILTER_ITEMS.forEach((el) => el.classList.remove('filter-active'));
    renderGifts(item.textContent);
    item.classList.add('filter-active');
  });
});

async function renderGifts(category) {
  if (currentCategory === category) return;

  const gifts = await getData(category);
  populateDOM(gifts);
  currentGifts = gifts;

  currentCategory = category;
}

function populateDOM(data) {
  GIFTS_WRAPPER.innerHTML = '';
  data.forEach((gift, index) => {
    const card = document.createElement('div');
    card.className = 'gift-card populate-item';
    card.setAttribute('key', index);
    card.setAttribute('onclick', `openModal('${gift.name}')`);
    card.innerHTML = `
			<div class="gift-card__img-wrapper">
				<img src='.${gift.img}' alt="ball" />
			</div>
			<div class="gift-card__content">
				<span class='gift-card__tag ${createTag(gift.category)}'>${gift.category}</span>
				<h3 class="gift-card__title">${gift.name}</h3>
			</div>
	`;
    GIFTS_WRAPPER.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderGifts('all');
});

// utility functions

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

async function getData(category) {
  const response = await fetch('../data/gifts.json');
  const data = await response.json();
  const shuffled = shuffle(data);
  return category === 'all'
    ? shuffled
    : shuffled.filter(
        (gift) => gift.category.toLowerCase() === category.toLowerCase()
      );
}

function createTag(category) {
  const tag = category.slice(3);
  return tag.toLowerCase();
}

// Implementation back to up btn

const UP_BTN = document.querySelector('.up-btn');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300 && window.innerWidth < 768) {
    UP_BTN.style.display = 'flex';
    UP_BTN.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        left: 0,
      });
    });
  } else {
    UP_BTN.style.display = 'none';
  }
});

// MODAL
const MODAL = document.querySelector('.modal');
function openModal(name) {
  MODAL.classList.add('modal-open');
  const selectedGift = currentGifts.find((el) => el.name === name);
  populateModalDOM(selectedGift);
  disableScroll();
}

function populateModalDOM(gift) {
  const modalInner = document.createElement('div');
  modalInner.className = 'modal__inner';

  // Modal image
  const modalImg = document.createElement('div');
  modalImg.className = 'modal__img';

  const img = document.createElement('img');
  img.src = `.${gift.img}`;

  const closeBtn = document.createElement('img');
  closeBtn.src = '../assets/icons/close.svg';
  closeBtn.alt = 'cross';
  closeBtn.className = 'close-btn';
  closeBtn.addEventListener('click', closeModal);

  modalImg.appendChild(img);
  modalImg.appendChild(closeBtn);
  modalInner.appendChild(modalImg);

  // Modal content
  const modalContent = document.createElement('div');
  modalContent.className = 'modal__content';

  // Modal info
  const modalInfo = document.createElement('div');
  modalInfo.className = 'modal__info';

  const modalTag = document.createElement('span');
  modalTag.className = createTag(gift.category) + ' modal__tag';
  modalTag.textContent = gift.category;

  const modalTitle = document.createElement('h3');
  modalTitle.className = 'modal__title';
  modalTitle.textContent = gift.name;

  const modalDescription = document.createElement('p');
  modalDescription.className = 'modal__description';
  modalDescription.textContent = gift.description;

  modalInfo.appendChild(modalTag);
  modalInfo.appendChild(modalTitle);
  modalInfo.appendChild(modalDescription);

  // Modal powers
  const modalPowers = document.createElement('div');
  modalPowers.className = 'modal__powers';

  const powersTitle = document.createElement('h4');
  powersTitle.className = 'powers-title';
  powersTitle.textContent = 'Adds superpowers to:';

  const modalPowersList = document.createElement('ul');
  modalPowersList.className = 'powers__list';

  modalPowers.appendChild(powersTitle);
  modalPowers.appendChild(modalPowersList);

  Object.entries(gift.superpowers).forEach(([name, power]) => {
    const powerItem = document.createElement('li');
    powerItem.className = 'powers__item';

    // Powers info
    const powersInfo = document.createElement('div');
    powersInfo.className = 'powers__item_info';

    const powerName = document.createElement('span');
    powerName.textContent = name;

    const powersRate = document.createElement('span');
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
  MODAL.classList.remove('modal-open');
  MODAL.innerHTML = '';
  enableScroll();
}

function generateStars(power) {
  const activeStars = Number(power.slice(1, 2));

  const powersStars = document.createElement('div');
  powersStars.className = 'powers__item_stars';

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('img');
    star.src = '../assets/icons/snowflake.svg';
    star.alt = 'snowflake';
    star.className =
      activeStars >= i ? 'power-star' : 'power-star power-star--inactive';
    powersStars.appendChild(star);
  }

  return powersStars;
}

window.addEventListener('click', (e) => {
  if (e.target === MODAL) {
    closeModal();
  }
});

function disableScroll() {
  document.body.style.overflow = 'hidden';
}

function enableScroll() {
  document.body.style.overflow = 'auto';
}
