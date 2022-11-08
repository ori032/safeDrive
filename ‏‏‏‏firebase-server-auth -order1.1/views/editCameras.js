// document.addEventListener("DOMContentLoaded", function () {
//     async function drawAllCamerasEditButton() {
//         clearcCntainer("mainContainer");
//         clearcCntainer("chartContainer");
//         drawSpiner();

//         var container = document.getElementById('mainContainer');

//         var loadingP = document.createElement('p');
//         loadingP.className = "btn btn-primary";
//         var loadingSpan = document.createElement('span');
//         loadingSpan.className = "spinner-border spinner-border-sm";
//         loadingP.innerHTML = "Loading...";

//         loadingP.appendChild(loadingSpan);
//         container.appendChild(loadingP)

//         // var buttonsArr = ['camera_5', 'camera_6', 'camera_7', 'camera_8', 'camera_23', 'camera_24'];

//         try {
//             var camerasArr = await postRequestToServer("/dbServer/getCamerasOfUser");
//             console.log(camerasArr);
//         } catch (err) {
//             console.log(err.message);
//             return;

//         }


//         camerasArr.forEach((camera) => {
//             var onclickFunck = (function () { return drawAllTittleTravelsButton(camera) });
//             var button = createCameraCard(camera, onclickFunck);


//             container.appendChild(button);
//         });
//         console.log("aaaa");
//         deletSpiner();
//     }

// })