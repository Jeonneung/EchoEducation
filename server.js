import express from "express";
import morgan from "morgan";
import multer from "multer";

const app = express();
const path = require('path');

// Routers
const globalRouter = express.Router();
const resultRouter = express.Router();

// Functions
const prohibit = (req, res) => {
    return res.send("Sorry, We can't find requested URL.");
}
const handleHome = (req, res) => {
    return res.render("home", { pageTitle: 'Home' });
}
const postUpload = async(req, res) => {
    const file = req.file;
    const { photo } = req.body;
    try {
        await photo.create({
            fileUrl: file.path,
        });
        return res.redirect("/result");
    } catch (error) {
        return res.status(400).render("home", {
            pageTitle: "Home"
        })
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        global filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        cb(null, filename);
    }
})
// middleware
const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 10000000,
    },
});

// middleware
// morgan: req 정보를 더 자세하게 알 수 있게 해줌.
app.use(morgan("dev"));

// routes
globalRouter
    .route("/")
    .get(handleHome)
    .post(upload.single('photo'), postUpload);

globalRouter
    .route("/upload")
    .get(res.send("<img src='filename' alt='uploaded Image>"))

// View Engie Settings
app.set("view engine", "pug");

// Router Settings
app.use("/", globalRouter);
app.use("/result", resultRouter);

// Handling Exception
app.use(prohibit);

// PORT Listening...
const PORT = 4500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});