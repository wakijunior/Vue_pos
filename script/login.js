new Vue({
    el: '#login',

    data: {
        email: '',
        password: '',
        title: 'Amazing Products You Will Love',
        subtitle: 'Login today and get access to our amazing products at unbeatable prices.',
        loader: false
    },

    methods: {

        loginUser() {
            this.loader = true;

            axios.post('http://localhost:5000/login', {
                email: this.email,
                password: this.password
            })
            .then((response) => {

                console.log(response.data);

                // ✅ Save token
                localStorage.setItem(
                    "token",
                    response.data.access_token
                );

                this.loader = false;

                //optional redirect
                window.location.href = "sales.html";

            })
            .catch((error) => {

                alert(
                    error.response?.data?.error || "Login failed"
                );

                this.loader = false;
            });
        }
    }
});