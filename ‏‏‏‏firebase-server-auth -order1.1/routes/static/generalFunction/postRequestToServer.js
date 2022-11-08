function postRequestToServer(path, body = "") {

  return new Promise((resolve, reject) => {
    fetch(path, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": Cookies.get("XSRF-TOKEN"),
      },
      body: body,
    }).then(response => response.json())

      .then(json => {
        console.log("in postRequestToServer");
        resolve(json);
      })
      .catch(err => {
        console.log(err.message)
        reject(err)
      });
  })
}



async function downloadPostRequest(path, body, fileName) {

  // var body = JSON.stringify({ cameraId: camera, travelId: travelId })
  return fetch(path, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "CSRF-Token": Cookies.get("XSRF-TOKEN"),
    },
    body: body,
  })
    .then((res) => {
      console.log(res)
      return res.blob();
    })
    .then((data) => {
      var a = document.createElement("a");
      a.href = window.URL.createObjectURL(data);
      console.log(data)
      a.download = fileName;
      a.click();
    });
}
