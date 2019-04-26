
const API_URL = 'http://localhost:3000';

Vue.component('product-change', {
    template: `
    <div class="product-description container" >
            <div class="product-desc__wrapper">
                <div class="desc-head">WOMEN COLLECTION
                    <div class="border-bottom"></div>
                </div>
                <div class="product-description-name">Moschino Cheap And Chic</div>
                <div class="product-description-rating">
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                </div>
                <div class="product-description-desc">Compellingly actualize fully researched processes before proactive
                    outsourcing. Progressively syndicate collaborative architectures before cutting-edge services.
                    Completely
                    visualize parallel core competencies rather than exceptional portals.
                </div>
                <div class="product-description-info">
                    <div><span class="desc-info-name">MATERIAL:</span> COTTON</div>
                    <div><span class="desc-info-name">DESIGNER:</span> BINBURHAN</div>
                </div>
                <div class="desc-info-price"></div>
                <div class="choose-form">
                    <div class="form-choose-div"><span class="product-desc-head">CHOOSE COLOR</span><input id="color"
                                                                                                           list="dl_color"
                                                                                                           class="color"
                                                                                                           title="color">
                        <datalist id="dl_color"  >
                            <option label="Red" value="Red"></option>
                            <option label="Blue" value="Blue"></option>
                            <option label="Green" value="Green"></option>
                        </datalist>
                    </div>
                    <div class="form-choose-div"><span class="product-desc-head">CHOOSE SIZE</span><input id="size"
                                                                                                          list="dl_size"
                                                                                                          class="color"
                                                                                                          title="size">
                        <datalist id="dl_size" >
                            <option label="S" value="S"></option>
                            <option label="M" value="M"></option>
                            <option label="L" value="L"></option>
                        </datalist>
                    </div>
                    <div class="form-choose-div"><span class="product-desc-head">QUANTITY</span><input type="number"
                                                                                                       class="number"
                                                                                                       title="number">
                    </div>
                </div>
                <a href="shopping-card.html"
                   class="choose-btn-text">
                    <div class="choose-btn" @click.prevent="handleBuyClick(item)"><i class="fas fa-shopping-cart qw"></i>Add to&nbsp;Cart</div>
                </a>
            </div>
        </div>
    `
});

Vue.component('product-item', {
    props: ['item'],
    template: `<article class="product-flex">
             <a href="single-page.html" class="product">
                 <img class="catalogunit" :src="item.image">
                 <h4 class="unit-name">{{item.name}}</h4>
                 <div class="unit-price">&#x24;{{item.price}}</div>
                 <div class="unit-price-rating">
                     <i class="fas fa-star rat"></i>
                     <i class="fas fa-star rat"></i>
                     <i class="fas fa-star rat"></i>
                     <i class="fas fa-star rat"></i>
                     <i class="fas fa-star rat"></i>
                 </div>
             </a>
             <a id="add" href="#" class="add" @click.prevent="handleBuyClick(item)">Add to&nbsp;Cart</a>
             </article>`,
    methods: {
        handleBuyClick(item) {
            this.$emit('onBuy', item);
        }
    }
});

Vue.component('products', {
    props: ['query'],
    methods: {
        handleBuyClick(item) {
            this.$emit('onbuy', item);
        },
    },
    data() {
        return {
            items: [],
        };
    },
    computed: {
        filteredItems() {
            if(this.query) {
                const regexp = new RegExp(this.query, 'i');
                return this.items.filter((item) => regexp.test(item.name));
            } else {
                return this.items;
            }
        }
    },
    mounted() {
        fetch(`${API_URL}/products-single`)
            .then(response => response.json())
            .then((items) => {
                this.items = items;
            });
    },
    template: `
     <div class="also-flex">
        <product-item v-for="entry in filteredItems" :item="entry" @onBuy="handleBuyClick"></product-item>
      </div>
    `,
});

const app = new Vue({
    el: '#app',
    data: {
        searchQuery: '',
        filterValue: '',
        cart: []
    },
    mounted() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });
    },
    computed: {
        total() {
            return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        },
        count() {
            return this.cart.reduce((acc, item) => acc + item.quantity, 0);
        }
    },
    methods: {
        handleDeleteClick(item) {
            if (item.quantity > 1) {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: item.quantity - 1 }),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'DELETE',
                })
                    .then(() => {
                        this.cart = this.cart.filter((cartItem) => cartItem.id !== item.id);
                    });
            }
        },
        handleSearchClick() {
            this.filterValue = this.searchQuery;
        },
        handleBuyClick(item) {
            const cartItem = this.cart.find((entry) => entry.id === item.id);
            if (cartItem) {
                // товар в корзине уже есть, нужно увеличить количество
                fetch(`${API_URL}/cart/${item.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
                })
                    .then((response) => response.json())
                    .then((item) => {
                        const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                        Vue.set(this.cart, itemIdx, item);
                    });
            } else {
                // товара в корзине еще нет, нужно добавить
                fetch(`${API_URL}/cart`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...item, quantity: 1 })
                })
                    .then((response) => response.json())
                    .then((item) => {
                        this.cart.push(item);
                    });
            }
        }
    }
});