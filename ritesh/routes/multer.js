const multer = require('multer');
const {v4:uuidv4} = require('uuid');
const path = require('path');

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/uploads')
    },
    filename: function (req,file,cb){

        const uniquename= uuidv4();
        cb(null,uniquename+path.extname(file.originalname));
    }
});


const dpStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4();
        cb(null, uniqueName + path.extname(file.originalname));
    }
});



const upload =  multer({storage:storage});
const dpupload = multer ({storage:dpStorage});
module.exports= upload;
module.exports=dpupload;