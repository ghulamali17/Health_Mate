const multer=require("multer");
const storage=multer.diskStorage({
  filename: function(req,file,cb){
    return cb(null,`${Date.now()}_${file.originalname}`)
  }
})

const upload=multer({storage: storage})

module.exports=upload;