// console.log("chapter.js")
// const addChapterForm = document.querySelector("#addChapterForm");
// const chapterList = document.querySelector("#chapterList");
// console.log(addChapterForm)

// addChapterForm.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const res = await fetch("/api/chapters");
//     const data = await res.json();
//     console.log(data);

//     const li = document.createElement("li");
//     li.dataset.id = data._id;
//     li.className = "list-group-item d-flex justify-content-between align-items-center";
//     li.innerHTML = `
//         ${data.title}
//         <div class="d-flex">
//             <button type="button" class="border-0 bg-transparent editChapterBtn" data-url="/api/chapters/${data._id}"><i class="bi bi-pencil-fill text-primary"></i></button>
//             <button type="submit" class="border-0 bg-transparent deleteChapterBtn" data-url="/api/chapters/${data._id}"><i class="bi bi-trash3-fill text-danger"></i></button>
//         </div>
//     `;
//     chapterList.appendChild(li);
// });