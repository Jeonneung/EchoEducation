const express = require('express');
const multer = require('multer');
const path = require('path');

// app 선언
const app = express();
const port = 3000;

// ImagePath 변수 선언
let uploadedImagePath = '';
// let result = '';

// view engine을 pug로 설정
// Pug 템플릿 파일이 위치하는 디렉토리 설정
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 이미지 업로드를 위한 Multer 설정
const storage = multer.diskStorage({
    // 파일/ 경로명 설정
    // 앞의 public은 루트와 다름이 없다. 실제 이미지 접근 링크는 'localhost:3000/uploads/이미지명'이 되어야 한다.
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// 정적 파일을 제공하기 위해 public 디렉토리 설정
app.use(express.static(path.join(__dirname, 'public')));

// 홈 페이지
app.get('/', (req, res) => {
    res.render('home');
});

// 이미지 업로드 처리
app.post('/upload', upload.single('photo'), (req, res) => {
    console.log(req.file);
    uploadedImagePath = req.file.path.replace('public', ''); // 업로드된 파일의 저장된 경로 가져옴
    // 이미지 경로를 세션에 저장하거나 데이터베이스에 저장 가능
    // 모델에 이미지 프로세싱 돌려서 결과 보고... 그러면 될듯
    // imageResult = APIprocessingFunc()
    res.redirect('/result');
});

// 이미지 보여주는 페이지
app.get('/result', (req, res) => {
    // 세션에서 이미지 경로를 가져오거나 데이터베이스에서 가져올 수 있음
    res.render('result', { imagePath: uploadedImagePath, result: result });
});

// 분리수거 인증하는 페이지
app.get('/authentication', (req, res) => {
    res.render('authentication')
})

// 인증 완료 표시 페이지
app.post('/auth', (req, res) => {
    res.render('auth')
})

const handleExcept = (req, res) => {
    return res.send('Sorry, we can\'t find page.')
}
app.use(handleExcept);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
