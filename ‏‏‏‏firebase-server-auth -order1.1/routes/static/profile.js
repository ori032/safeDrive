document.addEventListener("DOMContentLoaded",
    function () {

        async function myFunction() {
            // document.getElementById("demo").style.color = "red";
            // document.getElementById("name").innerHTML = Cookies.get('id')
            // Cookies.set('id',"login");
            console.log(Cookies.get('id'))

            // res = await postRequestToServer("/getCamerasOfUser", JSON.stringify({ id: Cookies.get('id') }))
            // console.log(res)
            // console.log(Cookies.get('id'))

            postRequestToServer("/dbServer/getCamerasOfUser", JSON.stringify({ id: Cookies.get('id') }))
                .then(response => {
                    console.log(response)
                })
                .catch(err => {
                    console.log(err.message)

                });
            console.log(Cookies.get('id'))


            // fetch("/getCamerasOfUser", {
            //   method: "POST",
            //   headers: {
            //     Accept: "application/json",
            //     "Content-Type": "application/json",
            //     "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            //   },
            //   body: JSON.stringify({ id: Cookies.get('id')}),
            // }).then(response => response.json())

            //   // Displaying results to console
            //   .then(json => console.log(json));

        }


        function postRequestToServer(path, body) {
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
                        resolve(json);
                    })
                    .catch(err => {
                        console.log(err.message)
                        reject(err)
                    });
            })
        }
        document.getElementById("clickMe").addEventListener("click", myFunction);

    });