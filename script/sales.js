const API = axios.create({
    baseURL: 'http://127.0.0.1:5000'
});

// attach token automatically
API.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

const appSales = new Vue({
    el: '#sales',

    data: {
        title: 'Amazing Products You Will Love',
        subtitle: 'High quality products at unbeatable prices.',
        cart: [],
        products: [] // 🔥 now comes from backend
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

        // 🔥 LOAD PRODUCTS FROM FLASK
        fetchProducts() {
            API.get('/products')
                .then(res => {
                    this.products = res.data.map(p => ({
                        id: p.id, // ✅ IMPORTANT
                        name: p.product_name,
                        price: p.price,
                        description: 'From database',
                        product_image: p.product_image
                    }));
                })
                .catch(err => console.error(err));
        },

        addToCart(product) {
            const existing = this.cart.find(item => item.id === product.id);

            if (existing) {
                existing.qty++;
            } else {
                this.cart.push({
                    id: product.id, // ✅ use DB id (not Date.now)
                    name: product.name,
                    price: product.price,
                    product_image: product.product_image,
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

        // 💳 SIMPLE CHECKOUT (works with your API)
        checkout() {
            if (!this.cart.length) return;

            const confirmBuy = confirm(`Proceed to checkout? Total: ${this.total}`);
            if (!confirmBuy) return;

            // Step 1: create ONE sale per item and capture IDs
            const requests = this.cart.map(item => {
                return API.post('/sales', {
                    product_id: item.id
                });
            });

            Promise.all(requests)
                .then(responses => {

                    // 🔥 Get ALL sale IDs
                    const saleIds = responses.map(r => r.data.sale_id);

                    // use first sale (simple version)
                    const sale_id = saleIds[0];

                    // Step 2: M-Pesa payment with real sale_id
                    return API.post('/stk-push', {
                        phone_number: '2547XXXXXXXX',
                        amount: this.cart.reduce((a, b) => a + b.price * b.qty, 0),
                        sale_id: sale_id   // ✅ REAL ID
                    });
                })
                .then(() => {
                    alert("STK Push sent 📲");
                    this.cart = [];
                    this.saveCart();
                })
                .catch(err => {
                    console.error(err);
                    alert("Checkout failed");
                });
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
        this.fetchProducts(); // 🔥 just added this line
    }
});
