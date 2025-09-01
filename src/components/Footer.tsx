export default function Footer() {
  return (
    <footer className="relative z-30 py-16">
      <div className="container mx-auto px-4">
        {/* 카드 스타일: 앱 전체 UI와 통일된 글래스/화이트 패널 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-black/20 shadow-2xl relative overflow-hidden">
          {/* 디지털 노트 패턴 */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(90deg, transparent 0px, transparent 19px, rgba(0,0,0,0.03) 20px, rgba(0,0,0,0.03) 21px),
              repeating-linear-gradient(0deg, transparent 0px, transparent 23px, rgba(0,0,0,0.03) 24px, rgba(0,0,0,0.03) 25px)
            `
          }}></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="md:col-span-2">
              <a className="text-lg md:text-xl font-bold text-black" href="https://neander.co.kr" target="_blank" rel="noopener noreferrer">(주)네안데르</a>
              <p className="mt-4 text-gray-700 max-w-md font-typewriter text-xs md:text-sm">기술(Technology), 예술(Art), 그리고 향기(Fragrance)의 경계에서 새로운 감각적 경험을 구현합니다.</p>
              <div className="mt-6 text-xs md:text-sm text-gray-600 font-typewriter">
                <p>대표자: 유재영, 이동주</p>
                <p>사업자등록번호: 683-86-02812</p>
              </div>
              {/* 소셜 버튼 제거 */}
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold mb-4 text-black">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-3 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                  <a href="mailto:ok@neadner.co.kr" className="text-gray-700 hover:text-black transition-colors font-typewriter text-xs md:text-sm">ok@neadner.co.kr</a>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-3 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                  <div className="text-gray-700 font-typewriter text-xs md:text-sm">
                    <a href="tel:02-336-3368" className="hover:text-black transition-colors">02-336-3368</a>
                    <span className="text-gray-400"> / </span>
                    <a href="tel:010-8507-5121" className="hover:text-black transition-colors">010-8507-5121</a>
                  </div>
                </li>
                <li className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 mr-3 text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-gray-700 font-typewriter text-xs md:text-sm">서울특별시 마포구 백범로 13 308호</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 하단 바텀라인 */}
          <div className="relative z-10 mt-12 pt-8 border-t border-black/10 text-center text-gray-600 text-xs md:text-sm font-typewriter">
            <p>© 2025 (주)네안데르. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}


