function createCard(name, description, pictureUrl, start, end, location) {
  return `
  <div class="col-md-4">
    <div class="card shadow mb-5">
      <img src="${pictureUrl}" class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${name}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${location}</h6>
        <p class="card-text">${description}</p>
      </div>
      <div class="card-footer text-muted">
        ${start} - ${end}
      </div>
    </div>
  </div>
  `;
}

function errorAlert() {
    return `
    <div class="alert alert-warning alert-dismissible fade show" role="alert">
        <strong>Error!</strong> Something wrong happened.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
    `;
}


window.addEventListener('DOMContentLoaded', async () => {
  
    const url = 'http://localhost:8000/api/conferences/';

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const alert = errorAlert();
            const err = document.querySelector(".container");
            err.innerHTML = alert;
        } else {
            const data = await response.json();
            
            for (let conference of data.conferences) {
                const detailUrl = `http://localhost:8000${conference.href}`;
                const detailResponse = await fetch(detailUrl);
                if (detailResponse.ok) {
                  const details = await detailResponse.json();
                  const name = details.conference.name;
                  const description = details.conference.description;
                  const pictureUrl = details.conference.location.picture_url;
                  const start = new Date(details.conference.starts);
                  const end = new Date(details.conference.ends);
                  const location = details.conference.location.name;

                  const html = createCard(name, description, pictureUrl, start.toLocaleDateString('en-US'), end.toLocaleDateString('en-US'), location);
                  const column = document.querySelector('.row-cols-3');
                  column.innerHTML += html;
                }
              }
        }
    } catch (e) {
        const alert = errorAlert();
        const err = document.querySelector(".container");
        err.innerHTML = alert;
        console.error("error", e);
    }

});
