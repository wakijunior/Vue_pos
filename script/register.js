const appRegister = new Vue({
        el: '#register',
        data: {
            full_name: '',
            email: '',
            password: '',
            loader: false,
            users: []
        },
        methods: {
            registerUser() {
                this.loader = true;

                axios.post('http://127.0.0.1:5000/register', {
                    full_name: this.full_name,
                    email: this.email,
                    password: this.password
                })
                    .then((response) => {
                        localStorage.setItem("token", response.data.access_token);

                        axios.defaults.headers.common['Authorization'] =
                            "Bearer " + response.data.access_token;

                        this.loader = false;
                        this.getUsers();
                    })
                    .catch((error) => {
                        console.error(error);
                        this.loader = false;
                    });
            },

            getUsers() {
                axios.get('http://127.0.0.1:5000/users')
                    .then((response) => {
                        this.users = response.data;

                        this.$nextTick(() => {
                            if ($.fn.DataTable.isDataTable('#example')) {
                                $('#example').DataTable().destroy();
                            }
                            $('#example').DataTable();
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },

        mounted() {
            this.getUsers();
        }
    });

