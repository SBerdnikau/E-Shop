
const API_URL = 'http://localhost:3000';

//компонент для поиска
Vue.component('search', {
  template:`
  <div>
    <input type="text" class="search" placeholder="Search for Item..." v-model="searchQuery">
    <button class="search__button" @click="handleSearchClick" ><i class="fas fa-search"></i></button>
  </div>
  `,
  data(){
    return {
      searchQuery: ''
    }
  },
  methods:{
    handleSearchClick(){
      this.$emit('search', this.searchQuery);
    }
  }
});

//компонент элемента товара
Vue.component('product-item', {
    props: ['item'],
    template: `<article class="product-flex" >
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

  //компонент для списка товаров
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
      fetch(`${API_URL}/products`)
        .then(response => response.json())
        .then((items) => {
          this.items = items;
        });
    },
    template: `
     <div class="flex-catalog">
        <product-item v-for="entry in filteredItems" :item="entry" @onBuy="handleBuyClick"></product-item>
      </div>
    `,
  });


 // компонент списка для корзины
  Vue.component('cart',{
    props: ['cart'],
    template: `
   
           <div class="product-in-sc" v-for="item in cart" >
        <a href="single-page.html" style="float: left; width: 240px;">
            <img class="product-in-sc-img" :src="item.image" :atr="item.name">

            <div class="product-in-sc-desc">
                <h3 class="h3-sc-name">{{item.name}}</h3>
                <div class="sc-rating">
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                    <i class="fas fa-star rat"></i>
                </div>
                <div class="sc-count">{{item.quantity}}&nbsp;x {{item.price}}</div>

            </div>
        </a>
        <div class="sh__action" ><a href="#"  class="action" ><i
                class="far fa-times-circle" @click.prevent="handleDeleteClick(item)" ></i></a>
        </div>

    </div>
    
    `,
    methods:{
      handleDeleteClick(item) {
          this.$emit('delete', item);
      }
    }
  });
  
  const app = new Vue({
    el: '#app',
    data: {
      filterValue: '',
      cart: []
    },
    computed: {
      total() {
          return this.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
      count() {
          return this.cart.reduce((acc, item) => acc + item.quantity, 0);
      }
  },
      mounted() {
          fetch(`${API_URL}/cart`)
              .then(response => response.json())
              .then((items) => {
                  this.cart = items;
              });
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
      handleSearchClick(query) {
        this.filterValue = query;
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





