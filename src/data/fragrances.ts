import { Fragrance } from '@/types'

export const fragrances: Fragrance[] = [
  {
    id: 1,
    name: "미드나이트 블룸",
    category: "플로럴",
    notes: {
      top: ["베르가못", "레몬"],
      middle: ["자스민", "장미", "은방울꽃"],
      base: ["머스크", "앰버", "바닐라"]
    },
    mood: ["로맨틱", "신비로운", "우아한"],
    season: ["봄", "여름"],
    timeOfDay: ["저녁", "밤"],
    intensity: "medium",
    description: "밤에 피어나는 꽃들의 신비로운 향기",
    matchingGenres: ["소설", "로맨스", "시집"]
  },
  {
    id: 2,
    name: "오션 브리즈",
    category: "아쿠아틱",
    notes: {
      top: ["바다 소금", "오존"],
      middle: ["해초", "연꽃"],
      base: ["드리프트우드", "앰버그리스"]
    },
    mood: ["상쾌한", "자유로운", "평온한"],
    season: ["여름", "봄"],
    timeOfDay: ["아침", "낮"],
    intensity: "light",
    description: "바다의 시원하고 깨끗한 바람",
    matchingGenres: ["여행", "에세이", "자연"]
  },
  {
    id: 3,
    name: "라이브러리 머스크",
    category: "우디",
    notes: {
      top: ["종이", "잉크"],
      middle: ["가죽", "오크"],
      base: ["머스크", "바닐라", "앰버"]
    },
    mood: ["지적인", "차분한", "집중하는"],
    season: ["가을", "겨울"],
    timeOfDay: ["오후", "저녁"],
    intensity: "medium",
    description: "오래된 도서관의 따뜻하고 지적인 향기",
    matchingGenres: ["인문학", "철학", "역사", "과학"]
  },
  {
    id: 4,
    name: "시트러스 에너지",
    category: "시트러스",
    notes: {
      top: ["자몽", "오렌지", "레몬"],
      middle: ["민트", "바질"],
      base: ["화이트 머스크", "시더"]
    },
    mood: ["활기찬", "긍정적인", "상쾌한"],
    season: ["봄", "여름"],
    timeOfDay: ["아침", "낮"],
    intensity: "light",
    description: "하루를 시작하는 상쾌한 에너지",
    matchingGenres: ["자기계발", "경영", "건강"]
  },
  {
    id: 5,
    name: "벨벳 로즈",
    category: "플로럴",
    notes: {
      top: ["핑크 페퍼", "베르가못"],
      middle: ["다마스크 로즈", "피오니"],
      base: ["파촐리", "오크모스", "바닐라"]
    },
    mood: ["우아한", "감성적인", "로맨틱"],
    season: ["봄", "가을"],
    timeOfDay: ["오후", "저녁"],
    intensity: "strong",
    description: "고급스럽고 깊이 있는 장미의 향연",
    matchingGenres: ["로맨스", "시집", "예술"]
  },
  // ... 25개 더 추가 예정
]

