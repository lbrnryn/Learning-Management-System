const addSubjectModal = document.querySelector("#addSubjectModal");
const addSubjectForm = document.querySelector("#addSubjectForm");
const tables = document.querySelectorAll("table");

addSubjectForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const { year, trimester, code, title, units, prerequisite } = addSubjectForm.elements;
  const res= await fetch("/api/subjects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      year: year.value,
      trimester: trimester.value,
      code: code.value,
      title: title.value,
      units: units.value,
      prerequisite: prerequisite.value
    })
  });

  const data = await res.json();

  const foundTable = Array.from(tables).find(table => table.dataset.id === `${data.year}Year${data.trimester}Trimester`);
  const tbody = foundTable.children[2];

  const tr = document.createElement("tr");
  tr.dataset.id = data._id;
  tr.innerHTML = `
    <td class="col-2 text-nowrap text-uppercase">${data.code}</td>
    <td class="col-5 text-nowrap text-capitalize">${data.title}</td>
    <td>${data.units}</td>
    <td class="text-uppercase">${data.prerequisite}</td>
    <td>
      <div class="d-flex justify-content-center align-items-center gap-1">
        <button type="button" class="badge btn-success border-0" data-bs-toggle="modal" data-bs-target="#edit${data._id}"><i class="bi bi-pencil-fill"></i></button>
        <div id="edit${data._id}" class="modal fade" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <form action="/api/subjects/${data._id}" class="editSubjectForm">
                <div class="modal-body">
                  <div class="row">
                    <div class="col input-group mb-3">
                      <label class="input-group-text" for="year">Year</label>
                      <select class="form-select" name="year" required>
                          <option value="${data.year}">${data.year} Year</option>
                          <option value="1st">1st Year</option>
                          <option value="2nd">2nd Year</option>
                          <option value="3rd">3rd Year</option>
                          <option value="4th">4th Year</option>
                      </select>
                    </div>
                    <div class="col input-group mb-3">
                      <label class="input-group-text" for="trimester">Trimester</label>
                      <select class="form-select" name="trimester" required>
                          <option value="${data.trimester}">${data.trimester} Trimester</option>
                          <option value="1st">1st Trimester</option>
                          <option value="2nd">2nd Trimester</option>
                          <option value="3rd">3rd Trimester</option>
                      </select>
                    </div>
                  </div>
                  <div class="row">
                      <div class="col input-group mb-3">
                      <span class="input-group-text">Code</span>
                      <input type="text" class="form-control" name="code" placeholder="Code" value="${data.code}" required>
                      </div>
                  </div>
                  <div class="input-group mb-3">
                      <span class="input-group-text">Title</span>
                      <input type="text" class="form-control" name="title" placeholder="Title" value="${data.title}" required>
                  </div>
                  <div class="row">
                      <div class="col input-group mb-3">
                      <span class="input-group-text">Pre-requisite</span>
                      <input type="text" class="form-control" name="prerequisite" placeholder="Pre-requisite" value="${data.prerequisite}" required>
                      </div>
                      <div class="col input-group mb-3">
                      <span class="input-group-text">Units</span>
                      <input type="text" class="form-control" name="units" placeholder="Units" value="${data.units}" required>
                      </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
            </div>
          </div>
        </div>
        <a class="badge btn-primary text-decoration-none" href="/subjects/${data._id}/chapters"><i class="bi bi-plus-lg"></i> Chapter</a>
        <form class="delSubjectForm" action="/subjects/${data._id}?_method=DELETE" method="post">
          <button type="submit" class="badge bg-danger border-0"><i class="bi bi-trash3-fill"></i></button>
        </form>
      </div>
    </td>
  `;
  tbody.appendChild(tr);

  bootstrap.Modal.getInstance(addSubjectModal).hide();
});

