
// Remove toast notification after 2 seconds
const removeToast = document.querySelector('.removeToast');
if (removeToast) {
  setTimeout(() => {
    removeToast.remove()
  }, 2000)
}

// Needs to clean the code
// /dashboard
const getUserBtns = document.querySelectorAll('.getUserBtn');
const userForm = document.querySelector('#userForm');
const email = document.querySelector('#email');
const username = document.querySelector('#username');
const radioBtns = Array.from(document.querySelectorAll('.radioRoleBtn'));
const editUserSubmitBtn = document.querySelector('.editUserSubmitBtn');
const editUserCancelBtn = document.querySelector('.editUserCancelBtn');
const deleteUserForms = document.querySelectorAll('.deleteUserForm');

// Needs to clean the code
// Edit button
getUserBtns.forEach((getUserBtn) => {
  getUserBtn.addEventListener('click', (e) => {
    console.log(e.target)
    if (e.target.parentElement.classList.contains('getUserBtn')) {
      const url = getUserBtn.dataset.url;
      fetch(url)
        .then(res => res.json())
        .then(data => {

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
            // if (dataRole.basic === true || dataRole.student === true || dataRole.teacher === true || dataRole.admin === true) {
            if (dataRole.basic || dataRole.student || dataRole.teacher || dataRole.admin) {

              // Loop through radio buttons for roles to find radio button that has id string of basic/student/teacher/admin equivalent to the return value from roles looping
              radioBtns.forEach((radioBtn) => {
                if (radioBtn.id === Object.keys(dataRole)[0]) {
                  radioBtn.checked = true;
                }
              });
            }
          });
          editUserSubmitBtn.disabled = false;
          editUserCancelBtn.style.display = 'block';
        });
      return;
    }
  });
});

// Alert message before changing user role - Admin - /dashboard
if (userForm) {
  userForm.addEventListener('submit', (e) => {
    if (!confirm("Are you sure you want to update info of this user?")) {
      e.preventDefault();
    }
  })
}

// Cancel button to clear input fields - Admin - /dashboard
if (editUserCancelBtn) {
  editUserCancelBtn.addEventListener('click', () => {
    email.value = "";
    email.disabled = true;
    username.value = "";
    username.disabled = true;
    editUserSubmitBtn.disabled = true;
    editUserCancelBtn.style.display = 'none';
    radioBtns.forEach((radioBtn) => {
      radioBtn.checked = false;
      radioBtn.disabled = true;
    });
  })
}

// Delete button to remove user - Admin - /dashboard
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

// Admin - /classes
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

// const selectSubject = document.getElementById("selectSubject");
// const selectSubjectUrl = document.getElementById("selectSubjectUrl");
// const chaptersContainer = document.getElementById("chaptersContainer");
// if (selectSubject) {
//   selectSubject.addEventListener('change', () => {
//     // console.log(selectSubjectUrl.dataset.url)
//     // console.log(`${selectSubjectUrl}/${selectSubject.value}`)
//     fetch(`${selectSubjectUrl.value}/${selectSubject.value}`)
//       .then(res => res.json())
//       .then(data => {
//         // console.log(data)
//         let output = "";
//         data.forEach((data) => {
//           output += `
//           <div class="accordion-item">
//             <h2 class="accordion-header">
//             <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#subject${data._id}">
//               ${data.title}
//             </button>
//             </h2>
//             <div id="subject${data._id}" class="accordion-collapse collapse" data-bs-parent="#chaptersContainer">
//               <div class="accordion-body">
//                 ${data.markedHtml}
//               </div>
//             </div>
//           </div>
//           `
//         });
//         chaptersContainer.innerHTML = output;
//       })
//   })
// }

// Student taking quiz page - Student - /questions/quiz/chapter/:id
const url1 = document.querySelector("#url1");
const url2 = document.querySelector("#url2");
const url3 = document.querySelector("#url3");
const chapter1quiz = document.querySelector("#chapter1quiz");
const chapterId = document.querySelector("#chapterId");
const userId = document.querySelector("#userId");
const questionsLength = document.querySelector("#questionsLength");
// const q1s = document.getElementsByName("Q1");
// const q2s = document.getElementsByName("Q2");
// const q3s = document.getElementsByName("Q3");
// const q4s = document.getElementsByName("Q4");
// const q5s = document.getElementsByName("Q5");

// Gets all element with "Q" in their attributes
//https://stackoverflow.com/questions/16791527/can-i-use-a-regular-expression-in-queryselectorall
function DOMRegex(regex) {
  let output = [];
  for (let i of document.querySelectorAll('*')) {
      for (let j of i.attributes) {
          if (regex.test(j.value)) {
              output.push(i)
          }
      }
  }
  return output;
}
// console.log(DOMRegex(/^Q/));
// console.log(document.querySelectorAll("input[type='radio']"))
// const inputRadioBtns = document.querySelectorAll("input[type='radio']");
const inputRadioBtns = DOMRegex(/^Q/);
// console.log(inputRadioBtns)
// const answers = ['alpha', 'bravo'];

if (chapter1quiz) {
  chapter1quiz.addEventListener("submit", (e) => {
    e.preventDefault();
    try {
      let score = 0;
      fetch(url1.value)
        .then(res => res.json())
        .then(data => {
          const answers = data.map((data) => data.answer);
          if (inputRadioBtns) {
            inputRadioBtns.forEach((inputRadioBtn) => {
              // if (inputRadioBtn.checked && answers.indexOf(inputRadioBtn.value) !== -1) {
              if (inputRadioBtn.checked && answers.includes(inputRadioBtn.value)) {
                score++;
              }
            });
            // console.log(score)
          }
          // console.log(score)
          // console.log(questionsLength.value);
          // console.log(chapterId.value);

          // fetch(`http://localhost:2000/users/quizzes`, {
          fetch(url2.value, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questionsLength: Number(questionsLength.value), chapterId: chapterId.value, score: Number(score)})
          });
          // location.reload();

          location.href = url3.value;
        })
    } catch (err) { console.log(err.message) }
  })
}

// Delete chapter buttons - Admin - /chapters/subject/:id
const delChapterForms = document.querySelectorAll(".delChapterForm");
delChapterForms.forEach((delChapterForm) => {
  delChapterForm.addEventListener('submit', (e) => {
    // e.preventDefault();
    // console.log('submit')
    if (!confirm("Are you sure you want to delete this chapter?")) {
      e.preventDefault();
    }
  })
});

const delClassForms = document.querySelectorAll(".delClassForm");
delClassForms.forEach((delClassForm) => {
  delClassForm.addEventListener('submit', (e) => {
    if (!confirm("Are you sure you want to delete this class?")) {
      e.preventDefault();
    }
  });
});

const delSubjectForms = document.querySelectorAll(".delSubjectForm");
delSubjectForms.forEach((delSubjectForm) => {
  delSubjectForm.addEventListener('submit', (e) => {
    if (!confirm("Are you sure you want to delete this subject?")) {
      e.preventDefault();
    }
  });
});
