const express = require('express');
const multer = require('multer');
const path = require('path');

// app 선언
const app = express();
const port = 3000;

// ImagePath 변수 선언
let uploadedImagePath = '';
let result = '';

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

// 인포메이션 페이지
app.get('/info', (req, res) => {
    res.render('info');
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
    let data = {}
    result = '1_polyethylene_PET';
    // ['1_polyethylene_PET', '2_high_density_polyethylene_PE-HD', '3_polyvinylchloride_PVC', '4_low_density_polyethylene_PE-LD',
    //  '5_polypropylene_PP', '6_polystyrene_PS', '7_other_resins','8_no_plastic']
    switch(result) {
        case '1_polyethylene_PET':
            result = "PET"
            data.description = "투명도가 높고 가벼워 잘 깨지지 않아요. 수분 흡수율 또한 낮아 특히 투명한 병제품으로 많이 가공되는데, PET 플라스틱으로 뜨거운 물을 마셔도 환경호르면 걱정은 안 해도 돼요.";
            data.process_beforeTrash = `1. 부착된 라벨과 내부의 이물질을 깨끗이 닦고 구겨서 PET 쓰레기 분류함에 버려 주세요.\n2. 특수한 휴대폰 케이스 등의 플라스틱 제품은 색이 있다면 Other 플라스틱으로 분류되니 유의해 주세요.`;
            break;
        case '2_high_density_polyethylene_PE-HD':
            result = "PE-HD"
            data.description = "가벼우면서도, 강도가 높아 다양한 제품을 보호하기 유용한 반투명한 고체 형태에요. 여름, 겨울에 상관없이 내후성이 뛰어나 녹이 슬지 않고 인체에 무해해요."
            data.process_beforeTrash = "1. hdpe 제품은 어떻게 버리느냐에 따라 재활용 여부가 결정돼요.\n2. 묻은 이물질과 라벨을 떼서 각각 버려주세요. 역시 열에 강해서 온수로 이물질을 제거해주어도 괜찮아요.\n3. 특히 생수명의 뚜껑은 PET에, 병 뚜껑은 플라스틱 쓰레기에 분리하여 버려주면 좋아요."
            break;
        case '3_polyvinylchloride_PVC':
            result = "PVC"
            data.description = "열에 약차지만 안정제, 유화제, 플라스티티저 등의 첨가물을 넣어 다양한 제품의 원재료가 돼요. 그러나 또한 첨가물때문에 분해 및 처리 과정에서 다른 유해 화학물질이 발생하는 경우가 비일비재하여 재활용 난이도가 매우 높아요."
            data.process_beforeTrash = "1. PVC 제품은 재활용이 까다로우니, 지자체 재활용 규정을 먼저 확인해주세요.\n2. 대부분의 PVC 제품은 재활용이 되지 않기 때문에 지자체 규정을 확인하기 어렵다면 일반쓰레기로 버리는게 더 효율적이에요."
            break;
        case '4_low_density_polyethylene_PE-LD':
            result = "PE-LD"
            data.description = "유연하고 투명한 열가소성 플라스틱으로, 저밀도라서 가볍고 휘도가 높아 포장재 및 플라스틱 필름에 널리 사용되며, 낮은 온도에서 잘 견딜 수 있어요."
            data.process_beforeTrash = "1. 재활용이 가능한 폴리에틸렌은 Recycle 마크가 있으니 먼저 확인해주세요.\n2. 이물질이 묻어있다면 간단하게 물로 한 번 헹궈주세요.\n3. 플라스틱 용기에 상품라벨이 붙어있다면 분리해주세요.\n4. 만약 이물질이나 상품 라벨이 깨끗하게 제거되지 않는다면 일반쓰레기로 처리해주세요."
            break
        case '5_polypropylene_PP':
            result = "PP"
            data.description = "낮은 온도에서 잘 부숴지지만, 높은 투명도를 가지고 있으며 무게가 가볍고 생산 단가가 낮아 경제적이에요. 또한 내구성이 강하고 습기에 강해 재활용하기 쉬운 다재다능한 플라스틱이에요."
            data.process_beforeTrash = "1. 주로 음식용기 등으로 자주 사용되는 제품인데, 고온에서도 환경호르몬이 나오지 않아요.\n2. 뜨거운 물로 음식 기름을 빠르게 헹궈주세요.\n3. 다 닦고 혹시나 라벨이 있다면 제거해 플라스틱 통에 배출해주세요."
            break;
        case '6_polystyrene_PS':
            result = "PS"
            data.description = "폴리스티렌은 성형이 쉽고 가벼워 가공이 매우 용이해요. 또한 생산원가가 저렴하고 투명도를 다양하게 조절할 수 있지만, 열에 약하고 녹는 과정에서 매우 유해한 환경호르몬을 배출하는데다 잘게 부숴지는 특성이 있어 미세플라스틱의 주요 발생원으로 지적받고 있어요."
            data.process_beforeTrash = "1. PS 제품 중 수저나 요구르트병 등 작은 플라스틱은 처리장에서 선별하기가 매우 어려워서, 따로 종량제 봉투에 모아서 배출해주면 좋아요.\n2. 식제품은 스티로폼으로 배송이 오는 경우가 흔한데, 이 때 테이프나 상표, 스티커는 전부 분리해서 버려줘야 해요."
            break;
        case '7_other_resins':
            result = "OTHERS"
            data.description = "혼합재질플라스틱으로 기존의 플라스틱에 다른 불특정한 원료가 섞인 모든 플라스틱을 의미해요. 대표적으로 도색된 플라스틱, 음식물이 닦이지 않는 플라스틱 등이 있어요. 이러한 이유때문에 재활용 난이도가 매우 높아요."
            data.process_beforeTrash = "1. 재활용이 매우 까다롭긴 하지만 처리 공정에서 자동으로 분류되는 과정을 거치므로 플라스틱 쓰레기 분류함에 버려주세요.\n2. 이물질을 제대로 제거해줄 수록 재활용될 가능성이 높아져요.\n3. Other 플라스틱을 제대로 분류하기 위한 EPR 제도가 있어요. 많은 관심을 가져주시면 도움이 돼요!"
            break;
        case '8_no_plastic':
            result = "No-Plastic"
            data.description = "이 제품은 플라스틱이 아니에요. 다른 제품을 찾아주세요!"
            data.process_beforeTrash = ""
            break;
    }
    res.render('result', { imagePath: uploadedImagePath, result: result, data: data });
});

// 분리수거 인증하는 페이지
app.get('/authentication', (req, res) => {
    res.render('authentication');
});

// 인증 완료 표시 페이지
app.post('/auth', (req, res) => {
    res.render('auth');
});

const handleExcept = (req, res) => {
    return res.send('Sorry, we can\'t find page.');
};
app.use(handleExcept);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