addSubjectModal.addEventListener("hidden.bs.modal", (e) => {
    const { year, trimester, code, title, units, prerequisite } = addSubjectForm.elements;
    year.children[0].selected = true;
    trimester.children[0].selected = true;
    code.value = "";
    title.value = "";
    units.value = "";
    prerequisite.value = "";
});

const editSubjectForms = document.querySelectorAll(".editSubjectForm");
editSubjectForms.forEach(editSubjectForm => {
  editSubjectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const { year, trimester, code, title, units, prerequisite } = e.target.elements;
    // console.log(e.target.action)
    const res = await fetch(e.target.action, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        year: year.value,
        trimester: trimester.value,
        code: code.value,
        title: title.value,
        units: units.value,
        prerequisite: prerequisite.value
      })
    });

    const data = await res.json();
    // console.log(data);
    const modalID = e.target.parentElement.parentElement.parentElement.id;
    bootstrap.Modal.getInstance(`#${modalID}`).hide();
    
    const trows = document.querySelectorAll("tbody tr");
    const foundTrow = Array.from(trows).find(tr => tr.dataset.id === data._id);
    foundTrow.innerHTML = `
      <td class="col-2 text-nowrap text-uppercase">${data.code}</td>
      <td class="col-5 text-nowrap text-capitalize">${data.title}</td>
      <td>${data.units}</td>
      <td class="text-uppercase">${data.prerequisite}</td>
      <td>
        <div class="d-flex justify-content-center align-items-center gap-1">
          <button type="button" class="badge btn-success border-0" data-bs-toggle="modal" data-bs-target="#edit${data._id}"><i class="bi bi-pencil-fill"></i></button>
          <div id="edit${data._id}" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
              <div class="modal-content">
                <form action="/api/subjects/${data._id}" class="editSubjectForm">
                  <div class="modal-body">
                    <div class="row">
                      <div class="col input-group mb-3">
                        <label class="input-group-text" for="year">Year</label>
                        <select class="form-select" name="year" required>
                            <option value="${data.year}">${data.year} Year</option>
                            <option value="1st">1st Year</option>
                            <option value="2nd">2nd Year</option>
                            <option value="3rd">3rd Year</option>
                            <option value="4th">4th Year</option>
                        </select>
                      </div>
                      <div class="col input-group mb-3">
                        <label class="input-group-text" for="trimester">Trimester</label>
                        <select class="form-select" name="trimester" required>
                            <option value="${data.trimester}">${data.trimester} Trimester</option>
                            <option value="1st">1st Trimester</option>
                            <option value="2nd">2nd Trimester</option>
                            <option value="3rd">3rd Trimester</option>
                        </select>
                      </div>
                    </div>
                    <div class="row">
                        <div class="col input-group mb-3">
                        <span class="input-group-text">Code</span>
                        <input type="text" class="form-control" name="code" placeholder="Code" value="${data.code}" required>
                        </div>
                    </div>
                    <div class="input-group mb-3">
                        <span class="input-group-text">Title</span>
                        <input type="text" class="form-control" name="title" placeholder="Title" value="${data.title}" required>
                    </div>
                    <div class="row">
                        <div class="col input-group mb-3">
                        <span class="input-group-text">Pre-requisite</span>
                        <input type="text" class="form-control" name="prerequisite" placeholder="Pre-requisite" value="${data.prerequisite}" required>
                        </div>
                        <div class="col input-group mb-3">
                        <span class="input-group-text">Units</span>
                        <input type="text" class="form-control" name="units" placeholder="Units" value="${data.units}" required>
                        </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </div>
              </form>
              </div>
            </div>
          </div>
          <a class="badge btn-primary text-decoration-none" href="/subjects/${data._id}/chapters"><i class="bi bi-plus-lg"></i> Chapter</a>
          <form class="delSubjectForm" action="/subjects/${data._id}?_method=DELETE" method="post">
            <button type="submit" class="badge bg-danger border-0"><i class="bi bi-trash3-fill"></i></button>
          </form>
        </div>
      </td>
    `;
  });
});