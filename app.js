let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let cart = {}; // Хранилище для корзины

// Функция для создания элемента продукта
function createProductItem(product) {
	let itemDiv = document.createElement('div');
	itemDiv.classList.add('item');
	itemDiv.dataset.productId = product.id; // Добавляем ID продукта

	let img = document.createElement('img');
	img.src = product.imageUrls;
	img.alt = product.name;
	img.classList.add('img');

	let p = document.createElement('p');
	p.innerHTML = `${product.name} &bull; <b>${product.price}</b>₽`;

	let button = document.createElement('button');
	button.classList.add('btn');
	button.innerText = 'Добавить';
	button.addEventListener('click', function() {
		addToCart(product);
	});

	itemDiv.appendChild(img);
	itemDiv.appendChild(p);
	itemDiv.appendChild(button);

	return itemDiv;
}

// Функция для обновления элемента продукта с счетчиком и кнопками
function updateProductItem(product) {
	let itemDiv = document.querySelector(`[data-product-id='${product.id}']`);
	if (!itemDiv) return;

	itemDiv.innerHTML = ''; // Очищаем текущий контент

	let img = document.createElement('img');
	img.src = product.imageUrls;
	img.alt = product.name;
	img.classList.add('img');

	let p = document.createElement('p');
	p.innerHTML = `${product.name} &bull; <b>${product.price}</b>₽`;

	if (cart[product.id]) {
		let counterDiv = document.createElement('div');
		counterDiv.classList.add('counter');

		let minusButton = document.createElement('button');
		minusButton.innerText = '-';
		minusButton.classList.add('btn');
		minusButton.classList.add('btn-red');
		minusButton.addEventListener('click', function() {
			removeFromCart(product);
		});

		let countSpan = document.createElement('span');
		countSpan.innerText = cart[product.id];

		let plusButton = document.createElement('button');
		plusButton.innerText = '+';
		plusButton.classList.add('btn');
		plusButton.addEventListener('click', function() {
			addToCart(product);
		});

		counterDiv.appendChild(minusButton);
		counterDiv.appendChild(countSpan);
		counterDiv.appendChild(plusButton);

		itemDiv.appendChild(img);
		itemDiv.appendChild(p);
		itemDiv.appendChild(counterDiv);
	} else {
		let button = document.createElement('button');
		button.classList.add('btn');
		button.innerText = 'Добавить';
		button.addEventListener('click', function() {
			addToCart(product);
		});

		itemDiv.appendChild(img);
		itemDiv.appendChild(p);
		itemDiv.appendChild(button);
	}
}

// Функция для добавления товара в корзину
function addToCart(product) {
	if (cart[product.id]) {
		cart[product.id]++;
	} else {
		cart[product.id] = 1;
	}
	updateProductItem(product);
	updateMainButton();
}

// Функция для удаления товара из корзины
function removeFromCart(product) {
	if (cart[product.id]) {
		cart[product.id]--;
		if (cart[product.id] === 0) {
			delete cart[product.id];
		}
	}
	updateProductItem(product);
	updateMainButton();
}

// Функция для обновления главной кнопки
function updateMainButton() {
	let totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
	if (totalItems > 0) {
		tg.MainButton.setText(`Вы выбрали ${totalItems} товар(ов)`);
		tg.MainButton.show();
	} else {
		tg.MainButton.hide();
	}
}

// Функция для загрузки данных о продуктах
async function loadProducts() {
	try {
		let response = await fetch('http://http://147.45.184.84:4000/api/v1/products/');
		if (response.ok) {
			let products = await response.json();
			let productList = document.getElementById('product-list');
			productList.innerHTML = '';
			products.result.forEach(product => {
				let productItem = createProductItem(product);
				productList.appendChild(productItem);
			});
		} else {
			console.error('Ошибка загрузки продуктов:', response.statusText);
		}
	} catch (error) {
		console.error('Ошибка загрузки продуктов:', error);
	}
}

// Загрузка продуктов при загрузке страницы
loadProducts();

Telegram.WebApp.onEvent("mainButtonClicked", function() {
	tg.sendData(JSON.stringify(cart));
});

let usercard = document.getElementById("usercard");

let p = document.createElement("p");

p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;

usercard.appendChild(p);
