const addClassForm = document.querySelector("#addClassForm");
const { section, subject, teacher, timeStart, timeEnd, day, room, submitClassFormBtn } = addClassForm.elements;
const classTable = document.querySelector("#classTable");
const classTableBody = classTable.children[1];
const addClassModal = document.querySelector("#addClassModal");
let editClassUrl;
const addStudentForm = document.querySelector("#addStudentForm");
const addStudentModal = document.querySelector("#addStudentModal");

addClassForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (submitClassFormBtn.innerText === "Edit") {

        const data = await Promise.all([
            fetch("/api/subjects").then(res => res.json()),
            fetch("/api/users/teachers").then(res => res.json()),
            fetch(editClassUrl, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    section: section.value,
                    subject: subject.value,
                    teacher: teacher.value,
                    timeStart: timeStart.value,
                    timeEnd: timeEnd.value,
                    day: day.value,
                    room: room.value
                })
            }).then(res => res.json())
        ]);

        const matchedSubject = data[0].find(subject => subject._id === data[2].subject);
        const matchedTeacher = data[1].find(teacher => teacher._id === data[2].teacher);

        const matchedTableRow = Array.from(classTableBody.children).find(tr => tr.dataset.id === data[2]._id);
        matchedTableRow.innerHTML = `
            <td class="text-nowrap text-uppercase">${data[2].section}</td>
            <td class="text-nowrap text-capitalize">${matchedSubject.title} (${matchedSubject.code})</td>
            <td class="text-capitalize text-nowrap">${matchedTeacher.firstname} ${matchedTeacher.lastname}</td>
            <td class="text-nowrap">${data[2].timeStart} - ${data[2].timeEnd} | ${data[2].day}</td>
            <td class="text-nowrap">${data[2].room}</td>
            <td id="studentsLength">${data[2].students.length}</td>
            <td>
                <div class="d-flex align-items-end">
                    <button type="button" class="badge rounded-pill bg-primary border-0 editStudentBtn" data-url="/api/classes/${data[2]._id}">Edit</button>
                    <button type="button" class="badge rounded-pill bg-danger border-0 deleteStudentBtn" data-url="/api/classes/${data[2]._id}">Delete</button>
                </div>
            </td>
        `;

        section.value = "";
        subject.children[0].selected = true;
        teacher.children[0].selected = true;
        timeStart.value = "";
        timeEnd.value = "";
        day.children[0].selected = true;
        room.value = "";

        bootstrap.Modal.getInstance(addClassModal).hide();

    } else {

        const data = await Promise.all([
            fetch("/api/subjects").then(res => res.json()),
            fetch("/api/users/teachers").then(res => res.json()),
            fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    section: section.value,
                    subject: subject.value,
                    teacher: teacher.value,
                    timeStart: timeStart.value,
                    timeEnd: timeEnd.value,
                    day: day.value,
                    room: room.value
                })
            }).then(res => res.json())
        ]);

        const matchedSubject = data[0].find(subject => subject._id === data[2].subject);
        const matchedTeacher = data[1].find(teacher => teacher._id === data[2].teacher);

        const tr = document.createElement("tr");
        tr.dataset.id = data[2]._id;
        tr.innerHTML = `
            <td class="text-nowrap text-uppercase">${data[2].section}</td>
            <td class="text-nowrap text-capitalize">${matchedSubject.title} (${matchedSubject.code})</td>
            <td class="text-capitalize text-nowrap">${matchedTeacher.firstname} ${matchedTeacher.lastname}</td>
            <td class="text-nowrap">${data[2].timeStart} - ${data[2].timeEnd} | ${data[2].day}</td>
            <td class="text-nowrap">${data[2].room}</td>
            <td id="studentsLength">0</td>
            <td>
                <div class="d-flex align-items-end">
                    <button type="button" class="badge rounded-pill bg-primary border-0 editStudentBtn" data-url="/api/classes/${data[2]._id}">Edit</button>
                    <button type="button" class="badge rounded-pill bg-danger border-0 deleteStudentBtn" data-url="/api/classes/${data[2]._id}">Delete</button>
                </div>
            </td>
        `;
        classTableBody.appendChild(tr);

        const option = document.createElement("option");
        option.className = "text-capitalize";
        option.value = data[2]._id;
        option.innerText = `${data[2].section} | ${matchedSubject.code} | ${matchedTeacher.firstname} ${matchedTeacher.lastname} | ${data[2].timeStart} - ${data[2].timeEnd} | ${data[2].day} | ${data[2].room}`;
        addStudentForm.elements.class.appendChild(option);

        section.value = "";
        subject.children[0].selected = true;
        teacher.children[0].selected = true;
        timeStart.value = "";
        timeEnd.value = "";
        day.children[0].selected = true;
        room.value = "";

        bootstrap.Modal.getInstance(addClassModal).hide();
    }

});

