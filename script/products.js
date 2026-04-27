const appProducts = new Vue({
    el: '#products',

    data: {
        title: 'Our Products',
        subtitle: 'Manage your inventory easily',
        products: [],
        product_name: '',
        quantity: null,
        price: null,
        loader: false,
        editingId: null,
        imageFile: null,

        apiBase: 'http://127.0.0.1:5000'
    },

    methods: {
        handleImageUpload(event) {
            this.imageFile = event.target.files[0];
        },

        async uploadImage() {
            let formData = new FormData();
            formData.append("image", this.imageFile);

            const response = await axios.post(
                `${this.apiBase}/upload-image`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            return response.data.image_url;
        },

        // ✅ CREATE PRODUCT
        async createProduct() {

            const qty = Number(this.quantity);
            const prc = Number(this.price);

            if (!this.product_name || !qty || !prc || !this.imageFile) {
                alert("All fields required");
                return;
            }

            this.loader = true;

            try {
                let imageUrl = await this.uploadImage();

                const payload = {
                    product_name: this.product_name,
                    quantity: qty,
                    price: prc,
                    product_image: imageUrl,
                    total_price: qty * prc
                };

                if (this.editingId) {

                    await axios.put(
                        `${this.apiBase}/products/${this.editingId}`,
                        payload
                    );

                    this.editingId = null;

                } else {

                    await axios.post(
                        `${this.apiBase}/products`,
                        payload
                    );
                }

                // reset form
                this.product_name = '';
                this.quantity = null;
                this.price = null;
                this.imageFile = null;

                await this.getProducts();

            } catch (error) {
                console.error(error.response?.data || error);
                alert("Failed to save product");

            } finally {
                this.loader = false;
            }
        },
        editProduct(product) {
            this.editingId = product.id;

            this.product_name = product.product_name;
            this.quantity = product.quantity;
            this.price = product.price;


        },

        async deleteProduct(id) {
            if (!confirm("Are you sure?")) return;

            try {
                await axios.delete(`${this.apiBase}/products/${id}`, {
                    headers: {
                        Authorization: "Bearer " + localStorage.getItem("token")
                    }
                });

                this.products = this.products.filter(p => p.id !== id);

            } catch (error) {
                console.error(error.response?.data || error);
                alert("Delete failed");
            }
        },

        // ✅ GET PRODUCTS
        async getProducts() {
            try {
                const response = await axios.get(`${this.apiBase}/products`);

                this.products = response.data;

                this.$nextTick(() => {
                    if ($.fn.DataTable.isDataTable('#productsTable')) {
                        $('#productsTable').DataTable().destroy();
                    }

                    $('#productsTable').DataTable({
                        responsive: true
                    });
                });

            } catch (error) {
                console.error("Fetch error:", error.response?.data || error);
            }
        }
    },

    mounted() {
        const token = localStorage.getItem("token");

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        this.getProducts();
    }
});
