import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.3/firebase-app.js";
  
const firebaseConfig = {
    apiKey: "AIzaSyAuIQlwOlXD1-fLeXSFrnopctzo4rhjL1I",
    authDomain: "arc1-ba128.firebaseapp.com",
    databaseURL: "https://arc1-ba128-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "arc1-ba128",
    storageBucket: "arc1-ba128.appspot.com",
    messagingSenderId: "662160588737",
    appId: "1:662160588737:web:4b7aa168d3852d30727940"
  };

  
  const app = initializeApp(firebaseConfig);

  import {getStorage,ref as sRef,uploadBytesResumable,getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.3/firebase-storage.js"
 

  var files = [];
  var reader = new FileReader();

  var uploadTxtToAppButton = document.getElementById("uploadTxtToAppButton"); // input
  var uploadTxtToStorageButton = document.getElementById("uploadTxtToStorageButton"); // button
  var getTxtFromStorageButton = document.getElementById("getTxtfromStorageButton");
  var myTextField = document.getElementById("myTextField");

  uploadTxtToAppButton.onchange = e =>{
      files = e.target.files;

      var extention = getFileExt(files[0]);
      var name = getFileName(files[0]);

      reader.readAsDataURL(files[0]);
  }

  reader.onload = function(){
      myTextField.src = reader.result;
  }

function getFileExt(file){
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length-1),(temp.length));
    return '.' + ext[0];
}

function getFileName(file){
    var temp = file.name.split('.');
    var fname = temp.slice(0,-1).join('.');
    return fname;
}

async function UploadProcess(){
    var txtFileToUpload = files[0];
    var txtFileName = uploadTxtToAppButton.value;

    // const metaData = {
    //     contentType: txtFileToUpload.type
    // }

    const storage = getStorage();

    const storageRef = sRef(storage, "txtFiles/"+txtFileName);

    const uploadTask = uploadBytesResumable(storageRef,txtFileToUpload);

    uploadTask.on("state-changed",(snapshot)=>{
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    ()=>{
        getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
            SaveURLtoRealtimeDB(downloadURL);
        });
    }
    );
}


//-----------------FUNKCJE BAZY-------------------//

function SaveURLtoRealtimeDB(URL){
    var txtFileName = uploadTxtToAppButton.value;

    set(ref(realdb, "TxtLinks/"+txtFileName),{
        TxtName: (txtFileName),
        TxtURL: URL
    })
}

// function GetURLFromRealtimeDB(){
//     var txtFilename = uploadTxtToAppButton.value;
//     var dbRef = ref(realdb);

//     get(child(dbRef, "TxtLinks/"+txtFilename)).then((snapshot)=>{
//         if(snapshot.exists()){
//             myTextField.src = snapshot.val().TxtURL;
//         }
//     })
// }

uploadTxtToStorageButton.onclick = UploadProcess;
// getTxtFromStorageButton.onclick = GetURLFromRealtimeDB;