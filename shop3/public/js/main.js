function sendRequst(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.send();

        xhr.onreadystatechange = () => {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                resolve(JSON.parse(xhr.responseText));
            }
        }
    });

}


const API_URL = "http://localhost:3000/";

//Элемент коталога товаров
class Item {
    constructor(id, name, price, image, color, size){
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.color = color;
        this.size = size;
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
        <a href="shopping-card.html" class="add" data-id="${this.id}" data-name="${this.name}" data-price="${this.price}" data-image="${this.image}" data-color="${this.color}" data-size="${this.size}">Add to&nbsp;Cart</a>
    </article>`;
    } 

}

//Коталог
class ItemsList {
    
    constructor() {
        this.items = [];
    }

    fetchItems() {
        return new Promise((resolve) => {
            resolve(sendRequst(`${API_URL}/items`).then(
                (items) => {
                    this.items = items.map(item => new Item(item.id, item.name, item.price, item.image, item.color, item.size));
                }
            ));
        });
    }
    
    render(){
        const lisiHtml = this.items.map(item =>item.render());
        return lisiHtml.join('');
    }

}

//Элемент корзины
class Cart{
    constructor(id, name, price, image, quantity, color, size) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.image = image;
        this.quantity = quantity;
        this.color = color;
        this.size = size;
    }

    //отрисовка товара
    render(){
        return `<div class="product-in-sc">
                                <a href="single-page.html" style="float: left; width: 240px;">
                                    <div class="product-in-sc-img" style="background-image: url(${this.image})">
                                    </div>

                                    <div class="product-in-sc-desc">
                                        <h3 class="h3-sc-name">${this.title}</h3>
                                        <div class="sc-rating">
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                            <i class="fas fa-star rat"></i>
                                        </div>
                                        <div class="sc-count">${this.count}&nbsp;x $${this.price.toFixed(2)}</div>

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

    fetchCartItems() {
        return new Promise((resolve) => {
            resolve(sendRequst(`${API_URL}/cart`).then(
                (items) => {
                    this.itemsCart = items.map(item => new Cart(item.id, item.name, item.price, item.image, item.quantity, item.color, item.size));
                }
            ));
        });
    }

    render() {
        const itemsHtmls = this.itemsCart.map(item => item.render());
        return itemsHtmls.join('');
    }

    totalPrice(){
        //общая сумма в корзине
        return this.itemsCart.reduce( (acc, item) => {
            return acc + (item.price * item.count);
        }, 0 );
    }

    totalCount(){
        //общее количество товаров в корзине
        return this.itemsCart.reduce( (acc, item) => {
            return acc + item.quantity;
        },0 );
    }

    addItem(data) {
        sendRequst(`${API_URL}/cart`).then(
            (items) => {
                if (!items.length) {
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", `${API_URL}/cart`, true);
                    xhr.setRequestHeader("Content-Type", "application/json");

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            JSON.parse(xhr.responseText);
                        }
                    };

                    data.quantity = 1;
                    const newItem = JSON.stringify(data);
                    xhr.send(newItem);
                } else {
                    items.forEach((item, i) => {
                        if (+item.id === +data.id) {
                            const xhr = new XMLHttpRequest();
                            xhr.open("PATCH", `${API_URL}/cart/${+data.id}`, true);
                            xhr.setRequestHeader("Content-Type", "application/json");

                            xhr.onreadystatechange = () => {
                                if (xhr.readyState === XMLHttpRequest.DONE) {
                                    JSON.parse(xhr.responseText);
                                }
                            };

                            const newItem = JSON.stringify({"quantity": +item.quantity + 1});
                            xhr.send(newItem);
                        }

                        if (i === items.length - 1) {
                            const xhr = new XMLHttpRequest();
                            xhr.open("POST", `${API_URL}/cart`, true);
                            xhr.setRequestHeader("Content-Type", "application/json");

                            xhr.onreadystatechange = () => {
                                if (xhr.readyState === XMLHttpRequest.DONE) {
                                    JSON.parse(xhr.responseText);
                                }
                            };

                            data.quantity = 1;
                            const newItem = JSON.stringify(data);
                            xhr.send(newItem);
                        }
                    })
                }
            }
        )
    }





}

//обьект для отрисовки коталога товаров
const items = new ItemsList();
items.fetchItems().then(
    () => { document.querySelector('.flex-catalog').innerHTML = items.render(); }
);

//обьект для отрисовки корзины
// const cartItems = new ItemsCart();
// cartItems.fetchCartItems().then(
//     () => { document.querySelector('.render__cartList').innerHTML = cartItems.render(); }
// );

// const $buttonAdd = document.querySelector('.add');
// $buttonAdd.addEventListener('click', (event) => {
//     event.preventDefault();
//     if (event.target.tagName !== 'A') return;
//     const data = event.target.dataset;
//     cartItems.addItem(data);
// });

//общая сумма товаров в корзине
//document.querySelector('.total__price').innerHTML = '$'+cart.totalPrice().toFixed(2);

//общее количество товаров в корзине
//document.querySelector('.sh-count').innerHTML = cart.totalCount();

f