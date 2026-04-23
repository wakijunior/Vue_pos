const appCart = new Vue({
    el: '#cartApp',

    data: {
        cart: []
    },

    computed: {
        total() {
            return 'Ksh ' + this.cart.reduce((sum, item) => {
                return sum + (item.price * item.qty);
            }, 0).toLocaleString();
        }
    },

    mounted() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.cart = JSON.parse(saved);
        }
    },

    methods: {
        save() {
            localStorage.setItem('cart', JSON.stringify(this.cart));
        },

        increaseQty(item) {
            item.qty++;
            this.save();
        },

        decreaseQty(item) {
            if (item.qty > 1) {
                item.qty--;
            } else {
                this.cart = this.cart.filter(p => p.id !== item.id);
            }
            this.save();
        },

        checkout() {
            alert('Checkout coming soon');
        }
    }
});