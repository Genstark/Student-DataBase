document.addEventListener("DOMContentLoaded", gettingData);


function gettingData(){
    const apiUrl = "http://localhost:2000/students";
    const apiOption = {
        method: "GET"
    }

    fetch(apiUrl, apiOption).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data);
        renderElement(data);
    }).catch((err) => {
        console.log("server is not working", err);
    });
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function renderElement(data){
    for(let i=0; i < data.length; i++){
        createElement(capitalizeFirstLetter(data[i]["studentFname"]), capitalizeFirstLetter(data[i]["studentLname"]), 
            capitalizeFirstLetter(data[i]["studentDateOfBirth"]), capitalizeFirstLetter(data[i]["studentGender"]), data[i]['studentImage'], data[i]["studentId"]);
    }
}

function createElement(fname, lname, dob, gender, image, id){
    const mainClass = document.getElementById("mainClass");

    mainClass.innerHTML += `
        <div class="studentClass" target="_blank">
            <div class="studentImage" id="studentImage">
                <img src="../node-server/uploads/${image}" class="image">
            </div>

            <div class="outputClass">
                <label class="labelFname">First Name: </label>
                <input type="text" value="${fname}" class="inputFname" readonly>
            </div>
            
            <div class="outputClass">
                <label class="labelLname">Last Name: </label>
                <input type="text" value="${lname}" class="inputLname" readonly>
            </div>
            
            <div class="outputClass">
                <label class="labelDob">Date of Birth: </label>
                <input type="date" value="${dob}" class="inputDob" readonly>
            </div>

            <div class="outputClass">
                <label class="labelGender">Gender: </label>
                <input type="text" value="${gender}" class="inputGender" readonly>
            </div>

            <div class="outputClass">
                <label class="labelId">Student ID: </label>
                <input type="text" class="inputId" value="${id}" readonly>
            </div>
            
            <div class="buttonClass">
                <hr>
                <button class="edit" onclick="editStudent('${id}', this)">Edit</button>
                <button class="update" onclick="updateStudent('${id}', this)" disabled>Update</button>
                <button class="delete" onclick="deleteStudent('${id}', this)">Delete</button>
                <button class="view" onclick="findStudentCard(this, '${id}')">View</button>
            </div> 
        </div>
        <br>
    `;
}


function findStudentCard(e, userId){
    window.location.href = '/student-entry/singleStudentView.html';
    localStorage.setItem("studentId", userId);
    console.log(userId);
}

let indexValue = 0;

function editStudent(userId, element){
    // console.log('call from edit student',userId, element);
    let inputFname = document.querySelectorAll(".inputFname");
    let inputLname = document.querySelectorAll(".inputLname");
    let inputDob = document.querySelectorAll(".inputDob");
    let updateButton = document.querySelectorAll('.update');
    
    const apiUrl = "http://localhost:2000/students";
    const apiOption = {
        method: "GET"
    }

    fetch(apiUrl, apiOption).then(res => {
        return res.json();
    }).then(data => {
        
        data.forEach((element, index) => {
            if(data[index]["studentId"] === userId){
                indexValue = index;
                inputFname[index].readOnly = false;
                inputFname[index].focus();
                inputLname[index].readOnly = false;
                inputDob[index].readOnly = false;
                updateButton[index].disabled = false;
            }
        });

    }).catch(err => {
        console.log(err);
    });
}


function updateStudent(userid, element){
    let inputFname = document.querySelectorAll(".inputFname");
    let inputLname = document.querySelectorAll(".inputLname");
    let inputDob = document.querySelectorAll(".inputDob");
    let updateButton = document.querySelectorAll('.update');

    inputFname[indexValue].readOnly = true;
    inputLname[indexValue].readOnly = true;
    inputDob[indexValue].readOnly = true;

    const apiUrl = `http://localhost:2000/students`;
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            "studentFname": inputFname[indexValue].value,
            "studentLname": inputLname[indexValue].value,
            "studentDateOfBirth": inputDob[indexValue].value,
            "studentId": userid
        })
    }

    fetch(apiUrl, requestOptions).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
        updateButton[indexValue].disabled = true;
        inputFname[indexValue].value = inputFname[indexValue].value;
        inputLname[indexValue].value = inputLname[indexValue].value;
        location.href = location.href;
    }).catch(err => {
        console.log(err);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


function deleteStudent(userId, element){
    // console.log(userId);
    const apiUrl = `http://localhost:2000/students/${userId}`;
    const requestOptions = {
        method: 'DELETE'
    }
    fetch(apiUrl, requestOptions).then(res => {
        return res.json();
    }).then(data => {
        console.log(data);
    }).catch(err => {
        console.error("Error:", err);
    });

    element.parentNode.parentNode.remove();
}


// get /students - list all the students
// get /students/7873 - fetch a students with id 7873
// post /students - create student record
// put /students/1546 - update student details for student with id of 1546
// patch /students/1987 - partial update to student with id of 1987 (only fname and lname are updated)
// detete /students/1897 - deletes student with id 1891

// rest api convention/ swager