const appSales = new Vue({
    el: '#sales',
    data: {
        title: 'Amazing Products You Will Love',
        subtitle: 'High quality products at unbeatable prices.',
        cart: [],
        products: [
            {
                name: 'Wireless Headphones',
                description: 'High quality sound with noise cancellation.',
                price: 4900,
                image: '../images/wireless-headphones.webp'
            },
            {
                name: 'Smart Watch',
                description: 'Track your fitness and stay connected.',
                price: 3900,
                image: '../images/smart-watch.webp'
            },
            {
                name: 'Bluetooth Speaker',
                description: 'Portable speaker with deep bass.',
                price: 5900,
                image: '../images/bluetooth-speakers.webp'
            }
        ]
    },
    computed: {
        total() {
            const sum = this.cart.reduce((acc, item) => {
                return acc + (item.price * item.qty);
            }, 0);

            return 'Ksh. ' + sum.toLocaleString();
        }
    },
    methods: {

        addToCart(product) {
            const existing = this.cart.find(item => item.name === product.name);

            if (existing) {
                existing.qty++;
            } else {
                this.cart.push({
                    id: Date.now(),
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    qty: 1
                });
            }

            this.saveCart();
        },

        increaseQty(item) {
            const cartItem = this.cart.find(p => p.id === item.id);
            if (cartItem) cartItem.qty++;

            this.saveCart();
        },

        decreaseQty(item) {
            const cartItem = this.cart.find(p => p.id === item.id);

            if (!cartItem) return;

            if (cartItem.qty > 1) {
                cartItem.qty--;
            } else {
                this.removeItem(item);
            }

            this.saveCart();
        },

        removeItem(item) {
            this.cart = this.cart.filter(p => p.id !== item.id);
            this.saveCart();
        },

        checkout() {
            if (!this.cart.length) return;

            const confirmBuy = confirm(
                `Proceed to checkout? Total: ${this.total}`
            );

            if (!confirmBuy) return;

            // simulate API call
            setTimeout(() => {
                alert('Order placed successfully!');
                this.cart = [];
                this.saveCart();
            }, 1000);
        },

        saveCart() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        loadCart() {
            const saved = localStorage.getItem('cart');
            if (saved) {
                this.cart = JSON.parse(saved);
            }
        }
    },
    mounted() {
        this.loadCart();
    }
})