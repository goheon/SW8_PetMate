import { configureStore, createSlice } from '@reduxjs/toolkit'

//createSlice() : useState()역할임, state 하나를 slice라고 부른다
const latestReview = createSlice({
    name: 'latestReview',
    initialState: [
        {
            id: 1,
            title: "참치 보호자님",
            img: "https://petplanet.cdn.ntruss.com/resized/review/d0dc93d982a549ab96ad358522d647a3.jpg",
            rating: 1,
            petSitter: '이승철 펫시터',
            address: "경기 고양시",
            content: "매번 세심하게 케어해주셔서 안심입니다 덕분에 마음 편하게 여행했어요!",
            tag: ["강아지", "믹스", "방문산책"],
        },
        {
            id: 2,
            title: "모쯔 보호자님",
            img: "https://petplanet.cdn.ntruss.com/resized/review/21018b34f66841b492074b25cbf3e356.jpg",
            rating: 4,
            petSitter: '신창건 펫시터',
            address: "경기 의정부시",
            content: "항상 여행때마다 같이가던 모쯔를 두고 간다는게 저에겐 큰 모험이고 용기였어요 몸이 힘들어도 내손으로 케어하고 직접보는것이 마음이 편했으니까요 그치만 이번 펫시팅을 맡기면서 나보다더잘챙겨주고 마음써주시는 분에게 맡기면 걱정할일이없겠구나 깨달았어요 여행중 일지를 보며 뭉클했던적이 한두번이아니예요 실외배변을 좋아하는 모쯔를위해 하루 세번 산책해주신것, 모쯔가 노즈워크를 좋아하는것도 알고 다양한 노즈워크를 준비해주신것, 하루에 양치두번시키고 빗질해주시는것도 정말 시간과 정성이 많이 필요한 일인데 매일 다해주셨어요 모쯔는 어렸을적부터 유치원다녀봤고 시팅을 보내본적도 꽤있었는데 이처럼 강아지만을 위한 온전한 케어를 해주시는분은 처음이예요 펫시터님을 좀 더 일찍알았더라면 하는 아쉬움이 있을정도예요 약도 영양제도 이것저것 챙겨야할것이 많았을텐데 잘챙겨주시고 이뻐해주셔서 감사합니다 꼭 친척집에 맡기고 여행간 기분이였어요 시터님은 저에게 귀인이세요..♥",
            tag: ["강아지", "비숑프리제", "방문산책"],
        },
        {
            id: 3,
            title: "두부 보호자님",
            img: "https://image.fmkorea.com/files/attach/new3/20230524/33854530/4198757173/5800392759/0601802cf0332ceada42ea34803e59d9.jpg",
            rating: 3,
            petSitter: '박진솔 파트너',
            address: "경기 부천시",
            content: "애들이 홈캠을 떨어트리는 바람에 부랴뷰랴 신청했는데 꼼꼼하게 케어해주셔서 남은 여행 잘 하고 갈 수 있을거같아요 신기한 건 저희 둘째가 심각한 겁쟁이라 낯선 사람을 보면 절대 안나오는데 장지원 펫시터님이 오셨을때 얼굴을 보이더라구요 ㅋㅋㅋ 신기! 감사합니다 나중에 시간 맞으면 또 부탁드려요!",
            tag: ["고양이", "코숏", "방문돌봄"],
        },
        {
            id: 4,
            title: "새해 보호자님",
            img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7pT8cOhNL1GRzTAfyvJ8w1O5Meqbs9t2q7R72MB9nSbuujFfh9miJeXxY5kigkiy5iBw&usqp=CAU",
            rating: 2,
            petSitter: '이고헌 파트너',
            address: "서울 뿌뿌링",
            content: "작년에 열흘간 맡겼을때 너무 잘 돌봐주셔서 이번에도 일주일간 맡긴 보호자입니다. 참지않는 말티즈의 정석같은 새해를 사랑으로 봐주시고 때때로 짖고 구카 자리까지 차지하는 욕심쟁이여도 귀엽게 봐주셔서 정말 감사했습니다...ㅜㅜ하루종일 새해가 쫓아다니는걸 보니 얼마나 파트너님을 신뢰하고 의지하는지 알 수 있었어요. 일상도 틈틈히 공유해주셔서 더욱 마음편히 지낼 수 있었습니다. 감사합니다 ~ 구카와 함께 평온하고 행복한 나날들 보내시길 바랄게요🍀🤍 (발 받침대까지 파트너님을 따라다녔던 새해 사진)",
            tag: ["고양이", "페르시안", "방문돌봄"],
        }

    ]
})

