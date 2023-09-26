const confirmRequest = [];
const error = document.querySelectorAll(".error");

function studentData(){
    const studentFname = document.getElementById("fname");
    const studentLname = document.getElementById("lname");
    const studentDate = document.getElementById("date");
    const studentMonth = document.getElementById("month");
    const studentYear = document.getElementById("year");
    const studentGender = document.getElementById("gender");
    const studentImage = document.getElementById('studentimage');

    const imageExtension = studentImage.value.split('.').pop();

    if(studentFname.value.trim() === ""){
        studentFname.style.borderColor = "red";
        error[0].style.display = "block";
        error[0].style.fontWeight = "bold";
        error[0].innerHTML = "Please enter your name";
        return;
    }
    else if(studentLname.value.trim() === ""){
        studentFname.style.borderColor = "gray"; //first name input box become gray when input will be right
        error[0].style.display = "none"; //first name error message will remove

        studentLname.style.borderColor = "red";
        error[1].style.display = "block";
        error[1].style.fontWeight = "bold";
        error[1].innerHTML = "Please enter your last name";
        return;
    }
    else if(parseInt(studentDate.value) <= 0 || parseInt(studentDate.value) > 31 || studentDate.value === ""){
        studentLname.style.borderColor = "gray"; // last name input box become gray when input will be right
        error[1].style.display = "none"; //error message will remove

        studentDate.style.borderColor = "red";
        error[2].style.display = "block";
        error[2].style.fontWeight = "bold";
        error[2].innerHTML = "Invalid Date";
        return;
    }
    else if(parseInt(studentMonth.value) <= 0 || parseInt(studentMonth.value) > 12 || studentMonth.value === ""){
        studentDate.style.borderColor = "gray"; //student date input box become gray when input date is valid

        studentMonth.style.borderColor = "red";
        error[2].style.display = "block";
        error[2].style.fontWeight = "bold";
        error[2].innerHTML = "Invalid Month";
        return;
    }
    else if(parseInt(studentYear.value) < 1900 || parseInt(studentYear.value) > 9999 || studentYear.value === ""){
        studentMonth.style.borderColor = "gray"; //student month input box beacome gray when input month is valid

        studentYear.style.borderColor = "red";
        error[2].style.display = "block";
        error[2].style.fontWeight = "bold";
        error[2].innerHTML = "Invalid Year";
        return;
    }
    else if(imageExtension !== 'png' && imageExtension !== 'jpg'){
        studentYear.style.borderColor = "gray";

        error[3].style.display = 'block';
        error[3].style.fontWeight = 'bold';
        error[3].innerHTML = "Image should png or jpg"
        return;
    }
    else{        

        error[3].style.display = 'none';

        const studentDetail = {
            "studentFname": studentFname.value.toLowerCase(),
            "studentLname": studentLname.value.toLowerCase(),
            "studentDateOfBirth": studentYear.value+"-"+dateCorrection(studentMonth.value)+"-"+dateCorrection(studentDate.value),
            "studentGender": studentGender.value,
            "studentImage": studentImage.value.split('\\').pop()
        }

        return studentDetail;
    }
}

function dateCorrection(date){
    if(date < 10){
        return ("0"+date);
    }
    else{
        return date;
    }
}

//get request function
function studentPhoto(){
    const file = document.getElementById("imageFile");
    const fileName = file.value.split('\\').pop();
    const fileExtension = file.value.split('.').pop();
    console.log(file.value);
    console.log(fileName);
    console.log(fileExtension);
}



const submitData = document.getElementById("submitdata");

submitData.addEventListener('click', () => {
    console.log('post');
    postRequest();
    console.log('image');
    imagePost();
});

async function imagePost(){
    const studentImage = document.getElementById("studentimage");

    const formData = new FormData();
    formData.append('file', studentImage.files[0]);

    const apiUrl = 'http://localhost:2000/students/image';
    const apiOption = {
        method: 'POST',
        body: formData
    }

    await fetch(apiUrl, apiOption).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.log(err);
    });
}


//post request function
async function postRequest() {
    
    confirmRequest.push(studentData());
    
    const apiUrl = "http://localhost:2000/students";
    const apiOption = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(studentData())
    }

    // localStorage.setItem("item", JSON.stringify(confirmRequest));

    await fetch(apiUrl, apiOption).then(res => {
        return res.json();
    }).then(data => {
        if(data['message'] === 'ok'){
            confirmRequest.splice(0, confirmRequest.length);
            // localStorage.clear("item");
            console.log(data);
        }
    }).catch(err => {
        console.log("disconnected with server");
    });
}


//when user submit the data
// function dataSendToServer(){
//     postRequest();
// }

function dataRecievetoServer(){
    // getRequest();
    window.location.href = '/student-entry/studentDetail.html';
}


// document.addEventListener("DOMContentLoaded", rePostRequest);

// function rePostRequest(){
//     try{
//         let localData = JSON.parse(localStorage.getItem("item"));

//         if(localData.length !== 0 && localData.length === 1){
//             const apiUrl = "http://localhost:2000/students";
//             const apiOption = {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(localData[0])
//             }

//             fetch(apiUrl, apiOption).then((res) => {
//                 return res.text();
//             }).then((data) => {
//                 if(data === "ok"){
//                     localStorage.clear();
//                     console.log(data);
//                 }
//             }).catch(err => {
//                 console.log("disconnected with server");
//             });
//         }
//         else if(localData.length > 1){
//             localStorage.clear();
//         }
//     }
//     catch(err){
//         console.log("local storage is empty");
//     }
// }