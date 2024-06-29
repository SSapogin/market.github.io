let tg = window.Telegram.WebApp;

tg.expand();

tg.MainButton.textColor = '#FFFFFF';
tg.MainButton.color = '#2cab37';

let item = "";

// Функция для создания элемента продукта
function createProductItem(product) {
	let itemDiv = document.createElement('div');
	itemDiv.classList.add('item');

	let img = document.createElement('img');
	img.src = product.imageUrls;
	img.alt = product.name;
	img.classList.add('img');

	let p = document.createElement('p');
	p.innerHTML = product.name + " &bull; <b>" + product.price + "</b>₽";

	let button = document.createElement('button');
	button.classList.add('btn');
	button.innerText = 'Добавить';
	button.addEventListener('click', function() {
		if (tg.MainButton.isVisible) {
			tg.MainButton.hide();
		} else {
			tg.MainButton.setText(`Вы выбрали товар ${product.name}!`);
			item = product.id;
			tg.MainButton.show();
		}
	});

	itemDiv.appendChild(img);
	itemDiv.appendChild(p);
	itemDiv.appendChild(button);

	return itemDiv;
}

// Функция для загрузки данных о продуктах
async function loadProducts() {
	try {
		let response = await fetch('http://localhost:4000/api/v1/products');
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

Telegram.WebApp.onEvent("mainButtonClicked", function(){
	tg.sendData(item);
});

let usercard = document.getElementById("usercard");

let p = document.createElement("p");

// p.innerText = `${tg.initDataUnsafe.user.first_name}
// ${tg.initDataUnsafe.user.last_name}`;

usercard.appendChild(p);
