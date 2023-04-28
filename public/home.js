const login = document.querySelector('#login');
const register = document.querySelector('#register');
const showRegisterBtn = login.children[2].elements.showRegister;
const showLoginBtn = register.elements.showLogin;
const forms = document.querySelectorAll('.needs-validation');

showRegisterBtn.addEventListener('click', () => {
    login.classList.add("d-none");
    register.classList.remove("d-none");
});

showLoginBtn.addEventListener('click', () => {
    login.classList.remove("d-none");
    register.classList.add("d-none");
});

Array.from(forms).forEach(form => {
    form.addEventListener("submit", (e) => {
        if (!form.checkValidity()) {
            e.preventDefault()
            e.stopPropagation()
        }
        form.classList.add('was-validated')
        setTimeout(() => form.classList.remove('was-validated'), 2000)
    }, false)
});

// const toasts = document.querySelectorAll(".toast")
// // console.log(toast)
// if (toasts) {
//     Array.from(toasts).forEach(toast => {
//         setTimeout(() => {
//             toast.classList.remove('show')
//             toast.classList.add('hide')
//         }, 3000)
//     })
// }

const toasts = document.querySelectorAll(".toast")
// Array.from(toasts).map(toast => {
//     setTimeout(() => {
//         new bootstrap.Toast(toast).hide()
//     }, 3000)
// })

Array.from(toasts).map(toast => setTimeout(() => new bootstrap.Toast(toast).hide(), 2000))