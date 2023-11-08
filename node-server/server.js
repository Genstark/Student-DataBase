const express = require("express");
const app = express();
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');


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



async function gettingAllData(){
    const uri = "mongodb+srv://gy523314:%40genwarrior123%40@cluster0.3e0eraj.mongodb.net/?retryWrites=true&w=majority/Student_Database";
    const client = new MongoClient(uri);

    try{
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate changes in your code here
        const db = client.db('student');
        const collection = db.collection('student_details');

        return await collection.find().toArray();
    }
    finally{
        // Close connection to the MongoDB cluster
        await client.close();
    }
}


app.get("/students", (req, res) => {
    // res.send(studentDataCollection);
    gettingAllData().then(data => {
        res.json({
            message: "All Student Data",
            Data: data
        });
        // res.send(data);
    }).catch(err => {
        console.log(err);
    });
});


async function gettingDataofSingleStudent(userId){
    const uri = "mongodb+srv://gy523314:%40genwarrior123%40@cluster0.3e0eraj.mongodb.net/?retryWrites=true&w=majority/Student_Database";
    const client = new MongoClient(uri);

    try{
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate changes in your code here
        const db = client.db('student');
        const collection = db.collection('student_details');

        return await collection.findOne({ _id : userId });
    }
    finally{
        // Close connection to the MongoDB cluster
        await client.close();
    }
}

app.get('/students/:id', (req, res) => {

    const userId = req.params.id;

    // for(let index=0; index < studentDataCollection.length; index++){
    //     if(studentDataCollection[index]['studentId'] === userId){
    //         res.json({
    //             message: "Single student data",
    //             StudentIdData: studentDataCollection[index],
    //             indexValue: index
    //         });
    //         break;
    //     }
    // }

    gettingDataofSingleStudent(userId);
    // .then(data => {
    //     res.json({
    //         message: "Single student data",
    //         StudentIdData: data
    //     });
    // }).catch(err => {
    //     console.log(err);
    // });
    res.json({
        message: "Single student data",
        StudentIdData: data
    });
});

let ID;

// const storage = multer.diskStorage({
//     destination:(req , file , cb) => {
//         cb(null, __dirname+'/uploads');
//     },
//     filename:(req, file, cb) => {
//         const fileExtension = path.extname(file.originalname);
//         const studentid = generateId();
//         // req.studentid = studentid;
//         ID = studentid;
//         // cb(null, ID+fileExtension);
//         cb(null, file.originalname);
//     }
// });

const storage = multer.memoryStorage();


const upload = multer({storage: storage});

async function addDataMongodb(data, image){
    const uri = "mongodb+srv://gy523314:%40genwarrior123%40@cluster0.3e0eraj.mongodb.net/?retryWrites=true&w=majority/Student_Database";
    const client = new MongoClient(uri, { useUnifiedTopology: true });

    try{
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate changes in your code here
        const db = client.db('student');
        const collection = db.collection('student_details');

        const maindata = {
            _id : data['studentId'],
            studentFname : data['studentFname'],
            studentLname : data['studentLname'],
            studentDateOfBirth : data['studentDateOfBirth'],
            studentGender : data['studentGender'],
            studentImage : image
        }

        await collection.insertOne(maindata, { writeConcern: { w: 'majority' } });
    }
    finally{
        // Close connection to the MongoDB cluster
        await client.close();
    }
}


