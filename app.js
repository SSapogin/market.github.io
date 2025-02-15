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
		countSpan.classList.add('counter-product');
		countSpan.innerText = cart[product.id];

		let plusButton = document.createElement('button');
		plusButton.innerText = '+';
		plusButton.classList.add('btn');
		plusButton.addEventListener('click', function() {
			addToCart(product);
		});

		counterDiv.appendChild(minusButton);
		itemDiv.appendChild(countSpan);
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
		tg.MainButton.setText(`Оформить заказ`);
		tg.MainButton.show();
	} else {
		tg.MainButton.hide();
	}
}

// Функция для загрузки данных о продуктах
async function loadProducts() {
	try {
		let response = await fetch('https://marketfather.ru/api/v1/products/', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			}
		});

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

// Функция для отображения страницы оформления заказа
function showCheckoutPage() {
	let mainContent = document.getElementById('main-content');
	let checkoutPage = document.getElementById('checkout');
	let totalPriceElement = document.getElementById('total-price');

	let totalPrice = Object.keys(cart).reduce((total, productId) => {
		let product = products.find(p => p.id == productId);
		return total + (product.price * cart[productId]);
	}, 0);

	totalPriceElement.innerText = totalPrice;

	mainContent.style.display = 'none';
	checkoutPage.style.display = 'block';
}

// Функция для подтверждения заказа
function confirmOrder() {
	let address = document.getElementById('delivery-address').value;
	if (address) {
		tg.sendData(JSON.stringify({
			cart: cart,
			address: address
		}));
	} else {
		alert('Введите адрес доставки.');
	}
}

// Загрузка продуктов при загрузке страницы
loadProducts();

Telegram.WebApp.onEvent("mainButtonClicked", function() {
	showCheckoutPage();
});

document.getElementById('confirm-order').addEventListener('click', confirmOrder);

let usercard = document.getElementById("usercard");

let p = document.createElement("p");

p.innerText = `${tg.initDataUnsafe.user.first_name} ${tg.initDataUnsafe.user.last_name}`;

usercard.appendChild(p);
