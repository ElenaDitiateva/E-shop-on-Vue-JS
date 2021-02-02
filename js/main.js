const API = 'https://raw.githubusercontent.com/ElenaDitiateva/Project_1/dev/json';

const app = new Vue ({
    el: '#app',
    data: {
        userSearch: '',
        showCart: false,
        catalogUrl: '/catalogData.json',
        cartUrl: '/getBasket.json',
        cartItems: [],
        filtered: [],
        imgCart: 'https://placehold.it/70x60',
        products: [],
        counter: 0,
        imgProduct: 'https://placehold.it/200x150'
    },
    methods: {
        getJson(url) {
            return fetch(url)
                .then(result => result.json())
                .catch(error => console.log(error))
        },
        addProduct(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if(data.result === 1) {
                       let find = this.cartItems.find(el => el.id_product === item.id_product);
                       if(find) {
                           find.quantity++;
                       } else {
                           const prod = Object.assign({quantity: 1}, item);
                           this.cartItems.push(prod)
                       }
                    }
                    this.countCart()
                })
        },
        remove(item) {
            this.getJson(`${API}/addToBasket.json`)
                .then(data => {
                    if (data.result === 1) {
                        if(item.quantity>1) {
                            item.quantity--;
                        } else {
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                    }
                    this.countCart()
                })
        },
        countCart() {
            let count = 0;
            this.cartItems.forEach(item => {
                count += item.quantity;
                this.counter = count;
            });
            if (this.cartItems == 0) {
                this.counter = 0
            }            
        },
        filter() {
            let regexp = new RegExp(this.userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
    mounted() {
        this.getJson(`${API + this.cartUrl}`)
            .then(data => {
                for (let item of data.contents) {
                    this.$data.cartItems.push(item);
                }
                this.countCart()
            });
        this.getJson(`${API + this.catalogUrl}`)
            .then(data => {
                for (let item of data) {
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
    }

});
