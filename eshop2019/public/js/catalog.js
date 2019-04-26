
const API_URL = 'http://localhost:3000';

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
      },

    },
    mounted() {
      fetch(`${API_URL}/products-catalog`)
        .then(response => response.json())
        .then((items) => {
          this.items = items;
        });
    },
    template: `
     <div class="product-catalog">
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
