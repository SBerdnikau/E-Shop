
//парсим json файл
function sendRequest(url) {
    return fetch(url).then( (response) => response.json() )
}

//Адресс сервера (БД)
const API_URL = 'http://localhost:3000';

//Элемент коталога товаров
class Item {
    constructor(id, name, price, image){
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
    }

    //отрисовка товара коталога
    render(){
        return  `<article class="product-flex">
        <a href="single-page.html" class="product">
            <div class="catalogunit" style="background-image: url(${this.image});"></div>
            <h4 class="unit-name">${this.name}</h4>
            <div class="unit-price">$${this.price.toFixed(2)}</div>
            <div class="unit-price-rating">
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
            </div>
        </a>
        <a id="add" href="#" class="add" data-id="${this.id}" data-name="${this.name}" data-price="${this.price}" data-image="${this.image}" data-quantity="${this.quantity=1}" >Add to&nbsp;Cart</a>
    </article>`;
    } 

}

//Коталог
class ItemsList {
    
    constructor() {
        this.items = [];
    }

    //Парсим БД файл
    fetchItems() {
        return new Promise((resolve) => {
            resolve(sendRequest(`${API_URL}/items`).then(
                (items) => {
                    this.items = items.map(item => new Item(item.id, item.name, item.price, item.image));
                }
            ));
        });
    }
    
    //отрисовываем каталог
    render(){
        const listHtml = this.items.map(item =>item.render());
        return listHtml.join('');
    }

    filterItems(query) {
        const regexp = new RegExp(query, 'i');
        this.filteredItems = this.items.filter((item) => regexp.test(item.name))
    }

}

//Элемент корзины
class Cart{
    constructor(id, name, price, image, quantity) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
    }

    //отрисовка товара
    render(){
        return `<div class="product-in-sc">
                                <a href="single-page.html" style="float: left; width: 240px;">
                                    <div class="product-in-sc-img" style="background-image: url(${this.image})">
                                    </div>

                                    <div class="product-in-sc-desc">
                                        <h3 class="h3-sc-name">${this.name}</h3>
                                        <div class="sc-rating">
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                        </div>
                                        <div class="sc-count">${this.quantity}&nbsp;x $${this.price}</div>

                                    </div>
                                </a>
                                <div class="sh__action"><a href="#" class="action"><i
                                        class="far fa-times-circle"></i></a></div>

                            </div>`;
    }
}

//Корзина
class ItemsCart{

    //для хранения заказов
    constructor() {
        this.itemsCart = [];
    }

    //Парсим БД файл
    fetchCartItems() {
        return new Promise((resolve) => {
            resolve(sendRequest(`${API_URL}/cart`).then(
                (itemsCart) => {
                    this.itemsCart = itemsCart.map(item => new Cart(item.id, item.name, item.price, item.image, item.quantity));
                }
            ));
        });
    }

    //отрисовка товаров
    render() {
        const itemsHtmls = this.itemsCart.map(item => item.render());
        return itemsHtmls.join('');
    }

    totalPrice(){
        //общая сумма в корзине
        return this.itemsCart.reduce( (acc, item) => {
            return acc + (item.price * item.quantity);
        }, 0 );
    }

    totalCount(){
        //общее количество товаров в корзине
        return this.itemsCart.reduce( (acc, item) => {
            return acc + item.quantity;
        },0 );
    }


}

//обьект для отрисовки коталога товаров
const items = new ItemsList();
items.fetchItems().then( () => { 
        document.querySelector('.flex-catalog').innerHTML = items.render(); 
    }
);

//обьект для отрисовки корзины
const cartItems = new ItemsCart();
cartItems.fetchCartItems().then(
     () => { document.querySelector('.render__cartList').innerHTML = cartItems.render(); }
);

//общая сумма товаров в корзине
document.querySelector('.total__price').innerHTML = '$'+cartItems.totalPrice();

//общее количество товаров в корзине
document.querySelector('.sh-count').innerHTML = cartItems.totalCount();

//поле поиска
const $searchText = document.querySelector('.search');
const $searchButton = document.querySelector('.search__button');

//отрисовка после поика нужного товара
$searchButton.addEventListener('click', () => {
    items.filterItems($searchText.value);
    document.querySelector('.flex-catalog').innerHTML = items.render();
});

const $add = document.querySelector('.add');
console.log($add);//NULL
if($add !== null){
    $add.addEventListener('click', (event) => {
        event.preventDefault();
        const image = event.dataset.image;
        const name = event.dataset.name;
        const price = event.dataset.price;
        const quantity = event.dataset.quantity;
        fetch('/items', {
            mathod: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({image,name,price,quantity}),
        })
            .then((response) => response.json())
            .then((item) => {
                document.querySelector('.render__cartList').innerHTML = item.render();
            })
    });
}


