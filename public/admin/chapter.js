const addChapterForm = document.querySelector("#addChapterForm");
const chapterList = document.querySelector("#chapterList");
const { subject, title, lesson, cancelEditChapterBtn } = addChapterForm.elements;
let editChapterUrl;

addChapterForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (editChapterUrl) {
        const res = await fetch(editChapterUrl, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: subject.value,
                title: title.value,
                lesson: lesson.value
            })
        });
        const data = await res.json();

        const matchedLi = Array.from(chapterList.children).find(li => li.dataset.id === data._id);
        matchedLi.innerHTML = `
        ${data.title}
            <div class="d-flex">
                <button type="button" class="border-0 bg-transparent editChapterBtn" data-url="/api/chapters/${data._id}"><i class="bi bi-pencil-fill text-primary"></i></button>
                <button type="submit" class="border-0 bg-transparent deleteChapterBtn" data-url="/api/chapters/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
            </div>
        `;
        
        editChapterUrl = undefined;
        Array.from(e.target.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
        cancelEditChapterBtn.classList.add('d-none');
    } else {
        const res = await fetch("/api/chapters", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: subject.value,
                title: title.value,
                lesson: lesson.value
            })
        });
        const data = await res.json();
    
        const li = document.createElement("li");
        li.dataset.id = data._id;
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
            ${data.title}
            <div class="d-flex">
                <button type="button" class="border-0 bg-transparent editChapterBtn" data-url="/api/chapters/${data._id}"><i class="bi bi-pencil-fill text-primary"></i></button>
                <button type="submit" class="border-0 bg-transparent deleteChapterBtn" data-url="/api/chapters/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
            </div>
        `;
        chapterList.appendChild(li);
        
        Array.from(e.target.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    }
});

chapterList.addEventListener('click', async (e) => {

    if (e.target.parentElement.classList.contains('editChapterBtn')) {
        const editChapterBtn = e.target.parentElement;
        const url = editChapterBtn.dataset.url;

        const res = await fetch(url);
        const data = await res.json();

        subject.value = data.subject;
        title.value = data.title;
        lesson.value = data.lesson;
        cancelEditChapterBtn.classList.remove('d-none');

        editChapterUrl = url;
    }

    if (e.target.parentElement.classList.contains('deleteChapterBtn')) {
        const deleteChapterBtn = e.target.parentElement;
        const url = deleteChapterBtn.dataset.url;

        deleteChapterBtn.parentElement.parentElement.remove();
        editChapterUrl = undefined;
        Array.from(addChapterForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
        await fetch(url, { method: 'DELETE' });
    }
});

cancelEditChapterBtn.addEventListener('click', (e) => {
    editChapterUrl = undefined;
    Array.from(addChapterForm.elements).filter(element => element.tagName !== 'BUTTON').forEach(element => element.value = '');
    e.target.classList.add('d-none');
})