app.post("/students", upload.single('file'), (req, res) => {
    try{
        let recievingStudentData = req.body;
        console.log(req.body);

        const fileData = req.file.buffer;

        const fileDocument = {
            filename: req.file.originalname,
            data: fileData
        }

        recievingStudentData['studentFname'] = capitalizeFirstLetter(recievingStudentData["studentFname"]);
        recievingStudentData['studentLname'] = capitalizeFirstLetter(recievingStudentData["studentLname"]);
        recievingStudentData['studentId'] = generateId();
        // recievingStudentData['studentImage'] = recievingStudentData['studentId'] + path.extname(recievingStudentData['studentImage']);
        recievingStudentData['studentImage'] = req.file.filename;

        addDataMongodb(recievingStudentData, fileDocument).catch(console.error);

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



async function deleteDataMongodb(userId){
    const uri = "mongodb+srv://gy523314:%40genwarrior123%40@cluster0.3e0eraj.mongodb.net/?retryWrites=true&w=majority/Student_Database";
    const client = new MongoClient(uri);

    try{
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate changes in your code here
        const db = client.db('student');
        const collection = db.collection('student_details');
        await collection.deleteOne({ _id : userId }, { writeConcern: { w: 'majority' } });
    }
    finally{
        // Close connection to the MongoDB cluster
        await client.close();
    }
}

app.delete("/students/:Id", (req, res) => {
    let nameOfThePersonToDelete = req.params.Id;

    // studentDataCollection.forEach((element, index) => {
    //     if(element["studentId"] === nameOfThePersonToDelete){
    //         studentDataCollection.splice(index, 1);
    //         // let filePath = __dirname+'/uploads/'+element['studentImage'];
    //         // let filePath = path.join(__dirname,'uploads',element['studentImage']);
    //         // deteteFile(filePath);
    //     }
    // });

    deleteDataMongodb(nameOfThePersonToDelete);

    console.table(studentDataCollection);
    res.json({
        message: 'Data has deleted',
        StudentId: nameOfThePersonToDelete
    });
});

// function deteteFile(filePath){
//     fs.rm(filePath, (err) => {
//         if(err){
//             console.error(err.message);
//             return;
//         }
//         console.log("File deleted successfully");
//     });
// }


async function updateDataMongodb(studentdata){
    const uri = "mongodb+srv://gy523314:%40genwarrior123%40@cluster0.3e0eraj.mongodb.net/?retryWrites=true&w=majority/Student_Database";
    const client = new MongoClient(uri);

    try{
        // Connect to the MongoDB cluster
        await client.connect();
        // Make the appropriate changes in your code here
        const db = client.db('student');
        const collection = db.collection('student_details');

        const data = {
            $set : {
                studentFname : capitalizeFirstLetter(studentdata['studentFname']),
                studentLname : capitalizeFirstLetter(studentdata['studentLname']),
                studentDateOfBirth : studentdata['studentDateOfBirth']
            }
        }
        await collection.findOneAndUpdate({ _id : studentdata['studentId'] }, data, { returnOriginal : false });
    }
    finally{
        // Close connection to the MongoDB cluster
        await client.close();
    }
}

app.put('/students', (req, res) => {
    let updateDate = req.body;
    console.log(updateDate);
    // studentDataCollection.forEach((element, index) => {
    //     if(element['studentId'] === updateDate['studentId']){
    //         element['studentFname'] = capitalizeFirstLetter(updateDate['studentFname']);
    //         element['studentLname'] = capitalizeFirstLetter(updateDate['studentLname']);
    //         element['studentDateOfBirth'] = updateDate['studentDateOfBirth'];
    //         element['studentId'] = generateId();
    //     }
    // });

    updateDataMongodb(updateDate).then(data => {
        res.json({
            message: "data has been updated"
        });
    }).catch(err => {
        console.log(err);
    });
    
    // console.table(studentDataCollection);
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
    for(let i=0; i < 12; i++){
        result += character[Math.floor(Math.random()*character.length)];
    }
    return result;
}

/*--------------------------------------------------------------------------------------------------------------------------------*/
// function readJsonFile(){
//     try{
//         const readFile = fs.readFileSync('node-server/student.json', 'utf-8');
//         const fileData = JSON.parse(readFile);
//         console.log(fileData);
//         return fileData;
//     }
//     catch{
//         console.log('file is empty');
//     }
// }

// function writeJsonFile(){
//     try{
//         const writeFile = fs.writeFileSync('node-server/student.json', JSON.stringify([element]), 'utf-8');
//         console.log(writeFile);
//     }
//     catch{
//         console.log('can not find file');
//     }
// }