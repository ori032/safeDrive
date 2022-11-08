document.addEventListener("DOMContentLoaded", () => {
    
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

})