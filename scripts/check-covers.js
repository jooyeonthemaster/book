/*
  표지 이미지 매칭 감사 스크립트
  - verified_books.json의 author+title로 기대 파일명을 생성
  - public/bookcover 디렉터리의 실제 파일 목록과 비교
  - 저자/파일명 매핑 규칙(예: '마테오 B. 비앙키' -> '마테오 비앙키')을 적용한 대안 매칭도 제안
*/

const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const coversDir = path.join(root, 'public', 'bookcover')
const dataPath = path.join(root, 'src', 'data', 'verified_books.json')

/**
 * 파일 존재 여부 안전 체크
 */
function safeReadDir(dir) {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((d) => d.isFile())
      .map((f) => f.name)
  } catch (e) {
    return []
  }
}

/**
 * 저자명 정규화 매핑 규칙
 * - 데이터의 author를 파일명의 author에 맞추기 위한 규칙들
 */
const authorMapping = {
  '마테오 B. 비앙키': '마테오 비앙키',
}

function applyAuthorMapping(author) {
  return authorMapping[author] || author
}

function main() {
  const files = new Set(safeReadDir(coversDir))
  const json = JSON.parse(fs.readFileSync(dataPath, 'utf8'))
  const books = json.books || []

  const expectedRaw = books.map((b) => `${b.author}_${b.title}.jpg`)
  const expectedMapped = books.map(
    (b) => `${applyAuthorMapping(b.author)}_${b.title}.jpg`
  )

  const missingRaw = expectedRaw.filter((n) => !files.has(n))
  const missingAfterMapping = missingRaw.filter(
    (n) => !files.has(n.replace(`${n.split('_')[0]}_`, '')) // placeholder, not used
  )

  // 매핑 적용 후 실제로 해결되는 항목만 추려서 리포트
  const mappingResolutions = []
  for (const b of books) {
    const raw = `${b.author}_${b.title}.jpg`
    const mapped = `${applyAuthorMapping(b.author)}_${b.title}.jpg`
    if (!files.has(raw) && files.has(mapped) && raw !== mapped) {
      mappingResolutions.push({
        id: b.id,
        title: b.title,
        author: b.author,
        mappedAuthor: applyAuthorMapping(b.author),
        expectedRaw: raw,
        expectedMapped: mapped,
      })
    }
  }

  const extra = [...files].filter((n) => !expectedRaw.includes(n) && !expectedMapped.includes(n))

  console.log('=== BOOK COVER AUDIT ===')
  console.log('총 책 수:', books.length)
  console.log('public/bookcover 파일 수:', files.size)
  console.log('누락(원본 규칙 기준) 수:', missingRaw.length)
  if (missingRaw.length) {
    console.log('\n[누락 목록 - 원본 규칙(author_title).jpg]')
    missingRaw.forEach((n) => console.log(' -', n))
  }

  if (mappingResolutions.length) {
    console.log('\n[매핑 규칙 적용 시 해결되는 항목]')
    mappingResolutions.forEach((m) => {
      console.log(
        ` - #${m.id} ${m.author} → ${m.mappedAuthor} | ${m.expectedRaw} -> ${m.expectedMapped}`
      )
    })
  }

  if (extra.length) {
    console.log('\n[추가 파일 - 데이터에 없음 (상위 50개)]')
    extra.slice(0, 50).forEach((n) => console.log(' -', n))
  }

  // 요약
  console.log('\n--- 요약 ---')
  console.log(
    `누락 ${missingRaw.length}건, 매핑으로 해결 ${mappingResolutions.length}건, 추가 ${extra.length}건`
  )
}

main()


