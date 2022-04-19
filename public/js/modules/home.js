function homePage() {
  // Toast Notification
  const removeToast = document.querySelector('.removeToast');
  document.addEventListener("DOMContentLoaded", () => {
    // Remove toast notification after 2 seconds
    if (removeToast) {
      setTimeout(() => {
        removeToast.remove()
      }, 2000)
    }
  })

  const editBtns = document.querySelectorAll('.editBtn');
  const userForm = document.querySelector('#userForm');
  const email = document.querySelector('#email');
  const username = document.querySelector('#username');
  const radioBtns = Array.from(document.querySelectorAll('.radioRoleBtn'));
  const editSubmitBtn = document.querySelector('.editSubmitBtn');
  const editCancelBtn = document.querySelector('.editCancelBtn');

  // Edit button
  editBtns.forEach((editBtn) => {
    editBtn.addEventListener('click', (e) => {
      // console.log(e.target.parentElement.classList.contains('editBtn'));
      if (e.target.parentElement.classList.contains('editBtn')) {
        // console.log(editBtn.dataset.id)
        const fetchUrl = editBtn.dataset.url;
        fetch(fetchUrl)
          .then(res => res.json())
          .then(data => {
            // console.log(data)

            userForm.action = `/users/${data._id}?_method=PUT`; // Set form action
            email.disabled = false;
            email.value = data.email;
            username.disabled = false;
            username.value = data.username;
            radioBtns.forEach((radioBtn) => {
              radioBtn.disabled = false;
            });

            // Create Roles Array
            const dataRoles = [
              { basic: data.isBasic },
              { student: data.isStudent},
              { teacher: data.isTeacher},
              { admin: data.isAdmin}
            ];

            // Loop through roles from data to find roles equivalent to true and returns basic/student/teacher/admin
            dataRoles.forEach((dataRole, i) => {
              if (dataRole.basic === true || dataRole.student === true || dataRole.teacher === true || dataRole.admin === true) {
                // console.log(dataRole)
                // console.log(Object.keys(dataRole)[0])

                // Loop through radio buttons for roles to find radio button that has id string of basic/student/teacher/admin equivalent to the return value from roles looping
                radioBtns.forEach((radioBtn) => {
                  if (radioBtn.id === Object.keys(dataRole)[0]) {
                    radioBtn.checked = true;
                  }
                });
              }
            });
            editSubmitBtn.disabled = false;
            editCancelBtn.style.display = 'block';
          });
        return;
      }
    });
  });

  // Message before changing user role
  if (userForm) {
    userForm.addEventListener('submit', (e) => {
      if (!confirm("Are you sure you want to change this user role?")) {
        e.preventDefault();
      }
    })
  }

  // Cancel button for clear input fields
  if (editCancelBtn) {
    editCancelBtn.addEventListener('click', () => {
      email.value = "";
      email.disabled = true;
      username.value = "";
      username.disabled = true;
      editSubmitBtn.disabled = true;
      editCancelBtn.style.display = 'none';
      radioBtns.forEach((radioBtn) => {
        radioBtn.checked = false;
        radioBtn.disabled = true;
      });
    })
  }

  // Delete button for removing user
  const deleteUserForms = document.querySelectorAll('.deleteUserForm');
  // console.log(deleteUserForm)
  if (deleteUserForms) {
    deleteUserForms.forEach((deleteUserForm) => {
      deleteUserForm.addEventListener('submit', (e) => {
        if (!confirm('Are you sure you want to delete this user?')) {
          e.preventDefault();
        }
      })
    })
  }
}


export { homePage }
