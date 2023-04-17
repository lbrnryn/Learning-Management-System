const editUserBtns = document.querySelectorAll('#editUserBtn');
const userForm = document.querySelector('#userForm');
// const email = document.querySelector('#email');
const username = document.querySelector('#username');
const radioBtns = Array.from(document.querySelectorAll('.radioRoleBtn'));
const submitEditUserBtn = document.querySelector('#submitEditUserBtn');
const cancelEditUserBtn = document.querySelector('#cancelEditUserBtn');
const usersTable = document.querySelector("#usersTable");
let editUserUrl;

usersTable.addEventListener("click", async (e) => {

    if (e.target.parentElement.classList.contains("editUserBtn")) {
    const editUserBtn = e.target.parentElement;
    const url = editUserBtn.dataset.url;

    const res = await fetch(url);
    const data = await res.json();

    editUserUrl = `/api/users/${data._id}`;
    username.disabled = false;
    username.value = data.username;
    radioBtns.forEach(radioBtn => {
        radioBtn.disabled = false;
        if (radioBtn.value === data.role) { radioBtn.checked = true }
    });
    submitEditUserBtn.disabled = false;
    cancelEditUserBtn.style.display = 'block';
    }

    if (e.target.parentElement.classList.contains("deleteUserBtn")) {
        const deleteUserBtn = e.target.parentElement;
        const url = deleteUserBtn.dataset.url;
    
        if (confirm("Are you sure you want to delete this user?")) {
            deleteUserBtn.parentElement.parentElement.remove();
            await fetch(url, { method: "DELETE" });
        }
    }

});

// Clear input fields when cancelEditUserBtn has been clicked
cancelEditUserBtn.addEventListener('click', () => {
    userForm.action = "";
    username.disabled = true;
    username.value = "";
    radioBtns.forEach(radioBtn => {
        radioBtn.checked = false;
        radioBtn.disabled = true;
    });
    submitEditUserBtn.disabled = true;
    cancelEditUserBtn.style.display = 'none';
});


userForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!(confirm("Are you sure you want to update info of this user?"))) {
        userForm.action = "";
        username.disabled = true;
        username.value = "";
        radioBtns.forEach(radioBtn => {
            radioBtn.disabled = true;
            radioBtn.checked = false;
        });
        submitEditUserBtn.disabled = true;
        cancelEditUserBtn.style.display = 'none';
    } else {
        const res = await fetch(editUserUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                username: e.target.elements.username.value,
                role: e.target.elements.role.value
            })
        });
        const data = await res.json();

        const tbody = usersTable.children[1];
        const trows = Array.from(tbody.children);
        const foundUserRow = trows.find(tr => tr.dataset.id === data._id);
        foundUserRow.innerHTML = `
            <td class="text-capitalize">${data.username}</td>
            <td class="text-capitalize">${data.role}</td>
            <td class="d-flex">
            <button type="button" class="border-0 bg-transparent editUserBtn" data-url="/api/users/${data._id}"><i class="bi bi-pencil-fill text-primary"></i></button>
            <form class="deleteUserForm" action="/api/users/${data._id}?_method=DELETE" method="post">
                <button class="border-0 bg-transparent" type="submit"><i class="bi bi-trash3-fill text-danger"></i></button>
            </form>
            </td>
        `;

        username.disabled = true;
        username.value = "";
        radioBtns.forEach(radioBtn => {
            radioBtn.disabled = true;
            radioBtn.checked = false;
        });
        submitEditUserBtn.disabled = true;
        cancelEditUserBtn.style.display = 'none';
    }
});