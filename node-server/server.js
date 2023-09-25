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
    res.json(studentDataCollection);
});

app.get('/students/:id', (req, res) => {

    const userId = req.params.id;

    // studentDataCollection.forEach((element, index) => {
    //     if(studentDataCollection[index]['studentId'] === userId){
    //         // res.send(studentDataCollection[index]);
    //         res.json({
    //             message: "Single student data",
    //             StudentIdData: studentDataCollection[index],
    //             indexValue: index
    //         });
    //     }
    // });

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


const storage = multer.diskStorage({
    destination:(req , file , cb) => {
        cb(null, __dirname+'/uploads')
    },
    filename:(req, file, cb) => {
        const fileExtension = path.extname(file.originalname);
        let arrayLastElement = studentDataCollection.length - 1;
        cb(null, studentDataCollection[arrayLastElement]['studentId']+fileExtension);
    }
});

const upload = multer({storage: storage});


app.post('/students/image', upload.single('file'), (req, res) => {
    console.log('image is upload');

    let recievingStudentImage = req.file.path;
    let arrayLastElement = studentDataCollection.length - 1;
    let imageExtension = path.extname(recievingStudentImage);
    studentDataCollection[arrayLastElement]['studentImage'] = studentDataCollection[arrayLastElement]['studentId']+imageExtension;
    // studentDataCollection[arrayLastElement]['imagePath'] = recievingStudentImage;

    console.table(studentDataCollection);
    
    // writeJsonFile();
    // readJsonFile();

    res.json({
        message: 'file is upload',
    });
});


app.post("/students", (req, res) => {
    let recievingStudentData = req.body;
    // console.log(recievingStudentData);
    let studentFname = capitalizeFirstLetter(recievingStudentData["studentFname"]);
    let studentLname = capitalizeFirstLetter(recievingStudentData["studentLname"]);

    recievingStudentData["studentFname"] = studentFname;
    recievingStudentData["studentLname"] = studentLname;
    recievingStudentData['studentId'] = generateId();

    studentDataCollection.push(recievingStudentData);

    console.table(studentDataCollection);

    res.json({
        message: 'ok',
        data: req.body
    });
});


app.delete("/students/:Id", (req, res) => {
    let nameOfThePersonToDelete = req.params.Id;
    studentDataCollection.forEach((element, index) => {
        if(studentDataCollection[index]["studentId"] === nameOfThePersonToDelete){
            studentDataCollection.splice(index, 1);
        }
    });
    console.table(studentDataCollection);
    res.send(studentDataCollection);
});


app.put('/students', (req, res) => {
    let updateDate = req.body;
    // console.log(updateDate);
    studentDataCollection.forEach((element, index) => {
        if(studentDataCollection[index]['studentId'] === updateDate['studentId']){
            studentDataCollection[index]['studentFname'] = updateDate['studentFname'];
            studentDataCollection[index]['studentLname'] = updateDate['studentLname'];
            studentDataCollection[index]['studentDateOfBirth'] = updateDate['studentDateOfBirth'];
            studentDataCollection[index]['studentId'] = generateId();
        }
    });
    
    console.table(studentDataCollection);
    res.json({
        message: "data has been update"
    });
});


app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function generateId(){
    const character = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var result = "";
    for(let i=0; i <= 12; i++){
        result += character[Math.floor(Math.random()*character.length)];
    }
    return result;
}


function readJsonFile(){
    try{
        console.log('this data from json file');
        const readFile = fs.readFileSync('node-server/student.json', 'utf-8');
        const fileData = JSON.parse(readFile);
        console.log(fileData)
        return fileData;
    }
    catch{
        console.log('file is empty');
    }
}

function writeJsonFile(){
    try{
        const jsonFileData = readJsonFile();
        studentDataCollection.push(jsonFileData);
        const writeFile = fs.writeFileSync('node-server/student.json', JSON.stringify(studentDataCollection), 'utf-8');
        console.log(writeFile);
    }
    catch{
        console.log('can not find file');
    }
}