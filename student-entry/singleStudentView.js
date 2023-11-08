document.addEventListener('DOMContentLoaded', gettingData);

function gettingData(){

    const studentId = localStorage.getItem("studentId");

    const apiUrl = `http://localhost:2000/students/${studentId}`;
    const apiOption = {
        method: "GET"
    }

    fetch(apiUrl, apiOption).then((res) => {
        return res.json();
    }).then((data) => {
        // console.log(studentId);
        console.log(data);
        renderElement(data['StudentIdData']);
        // localStorage.clear();
    }).catch((err) => {
        console.log("server is not working", err);
    });
}

function renderElement(data){
    // console.log(data);
    createElement(data["studentFname"], data["studentLname"], data["studentDateOfBirth"], data["studentGender"], data["studentImage"]['data'], data["_id"]);
}


function createElement(fname, lname, dob, gender, image, id){
    const mainClass = document.getElementById("mainClass");

    mainClass.innerHTML += `
        <div class="studentClass">
            <div class="studentImage">
                <img src="data:image/png image/jpg;base64,${image}" alt="student-image" class="image">
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
        </div>
        <br>
    `;
}