classTableBody.addEventListener("click", async (e) => {
    if (e.target.classList.contains("editStudentBtn")) {
        const editStudentBtn = e.target;
        const url = editStudentBtn.dataset.url;
        
        const res = await fetch(url);
        const data = await res.json();

        section.value = data.section;
        Array.from(addClassForm.elements.subject.children).find(option => option.value === data.subject._id ? option.selected = true : option.selected = false);
        Array.from(addClassForm.elements.teacher.children).find(option => option.value === data.teacher._id ? option.selected = true : option.selected = false);
        timeStart.value = data.timeStart;
        timeEnd.value = data.timeEnd;
        Array.from(addClassForm.elements.day.children).find(option => option.value === data.day ? option.selected = true : option.selected = false);
        room.value = data.room;

        submitClassFormBtn.innerText = "Edit";
        editClassUrl = url;

        new bootstrap.Modal(addClassModal).show();
    }

    if (e.target.classList.contains("deleteStudentBtn")) {
        const deleteStudentBtn = e.target;
        const url = deleteStudentBtn.dataset.url;

        if (confirm("Are you sure you want to delete this class?")) {
            e.target.parentElement.parentElement.parentElement.remove();
            
            const res = await fetch(url, { method: "DELETE" });
            const data = await res.json();

            const matchedOption =  Array.from(addStudentForm.elements.class.children).find(option => option.value === data._id);
            matchedOption.remove();

        }
    }

});

addClassModal.addEventListener("hidden.bs.modal", (e) => {
    section.value = "";
    subject.children[0].selected = true;
    teacher.children[0].selected = true;
    timeStart.value = "";
    timeEnd.value = "";
    day.children[0].selected = true;
    room.value = "";
});

const searchStudentInput = document.querySelector("#searchStudentInput");
const studentsDiv = document.querySelector("#studentsDiv");

searchStudentInput.addEventListener("input", (e) => {
    Array.from(studentsDiv.children).find(div => {
        if (div.dataset.name.toLowerCase().includes(e.target.value.toLowerCase())) {
            div.style.display = "block";
        } else {
            div.style.display = "none";
        }
    })
});

addStudentForm.elements.class.addEventListener("change", async (e) => {

    if (e.target.value !== "") {
        searchStudentInput.disabled = false;
        addStudentForm.elements.submitStudentFormBtn.disabled = false;

        const data = await Promise.all([
            fetch(`/api/classes/${e.target.value}`).then(res => res.json()),
            fetch("/api/users/students").then(res => res.json())
        ]);
    
        // Create students IDs array
        const classStudentsIDs = data[0].students.map(student => student._id);
        // console.log(classStudentsIDs);
    
        // Create students array who are not enrolled in class by filtering IDs
        const studentsNotEnrolledInClass = data[1].filter(student => !classStudentsIDs.includes(student._id));
        // console.log(studentsNotEnrolledInClass);
        
        const studentsFormattedInHTML = studentsNotEnrolledInClass.map(student => {
            return `
            <div class="form-check" data-name="${student.firstname} ${student.lastname}">
                <input type="checkbox" class="form-check-input" id="student${student._id}" name="students" value="${student._id}">
                <label class="form-check-label" for="student${student._id}">${student.firstname} ${student.lastname}</label>
            </div>
            `
        }).join(" ");
    
        studentsDiv.innerHTML = studentsFormattedInHTML;
    } else {
        studentsDiv.innerHTML = "";
    }
});

addStudentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const classID = e.target.elements.class;
    const studentIDs = Array.from(e.target.elements.students).filter(checkbox => checkbox.checked === true).map(checkbox => checkbox.value);

    const res = await fetch(`/api/classes/${classID.value}/students`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ students: studentIDs })
    });
    const data = await res.json();
    
    const matchedTableRow = Array.from(classTableBody.children).find(tr => tr.dataset.id === data._id);
    matchedTableRow.children.studentsLength.innerText = data.students.length;

    e.target.elements.class.children[0].selected = true;
    searchStudentInput.disabled = true;
    studentsDiv.innerHTML = "";
    e.target.elements.submitStudentFormBtn.disabled = false;

    bootstrap.Modal.getInstance(addStudentModal).hide();
});

addStudentModal.addEventListener("hidden.bs.modal", (e) => {
    addStudentForm.elements.class.children[0].selected = true;
    searchStudentInput.disabled = true;
    studentsDiv.innerHTML = "";
});
