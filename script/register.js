const appRegister = new Vue({
    el: '#register',

    data: {
        full_name: '',
        email: '',
        password: '',
        loader: false,
        title: 'Amazing Products You Will Love',
        subtitle: 'Register today and get access to our amazing products at unbeatable prices.',
        users: [],
        apiBase: 'http://127.0.0.1:5000'
    },

    methods: {

        // ✅ Register user
        async registerUser() {
            // Basic validation
            if (!this.full_name || !this.email || !this.password) {
                alert("All fields are required");
                return;
            }

            this.loader = true;

            try {
                const response = await axios.post(`${this.apiBase}/register`, {
                    full_name: this.full_name,
                    email: this.email,
                    password: this.password
                });

                const token = response.data.access_token;

                // Save token
                localStorage.setItem("token", token);

                // Set axios header globally
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // Clear form
                this.full_name = '';
                this.email = '';
                this.password = '';

                // Refresh users list
                await this.getUsers();

            } catch (error) {
                console.error("Full error:", error);
                console.error("Server response:", error.response?.data);

                alert(
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Registration failed"
                );
            } finally {
                this.loader = false;
            }
        },

        // ✅ Fetch users
        async getUsers() {
            try {
                const response = await axios.get(`${this.apiBase}/users`);
                this.users = response.data.data;

                // Reinitialize DataTable safely
                this.$nextTick(() => {
                    if ($.fn.DataTable.isDataTable('#example')) {
                        $('#example').DataTable().destroy();
                    }

                    $('#example').DataTable({
                        responsive: true
                    });
                });

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        }
    },

    // ✅ Run on page load
    mounted() {
        const token = localStorage.getItem("token");

        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        this.getUsers();
    }
});