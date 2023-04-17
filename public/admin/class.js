const addClassForm = document.querySelector("#addClassForm");
const { section, subject, teacher, timeStart, timeEnd, day, room, submitClassFormBtn } = addClassForm.elements;
const classTable = document.querySelector("#classTable");
const classTableBody = classTable.children[1];
const addClassModal = document.querySelector("#addClassModal");
let editClassUrl;

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

        // console.log(data);

        const matchedSubject = data[0].find(subject => subject._id === data[2].subject);
        const matchedTeacher = data[1].find(teacher => teacher._id === data[2].teacher);

        const matchedTableRow = Array.from(classTableBody.children).find(tr => tr.dataset.id === data[2]._id);
        matchedTableRow.innerHTML = `
            <td class="text-nowrap text-uppercase">${data[2].section}</td>
            <td class="text-nowrap text-capitalize">${matchedSubject.title} (${matchedSubject.code})</td>
            <td class="text-capitalize text-nowrap">${matchedTeacher.firstname} ${matchedTeacher.lastname}</td>
            <td class="text-nowrap">${data[2].timeStart} - ${data[2].timeEnd} | ${data[2].day}</td>
            <td class="text-nowrap">${data[2].room}</td>
            <td>0</td>
            <td>
                <div class="d-flex align-items-end">
                    <button type="button" class="badge rounded-pill bg-primary border-0 editStudentBtn" data-url="/api/classes/${data[2]._id}">Edit</button>
                    <button type="button" class="badge rounded-pill bg-danger border-0 deleteStudentBtn" data-url="/api/classes/${data[2]._id}">Delete</button>
                    <button type="button" class="badge rounded-pill bg-success border-0 addStudentBtn" data-classesfetchurl="" data-studentsfetchurl="">Add Student</button>
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
        // const { section, subject, teacher, timeStart, timeEnd, day, room } = e.target.elements;
        // console.log(section.value, subject.value, teacher.value, timeStart.value, timeEnd.value, day.value, room.value)

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

        // console.log(data)

        const matchedSubject = data[0].find(subject => subject._id === data[2].subject);
        const matchedTeacher = data[1].find(teacher => teacher._id === data[2].teacher);

        const tr = document.createElement("tr");
        tr.dataset.id = data._id;
        tr.innerHTML = `
            <td class="text-nowrap text-uppercase">${data[2].section}</td>
            <td class="text-nowrap text-capitalize">${matchedSubject.title} (${matchedSubject.code})</td>
            <td class="text-capitalize text-nowrap">${matchedTeacher.firstname} ${matchedTeacher.lastname}</td>
            <td class="text-nowrap">${data[2].timeStart} - ${data[2].timeEnd} | ${data[2].day}</td>
            <td class="text-nowrap">${data[2].room}</td>
            <td>0</td>
            <td>
                <div class="d-flex align-items-end">
                    <button type="button" class="badge rounded-pill bg-primary border-0 editStudentBtn" data-url="/api/classes/${data[2]._id}">Edit</button>
                    <button type="button" class="badge rounded-pill bg-danger border-0 deleteStudentBtn" data-url="/api/classes/${data[2]._id}">Delete</button>
                    <button type="button" class="badge rounded-pill bg-success border-0 addStudentBtn" data-classesfetchurl="" data-studentsfetchurl="">Add Student</button>
                </div>
            </td>
        `;
        classTableBody.appendChild(tr);

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
        // console.log(data)

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
            await fetch(url, { method: "DELETE" });
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