const petSitterInfo = createSlice({
    name: "petSitterInfo",
    initialState: [
        {
            userId: 1,
            name: "이하은",
            img: "https://dispatch.cdnser.be/cms-content/uploads/2020/10/22/bd74cb66-a4ef-4c57-9358-1cb0494d9dc2.jpg",
            review: 215,
            regularCustomer: 145,
            info: [
                "펫시터 전문가 교육 수료",
                "전문 펫시터 자격증 보유",
                "펫시터 직업 훈련 교육 수료",
                "반려동물행동교정사 2급 자격증 보유",
                "강아지 반려 경험 (14년) 인증 완료",
                "고양이 반려 경험 (8년) 인증 완료"
            ],
            check: [
                "신원 인증",
                "인성 검사",
                "촬영 동의"
            ]

        },
        {
            userId: 2,
            name: "전다현",
            img: "https://cdn.spotvnews.co.kr/news/photo/202306/614926_863772_1541.jpg",
            review: 115,
            regularCustomer: 45,
            info: [
                "펫시터 전문가 교육 수료",
                "KSD 훈련사 자격증 보유",
                "펫시터 직업 훈련 교육 수료",
                "반려동물관리사 1급 자격증 보유",
                "고양이 반려 경험 (6년) 인증 완료"
            ],
            check: [
                "신원 인증",
                "인성 검사",
                "촬영 동의"
            ]
        },
        {
            userId: 3,
            name: "뿌링클",
            img: "https://isplus.com/data/isp/image/2022/12/22/isp88870ed2-900e-48e0-9f52-5fbcc09ec833.600x.0.jpg",
            review: 455,
            regularCustomer: 345,
            info: [
                "펫시터 전문가 교육 수료",
                "전문 펫시터 자격증 보유",
                "반려동물행동교정사 자격증 보유",
                "강아지 반려 경험 (5년) 인증 완료",
            ],
            check: [
                "신원 인증",
                "촬영 동의",
            ]
        },

    ]

})

const loginUserInfo = createSlice({
    name: "loginUserInfo",
    initialState: {
        username: "이승철",
        email: "dltmd1502@naver.com",
        phone: undefined,
        address: "부천시 원미구 중2동",
        detailAddress: "쿵야마을",
        isRole: null,
    }
})

const allOrderList = createSlice({
    name: "allOrderList",
    initialState: [
        {
            orderId: 1,
            userId: "유저고유id값",
            sitterId: "펫시터고유id값",
            pets: [{
                type: "고양이",
                size: "소형",
                name: "참치",
                age: 3,
                gender: "여",
                variety: "페르시안"
            }],
            totalPrice: 50000,
            createdAt: new Date(2024, 3, 1),
            state: "진행중",
            detailInfo: "상세 요청사항 / 저희 집 강아지 무니깐 조심쿵야 하세요",
            start: new Date(),
            end: new Date(),
        },
        {
            orderId: 2,
            userId: "유저고유id값",
            sitterId: "펫시터고유id값",
            pets: [{
                type: "강아지",
                size: "중형",
                name: "쿵야",
                age: 5,
                gender: "남",
                variety: "시바"
            }],
            totalPrice: 30000,
            createdAt: new Date(2024, 3, 2),
            state: "완료",
            detailInfo: "상세 요청사항입니다 어쩌구 저쩌꾸",
            start: new Date(),
            end: new Date(),
        },
        {
            orderId: 3,
            userId: "유저고유id값",
            sitterId: "펫시터고유id값",
            pets: [{
                type: "강아지",
                size: "대형",
                name: "레고",
                age: 7,
                gender: "남",
                variety: "허스키"
            },
            {
                type: "고양이",
                size: "소형",
                name: "먼지",
                age: 3,
                gender: "여",
                variety: "치즈냥이"
            },
            ],
            totalPrice: 100000,
            createdAt: new Date(2024, 3, 3),
            state: "취소",
            detailInfo: "강아지는 하루종일 산책 해주시고, 고양이는 벅벅 씻겨주세요",
            start: new Date(),
            end: new Date(),
        }
    ]
})

export default configureStore({
    reducer: {
        //만든거 여기다 등록해야 사용가능
        latestReview: latestReview.reducer,
        petSitterInfo: petSitterInfo.reducer,
        loginUserInfo: loginUserInfo.reducer,
        allOrderList: allOrderList.reducer,
    }
}) 