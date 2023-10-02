const confirmRequest = [];
const error = document.querySelectorAll(".error");

function studentData(){
    const studentFname = document.getElementById("fname");
    const studentLname = document.getElementById("lname");
    const studentDate = document.getElementById("date");
    const studentGender = document.getElementById("gender");
    const studentImage = document.getElementById('studentimage');

    const yearCheck = studentDate.value.split('-');

    const imageExtension = studentImage.value.split('.').pop();

    const currentDateAndTime = new Date();
    const currentDate = currentDateAndTime.toISOString().slice(0, 10);

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
    else if(parseInt(yearCheck[0]) < 1980 || studentDate.value > currentDate || studentDate.value === ""){
        studentLname.style.borderColor = "gray"; // last name input box become gray when input will be right
        error[1].style.display = "none"; //error message will remove

        studentDate.style.borderColor = "red";
        error[2].style.display = "block";
        error[2].style.fontWeight = "bold";
        error[2].innerHTML = "Invalid Date";
        return;
    }
    else if(imageExtension !== 'png' && imageExtension !== 'jpg'){
        studentDate.style.borderColor = "gray";

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
            "studentDateOfBirth": studentDate.value,
            "studentGender": studentGender.value,
            "studentImage": studentImage.value.split('\\').pop()
        }

        return studentDetail;
    }
}


const submitData = document.getElementById("submitdata");

submitData.addEventListener('click', () => {
    postRequest();
});


//post request function
async function postRequest() {
    try{
        // confirmRequest.push(studentData());

        const studentImage = document.getElementById('studentimage');

        const formData = new FormData();
        formData.append('studentFname', studentData().studentFname);
        formData.append('studentLname', studentData().studentLname);
        formData.append('studentDateOfBirth', studentData().studentDateOfBirth);
        formData.append('studentGender', studentData().studentGender);
        formData.append('studentImage', studentData().studentImage);
        formData.append('file', studentImage.files[0]);

        
        const apiUrl = "http://localhost:2000/students";
        const apiOption = {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            //     // 'Content-Type': 'multipart/form-data'
            // },
            body: formData
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
    catch(err){
        console.error(`Error ${err}`);
    }
}


function dataRecievetoServer(){
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