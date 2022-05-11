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

// Home Page
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

// Class Page
const addStudentBtns = document.querySelectorAll('.addStudentBtn');
const classId = document.getElementById('classId');
const section = document.getElementById('section');
const subject = document.getElementById('subject');
const teacher = document.getElementById('teacher');
const timeDay = document.getElementById('timeDay');
const room = document.getElementById('room');
const addStudentForm = document.getElementById('addStudentForm');
const studentsCheckbox = document.querySelector('.studentsCheckbox');
const searchInput = document.getElementById('searchInput');
const addStudentSubmitBtn = document.querySelector('.addStudentSubmitBtn');
const searchItems = document.querySelectorAll('.searchItem');
const addStudentCancelBtn = document.querySelector('.addStudentCancelBtn');

if (addStudentBtns) {
  addStudentBtns.forEach((addStudentBtn) => {
    addStudentBtn.addEventListener('click', (e) => {
      try {
        const classesfetchurl = addStudentBtn.dataset.classesfetchurl;
        const studentsfetchurl = addStudentBtn.dataset.studentsfetchurl;

        Promise.all([
          fetch(classesfetchurl).then(res => res.json()),
          fetch(studentsfetchurl).then(res => res.json())
        ])
            .then(data => {
              classId.value = data[0]._id;
              section.innerText = `Section: ${data[0].section.name}`;
              subject.innerText = `Subject: ${data[0].subject.title} (${data[0].subject.code})`;
              teacher.innerText = `Teacher: ${data[0].teacher.firstname} ${data[0].teacher.lastname}`;
              timeDay.innerText = `Time | Day: ${data[0].timeStart} - ${data[0].timeEnd} ${data[0].day}`;
              room.innerText = `Room: ${data[0].room}`;
              addStudentForm.action = `/classes/addstudents/${data[0]._id}?_method=PUT`;
              searchInput.disabled = false;
              searchItems.forEach((searchItem, i) => {
                searchItem.disabled = false;
              });
              addStudentSubmitBtn.disabled = false;
              addStudentCancelBtn.style.display = "block";

              const studentsInClass = data[0].student;
              const students = data[1];

              function getDifference(arr1, arr2) {
                return arr1.filter(obj1 => {
                  return !arr2.some(obj2 => {
                    return obj1._id === obj2._id;
                  })
                })
              }

              const differences = [
                ...getDifference(studentsInClass, students),
                ...getDifference(students, studentsInClass)
              ]

              if (differences.length == 0) {
                studentsCheckbox.innerHTML = `<p>All students are enrolled in this class</p>`;
              } else {
                let output = "";
                differences.forEach((difference) => {
                  output += `
                    <div class="form-check mb-3">
                      <input id="check${difference._id}" class="form-check-input searchItem" type="checkbox" data-name="{{this.firstname}} {{this.lastname}}" name="student" value="${difference._id}">
                      <label class="form-check-label text-capitalize" for="check${difference._id}">
                        ${difference.firstname} ${difference.lastname}
                      </label>
                    </div>
                  `
                });
                studentsCheckbox.innerHTML = output;
              }
            })
      } catch (err) {
        console.log(err.message)
      }
    })
  });
}

// console.log(searchItems)
// if (searchInput) {
//   searchInput.addEventListener('input', (e) => {
//     // console.log(e.target.value)
//     // console.log(searchItems)
//     // searchItems.forEach((item) => {
//     //   // console.log(item.dataset.name)
//     //   if (!item.dataset.name.toLowerCase().includes(e.target.value)) {
//     //     // console.log(item)
//     //     item.parentElement.style.display = "none";
//     //   } else {
//     //     item.parentElement.style.display = "block";
//     //   }
//     // });
//   })
// }
if (addStudentCancelBtn) {
  addStudentCancelBtn.addEventListener("click", () => {
    classId.value = '';
    section.innerText = `Section: `;
    subject.innerText = `Subject: `;
    teacher.innerText = `Teacher: `;
    timeDay.innerText = `Time | Day: `;
    room.innerText = `Room: `;
    addStudentForm.action = ``;
    searchInput.disabled = true;
    searchItems.forEach((searchItem, i) => {
      searchItem.disabled = true;
    });
    addStudentSubmitBtn.disabled = true;
    addStudentCancelBtn.style.display = "none";
    studentsCheckbox.innerHTML = "";
  })
}

const selectSubject = document.getElementById("selectSubject");
const chaptersContainer = document.getElementById("chaptersContainer");
if (selectSubject) {
  selectSubject.addEventListener('change', () => {
    fetch(`http://localhost:2000/api/chapters/${selectSubject.value}`)
      .then(res => res.json())
      .then(data => {
        // console.log(data)
        let output = "";
        data.forEach((data) => {
          output += `
          <div class="accordion-item">
            <h2 class="accordion-header">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#subject${data._id}">
              ${data.title}
            </button>
            </h2>
            <div id="subject${data._id}" class="accordion-collapse collapse" data-bs-parent="#chaptersContainer">
              <div class="accordion-body">
                ${data.markedHtml}
              </div>
            </div>
          </div>
          `
        });
        chaptersContainer.innerHTML = output;
      })
  })
}
