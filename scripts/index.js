// Implementation of the burger menu
const BURGER = document.querySelector('.burger')
const NAV = document.querySelector('.nav')
const NAV_LINKS = document.querySelectorAll('.nav__link')
const LOGO = document.querySelector('.logo-wrapper')

BURGER.addEventListener('click', () => {
	NAV.classList.toggle('nav-open')
	BURGER.classList.toggle('burger-cross')

	if (NAV.classList.contains('nav-open')) {
		disableScroll()
	} else {
		enableScroll()
	}
})

NAV_LINKS.forEach(link => {
	link.addEventListener('click', closeNav)
})

LOGO.addEventListener('click', closeNav)

function closeNav() {
	NAV.classList.remove('nav-open')
	BURGER.classList.remove('burger-cross')
	enableScroll()
}

function disableScroll() {
	document.body.style.overflow = 'hidden'
}

function enableScroll() {
	document.body.style.overflow = 'auto'
}
