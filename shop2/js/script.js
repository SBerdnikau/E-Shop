
const goods = [
    { image: 'img/un1.jpg', title: 'Shirt', price: 150 },
    { image: 'img/un2.jpg', title: 'Socks', price: 50  },
    { image: 'img/un3.jpg', title: 'Jacket',price: 350},
    { image: 'img/un4.jpg', title: 'Shoes', price: 450 },
    { image: 'img/un5.jpg', title: 'Dress', price: 550 },
    { image: 'img/un6.jpg', title: 'Suit',  price: 650 },
    { image: 'img/un7.jpg', title: 'Vest',  price: 750 },
    { image: 'img/un8.jpg', title: 'Shoes', price: 850 }
 ];

const renderGoodsItem = (image, title, price) => {
    return `<article class="flex-catalog">
                    <a href="single-page.html" class="product">
                        <div class="catalogunit" style="background-image: url(${image});"></div>
                        <h4 class="unit-name">${title}</h4>
                        <div class="unit-price">$${price}</div>
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
};



const renderGoodsList = list => {
    let goodsList = list.map(item => renderGoodsItem( item.image, item.title, item.price ));
    document.getElementById('fetured-items').innerHTML = goodsList;
};

renderGoodsList(goods);


