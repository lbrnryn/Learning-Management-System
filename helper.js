function editSubjectModal(subject) {
  // <form action="/subjects/${subject._id}?_method=PUT" method="post">
  return `
  <button type="button" class="badge bg-transparent text-primary border-0" data-bs-toggle="modal" data-bs-target="#edit${subject._id}"><i class="bi bi-pencil-fill"></i></button>
  <div id="edit${subject._id}" class="modal fade" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <form action="/api/subjects/${subject._id}" class="editSubjectForm">
          <div class="modal-body">
            <div class="row">
              <div class="col input-group mb-3">
                <label class="input-group-text" for="year">Year</label>
                <select class="form-select form-select-sm" name="year" required>
                    <option value="${subject.year}">${subject.year} Year</option>
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                </select>
              </div>
              <div class="col input-group mb-3">
                <label class="input-group-text" for="trimester">Trimester</label>
                <select class="form-select form-select-sm" name="trimester" required>
                    <option value="${subject.trimester}">${subject.trimester} Trimester</option>
                    <option value="1st">1st Trimester</option>
                    <option value="2nd">2nd Trimester</option>
                    <option value="3rd">3rd Trimester</option>
                </select>
              </div>
            </div>
            <div class="row">
                <div class="col input-group mb-3">
                  <span class="input-group-text">Code</span>
                  <input type="text" class="form-control form-control-sm" name="code" placeholder="Code" value="${subject.code}" required>
                </div>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text">Title</span>
                <input type="text" class="form-control form-control-sm" name="title" placeholder="Title" value="${subject.title}" required>
            </div>
            <div class="row">
                <div class="col input-group mb-3">
                  <span class="input-group-text">Pre-requisite</span>
                  <input type="text" class="form-control form-control-sm" name="prerequisite" placeholder="Pre-requisite" value="${subject.prerequisite}" required>
                </div>
                <div class="col input-group mb-3">
                  <span class="input-group-text">Units</span>
                  <input type="text" class="form-control form-control-sm" name="units" placeholder="Units" value="${subject.units}" required>
                </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm bg-light-subtle" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" class="btn btn-sm bg-primary-subtle">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  `
}

module.exports = function formatSubjects (subjects, year, trimester) {
  // console.log(subjects.filter(subject => subject.year === year && subject.trimester === trimester));
  
  function tableHTML(rows) {
      return `
        <div class="table-responsive">
          <table class="table table-sm caption-top mb-5 text-white" data-id="${year}Year${trimester}Trimester">
            <caption class="text-white">${year} Year ${trimester} Trimester</caption>
            <thead>
              <tr>
                <th>Code</th>
                <th>Title</th>
                <th>Units</th>
                <th>Prerequisite</th>
                <th class="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>
      `;
  };

  const filteredSubjects = subjects.filter(subject => subject.year === year && subject.trimester === trimester);
  const rowsData = filteredSubjects.length !== 0 ? filteredSubjects.map(subject => {
    return `
      <tr data-id="${subject._id}">
        <td class="col-2 text-nowrap text-uppercase">${subject.code}</td>
        <td class="col-5 text-nowrap text-capitalize">${subject.title}</td>
        <td>${subject.units}</td>
        <td class="text-uppercase">${subject.prerequisite}</td>
        <td>
          <div class="d-flex justify-content-center align-items-center gap-1">
            ${editSubjectModal(subject)}
            <a class="badge bg-primary-subtle text-decoration-none" href="/subjects/${subject._id}/chapters">Chapters</a>
            <!--<a class="badge bg-primary-subtle text-decoration-none" href="/subjects/${subject._id}/chapters"><i class="bi bi-plus-lg"></i> Chapter</a>-->
            <button type="submit" class="badge bg-transparent text-danger border-0 deleteSubjectBtn" data-url="/api/subjects/${subject._id}"><i class="bi bi-trash3-fill"></i></button>
          </div>
        </td>
      </tr>
    `;
  }).join(" ") : "";

  return tableHTML(rowsData);
}

{/* <form class="delSubjectForm" action="/subjects/${subject._id}?_method=DELETE" method="post">
  <button type="submit" class="badge bg-danger border-0"><i class="bi bi-trash3-fill"></i></button>
</form> */}