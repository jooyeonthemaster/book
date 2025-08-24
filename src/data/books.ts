import { Book } from '@/types'

export const books: Book[] = [
  {
    id: 1,
    title: "미드나이트 라이브러리",
    author: "매트 헤이그",
    genre: ["소설", "철학"],
    description: "삶의 무한한 가능성을 탐험하는 감동적인 이야기",
    mood: ["사색적인", "희망적인", "위로받는"],
    themes: ["인생", "선택", "후회", "가능성"],
    readingTime: "4-6시간",
    difficulty: "medium",
    publishYear: 2020,
    rating: 4.5
  },
  {
    id: 2,
    title: "아몬드",
    author: "손원평",
    genre: ["소설", "성장"],
    description: "감정을 느끼지 못하는 소년의 성장 이야기",
    mood: ["감동적인", "따뜻한", "성찰적인"],
    themes: ["성장", "가족", "우정", "차이"],
    readingTime: "3-4시간",
    difficulty: "easy",
    publishYear: 2017,
    rating: 4.3
  },
  {
    id: 3,
    title: "사피엔스",
    author: "유발 하라리",
    genre: ["인문학", "역사"],
    description: "인류의 역사를 새로운 시각으로 바라본 베스트셀러",
    mood: ["지적인", "호기심", "통찰적인"],
    themes: ["인류", "문명", "진화", "미래"],
    readingTime: "8-10시간",
    difficulty: "hard",
    publishYear: 2011,
    rating: 4.7
  },
  {
    id: 4,
    title: "82년생 김지영",
    author: "조남주",
    genre: ["소설", "사회"],
    description: "한국 여성의 현실을 담은 화제작",
    mood: ["현실적인", "공감하는", "생각하게 하는"],
    themes: ["여성", "사회", "차별", "일상"],
    readingTime: "2-3시간",
    difficulty: "easy",
    publishYear: 2016,
    rating: 4.1
  },
  {
    id: 5,
    title: "코스모스",
    author: "칼 세이건",
    genre: ["과학", "천문학"],
    description: "우주에 대한 경이로운 탐험",
    mood: ["경이로운", "지적인", "광활한"],
    themes: ["우주", "과학", "탐험", "경이"],
    readingTime: "10-12시간",
    difficulty: "hard",
    publishYear: 1980,
    rating: 4.8
  },
  // ... 25개 더 추가 예정
]

