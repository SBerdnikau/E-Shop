//Элемент коталога товаров
class GoodsItem {
    constructor(image, title, price){
        this.image = image;
        this.title = title;
        this.price = price;
    }

    //отрисовка товара коталога
    render(){
        return  `<article class="product-flex">
        <a href="single-page.html" class="product">
            <div class="catalogunit" style="background-image: url(${this.image});"></div>
            <h4 class="unit-name">${this.title}</h4>
            <div class="unit-price">$${this.price.toFixed(2)}</div>
            <div class="unit-price-rating">
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
                <i class="fas fa-star rat"></i>
            </div>
        </a>
        <a href="shopping-card.html" class="add">Add to&nbsp;Cart</a>
    </article>`;
    } 

}

//Коталог
class GoodsList {
    constructor(){
        this.goods = [];
    }

    //метод для чтения с сервера данных
    fetchGoods(){
        this.goods = [
            { image: 'img/un1.jpg', title: 'Shirt', price: 150 },
            { image: 'img/un2.jpg', title: 'Socks', price: 50  },
            { image: 'img/un3.jpg', title: 'Jacket',price: 350},
            { image: 'img/un4.jpg', title: 'Shoes', price: 450 },
            { image: 'img/un5.jpg', title: 'Dress', price: 550 },
            { image: 'img/un6.jpg', title: 'Suit',  price: 650 },
            { image: 'img/un7.jpg', title: 'Vest',  price: 750 },
            { image: 'img/un8.jpg', title: 'Shoes', price: 850 }
        ];

        this.goods = this.goods.map(item => new GoodsItem(item.image, item.title, item.price));

    }

    render(){
        const lisiHtml = this.goods.map(item =>item.render());
        return lisiHtml.join('');
    }
}

//Элемент корзины
class CartItem extends GoodsItem{
    constructor(image, title, price, count){
        super(image, title, price);
        this.count = count;
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
class CartList{

    //для хранения заказов
    constructor(){
        this.cart = [];
    }

    fetchCart(){
        this.cart = [
            { image: 'img/un1.jpg', title: 'Shirt', price: 150, count: 2},
            { image: 'img/un2.jpg', title: 'Socks', price: 50,  count: 3},
            { image: 'img/un3.jpg', title: 'Jacket',price: 350, count: 2}
        ];

        this.cart = this.cart.map(item => new CartItem(item.image, item.title, item.price, item.count));

    }

    render(){
        // отрисовка всех товаров в корзине
        const lisiHtml = this.cart.map(item =>item.render());
        return lisiHtml.join('');
    }

    totalPrice(){
        //общая сумма в корзине
        return this.cart.reduce( (acc, item) => {
            return acc + (item.price * item.count);
        }, 0 );
    }

    totalCount(){
        //общее количество товаров в корзине
        return this.cart.reduce( (acc, item) => {
            return acc + item.count;
        },0 );
    }


}

//обьект для отрисовки коталога товаров
const list = new GoodsList();
list.fetchGoods();
document.querySelector('.flex-catalog').innerHTML = list.render();

//обьект для отрисовки корзины
const cart = new CartList();
cart.fetchCart();
document.querySelector('.render__cartList').innerHTML = cart.render();

//общая сумма товаров в корзине
document.querySelector('.total__price').innerHTML = '$'+cart.totalPrice().toFixed(2);

//общее количество товаров в корзине
document.querySelector('.sh-count').innerHTML = cart.totalCount();
