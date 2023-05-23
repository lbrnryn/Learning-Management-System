const login = document.querySelector('#login');
const register = document.querySelector('#register');
const showRegisterBtn = login.children[2].elements.showRegister;
const showLoginBtn = register.elements.showLogin;
// const forms = document.querySelectorAll('.needs-validation');
const loginForm = document.querySelector('#loginForm');
const { loginUsername, loginPassword } = loginForm.elements;
const loginAsAdminFormBtn = document.querySelector('#loginAsAdminFormBtn');
const {loginAsAdminFormBtnUsername, loginAsAdminFormBtnPassword } = loginAsAdminFormBtn.elements;
const loginAsStudentFormBtn = document.querySelector('#loginAsStudentFormBtn');
const {loginAsStudentFormBtnUsername, loginAsStudentFormBtnPassword } = loginAsStudentFormBtn.elements;

loginAsAdminFormBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: loginAsAdminFormBtnUsername.value,
            password: loginAsAdminFormBtnPassword.value
        })
    });
    const data = await res.json();
    location.href = data.redirectUrl;
});

loginAsStudentFormBtn.addEventListener('submit', async (e) => {
    e.preventDefault();
    const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: loginAsStudentFormBtnUsername.value,
            password: loginAsStudentFormBtnPassword.value
        })
    });
    const data = await res.json();
    location.href = data.redirectUrl;
});

showRegisterBtn.addEventListener('click', () => {
    login.classList.add("d-none");
    register.classList.remove("d-none");
});

showLoginBtn.addEventListener('click', () => {
    login.classList.remove("d-none");
    register.classList.add("d-none");
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!e.target.checkValidity()) {
        e.stopPropagation();
        e.target.classList.add('was-validated')
        setTimeout(() => e.target.classList.remove('was-validated'), 2000)
    } else {
        const res = await fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: loginUsername.value,
                password: loginPassword.value
            })
        });
        const data = await res.json();

        if (!data.success && data.field === 'username') {
            console.log(data.message);
            return;
        }

        if (!data.success && data.field === 'password') {
            console.log(data.message);
            return;
        }

        location.href = data.redirectUrl;

    }
});

// Array.from(forms).forEach(form => {
//     form.addEventListener("submit", (e) => {
//         if (!form.checkValidity()) {
//             e.preventDefault()
//             e.stopPropagation()
//         }
//         form.classList.add('was-validated')
//         setTimeout(() => form.classList.remove('was-validated'), 2000)
//     }, false)
// });

const toasts = document.querySelectorAll(".toast")

Array.from(toasts).map(toast => setTimeout(() => new bootstrap.Toast(toast).hide(), 2000))