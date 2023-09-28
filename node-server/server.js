const express = require("express");
const app = express();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');


app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET, PUT, PATCH, DELETE, POST',
    credentials: true
}));

// app.use((req, res, next) => {
//     // Replace '*' with the actual origin you want to allow.
//     res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


const studentDataCollection = [];

const PORT = 2000;

app.get("/students", (req, res) => {
    res.send(studentDataCollection);
});

app.get('/students/:id', (req, res) => {

    const userId = req.params.id;

    for(let index=0; index < studentDataCollection.length; index++){
        if(studentDataCollection[index]['studentId'] === userId){
            res.json({
                message: "Single student data",
                StudentIdData: studentDataCollection[index],
                indexValue: index
            });
            break;
        }
    }
});

let ID;

const storage = multer.diskStorage({
    destination:(req , file , cb) => {
        cb(null, __dirname+'/uploads');
    },
    filename:(req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        const studentid = generateId();
        // req.studentid = studentid;
        ID = studentid;
        cb(null, ID+fileExtension);
    }
});

const upload = multer({storage: storage});


app.post("/students", upload.single('file'), (req, res) => {
    try{
        let recievingStudentData = req.body;
        // console.log(req.body);

        recievingStudentData['studentFname'] = capitalizeFirstLetter(recievingStudentData["studentFname"]);
        recievingStudentData['studentLname'] = capitalizeFirstLetter(recievingStudentData["studentLname"]);
        recievingStudentData['studentId'] = ID;
        recievingStudentData['studentImage'] = recievingStudentData['studentId'] + path.extname(recievingStudentData['studentImage']);

        studentDataCollection.push(recievingStudentData);
        // console.log(req.studentid);
        console.table(studentDataCollection);

        res.json({
            message: 'ok',
            data: req.body
        });
    }
    catch(err){
        console.error(`Error occured while adding new Student`);
    }
});


app.delete("/students/:Id", (req, res) => {
    let nameOfThePersonToDelete = req.params.Id;
    studentDataCollection.forEach((element, index) => {
        if(element["studentId"] === nameOfThePersonToDelete){
            studentDataCollection.splice(index, 1);
            // let filePath = __dirname+'/uploads/'+element['studentImage'];
            let filePath = path.join(__dirname,'uploads',element['studentImage']);
            deteteFile(filePath);
        }
    });
    console.table(studentDataCollection);
    res.json({
        message: 'Data has deleted',
        StudentId: nameOfThePersonToDelete
    });
});

function deteteFile(filePath){
    fs.rm(filePath, (err) => {
        if(err){
            console.error(err.message);
            return;
        }
        console.log("File deleted successfully");
    });
}


app.put('/students', (req, res) => {
    let updateDate = req.body;
    // console.log(updateDate);
    studentDataCollection.forEach((element, index) => {
        if(element['studentId'] === updateDate['studentId']){
            element['studentFname'] = capitalizeFirstLetter(updateDate['studentFname']);
            element['studentLname'] = capitalizeFirstLetter(updateDate['studentLname']);
            element['studentDateOfBirth'] = updateDate['studentDateOfBirth'];
            element['studentId'] = generateId();
        }
    });
    
    console.table(studentDataCollection);
    res.json({
        message: "data has been updated"
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

/*-------------------------------------------------------------------------------------------------------------------------------*/
function generateId(){
    const character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for(let i=0; i <= 12; i++){
        result += character[Math.floor(Math.random()*character.length)];
    }
    return result;
}

/*--------------------------------------------------------------------------------------------------------------------------------*/
function readJsonFile(){
    try{
        const readFile = fs.readFileSync('node-server/student.json', 'utf-8');
        const fileData = JSON.parse(readFile);
        console.log(fileData);
        return fileData;
    }
    catch{
        console.log('file is empty');
    }
}

function writeJsonFile(){
    try{
        const writeFile = fs.writeFileSync('node-server/student.json', JSON.stringify([element]), 'utf-8');
        console.log(writeFile);
    }
    catch{
        console.log('can not find file');
    }
}