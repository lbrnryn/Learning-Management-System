function classPage() {
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
          // console.log(e.target)
          // console.log(addStudentBtn.dataset)
          const classesfetchurl = addStudentBtn.dataset.classesfetchurl;
          // const studentfetchurl = addStudentBtn.dataset.studentfetchurl;
          const studentsfetchurl = addStudentBtn.dataset.studentsfetchurl;
          // console.log(classesfetchurl)
          // console.log(studentfetchurl)
          // console.log(studentsfetchurl)
          // console.log(fetchUrl)
          // fetch(fetchUrl)
          //   .then(res => res.json())
          //   .then(data => {
          //     console.log(data);
          //     classId.value = data._id;
          //     section.innerText = `Section: ${data.section.name}`;
          //     subject.innerText = `Subject: ${data.subject.title} (${data.subject.code})`;
          //     teacher.innerText = `Teacher: ${data.teacher.firstname} ${data.teacher.lastname}`;
          //     timeDay.innerText = `Time | Day: ${data.timeStart} - ${data.timeEnd} ${data.day}`;
          //     room.innerText = `Room: ${data.room}`;
          //     addStudentForm.action = `/classes/addstudents/${data._id}?_method=PUT`;
          //   })
          // const classFetch = fetch(fetchUrl).then(res => res.json());

          Promise.all([
            fetch(classesfetchurl).then(res => res.json()),
            // fetch(studentfetchurl).then(res => res.json()),
            fetch(studentsfetchurl).then(res => res.json())
          ])
              .then(data => {
                // console.log(data[0].student);
                // console.log(data[1]);
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
                // console.log(differences)

                if (differences.length == 0) {
                  studentsCheckbox.innerHTML = `<p>All students are enrolled in this class</p>`;
                } else {
                  // console.log(`Difference: ${JSON.stringify(difference)}`)
                  let output = "";
                  differences.forEach((difference) => {
                    // console.log(difference)
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
}

export { classPage }
