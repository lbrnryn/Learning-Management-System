
// Remove toast notification after 2 seconds
// const removeToast = document.querySelector('.removeToast');
// if (removeToast) {
//   setTimeout(() => {
//     removeToast.remove()
//   }, 2000)
// }

//--------------------------------------------------

// // const selectSubject = document.getElementById("selectSubject");
// // const selectSubjectUrl = document.getElementById("selectSubjectUrl");
// // const chaptersContainer = document.getElementById("chaptersContainer");
// // if (selectSubject) {
// //   selectSubject.addEventListener('change', () => {
// //     // console.log(selectSubjectUrl.dataset.url)
// //     // console.log(`${selectSubjectUrl}/${selectSubject.value}`)
// //     fetch(`${selectSubjectUrl.value}/${selectSubject.value}`)
// //       .then(res => res.json())
// //       .then(data => {
// //         // console.log(data)
// //         let output = "";
// //         data.forEach((data) => {
// //           output += `
// //           <div class="accordion-item">
// //             <h2 class="accordion-header">
// //             <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#subject${data._id}">
// //               ${data.title}
// //             </button>
// //             </h2>
// //             <div id="subject${data._id}" class="accordion-collapse collapse" data-bs-parent="#chaptersContainer">
// //               <div class="accordion-body">
// //                 ${data.markedHtml}
// //               </div>
// //             </div>
// //           </div>
// //           `
// //         });
// //         chaptersContainer.innerHTML = output;
// //       })
// //   })
// // }

// // Student taking quiz page - Student - /questions/quiz/chapter/:id
// const url1 = document.querySelector("#url1");
// const url2 = document.querySelector("#url2");
// const url3 = document.querySelector("#url3");
// const chapter1quiz = document.querySelector("#chapter1quiz");
// const chapterId = document.querySelector("#chapterId");
// const userId = document.querySelector("#userId");
// const questionsLength = document.querySelector("#questionsLength");
// // const q1s = document.getElementsByName("Q1");
// // const q2s = document.getElementsByName("Q2");
// // const q3s = document.getElementsByName("Q3");
// // const q4s = document.getElementsByName("Q4");
// // const q5s = document.getElementsByName("Q5");

// // Gets all element with "Q" in their attributes
// //https://stackoverflow.com/questions/16791527/can-i-use-a-regular-expression-in-queryselectorall
// function DOMRegex(regex) {
//   let output = [];
//   for (let i of document.querySelectorAll('*')) {
//       for (let j of i.attributes) {
//           if (regex.test(j.value)) {
//               output.push(i)
//           }
//       }
//   }
//   return output;
// }
// // console.log(DOMRegex(/^Q/));
// // console.log(document.querySelectorAll("input[type='radio']"))
// // const inputRadioBtns = document.querySelectorAll("input[type='radio']");
// const inputRadioBtns = DOMRegex(/^Q/);
// // console.log(inputRadioBtns)
// // const answers = ['alpha', 'bravo'];

// if (chapter1quiz) {
//   chapter1quiz.addEventListener("submit", (e) => {
//     e.preventDefault();
//     try {
//       let score = 0;
//       fetch(url1.value)
//         .then(res => res.json())
//         .then(data => {
//           const answers = data.map((data) => data.answer);
//           if (inputRadioBtns) {
//             inputRadioBtns.forEach((inputRadioBtn) => {
//               // if (inputRadioBtn.checked && answers.indexOf(inputRadioBtn.value) !== -1) {
//               if (inputRadioBtn.checked && answers.includes(inputRadioBtn.value)) {
//                 score++;
//               }
//             });
//             // console.log(score)
//           }
//           // console.log(score)
//           // console.log(questionsLength.value);
//           // console.log(chapterId.value);

//           // fetch(`http://localhost:2000/users/quizzes`, {
//           fetch(url2.value, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ questionsLength: Number(questionsLength.value), chapterId: chapterId.value, score: Number(score)})
//           });
//           // location.reload();

//           location.href = url3.value;
//         })
//     } catch (err) { console.log(err.message) }
//   })
// }

// // Delete chapter buttons - Admin - /chapters/subject/:id
// const delChapterForms = document.querySelectorAll(".delChapterForm");
// delChapterForms.forEach((delChapterForm) => {
//   delChapterForm.addEventListener('submit', (e) => {
//     // e.preventDefault();
//     // console.log('submit')
//     if (!confirm("Are you sure you want to delete this chapter?")) {
//       e.preventDefault();
//     }
//   })
// });
