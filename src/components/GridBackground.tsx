'use client'

import React, { useEffect, useRef, useCallback, useMemo } from 'react'

interface Tile {
  x: number
  y: number
  color: string
  opacity: number
  size: number
}

export const GridBackground = React.memo(function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const tilesRef = useRef<Tile[]>([])
  const lastTimeRef = useRef<number>(0)

  // 색상 배열을 useMemo로 캐싱
  const colors = useMemo(() => [
    '#FF0040', '#FF4081', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4',
    '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#607D8B', '#FF1744', '#F50057', '#D500F9', '#651FFF', '#3D5AFE',
    '#2979FF', '#00B0FF', '#00E5FF', '#1DE9B6', '#00E676', '#76FF03', '#C6FF00', '#FFFF00',
    '#FFD600', '#FFAB00', '#FF6D00', '#DD2C00', '#FF6B35', '#FF8F00', '#FF3D00', '#E65100',
    '#BF360C', '#FF5252', '#FF4444', '#FF6E40', '#FFAB40', '#FFD740', '#EEFF41', '#69F0AE'
  ], [])

  // 타일 생성 함수를 useCallback으로 최적화
  const generateTiles = useCallback((width: number, height: number): Tile[] => {
    const tiles: Tile[] = []
    
    // 화면 크기에 따라 동적으로 타일 크기와 개수 조정
    const screenArea = width * height
    const targetTileCount = Math.min(Math.floor(screenArea / 8000), 600) // 화면 크기에 비례, 최대 600개
    const tileSize = Math.sqrt(screenArea / targetTileCount) * 0.8 // 적절한 타일 크기 계산
    
    const cols = Math.ceil(width / tileSize)
    const rows = Math.ceil(height / tileSize)
    
    const opacityValues = [0.6, 0.7, 0.8, 0.9]
    
    // 화면 전체에 균등하게 분산 배치
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // 일부 타일을 랜덤하게 건너뛰어 자연스러운 분포 생성
        if (Math.random() > 0.85) continue
        
        tiles.push({
          x: col * tileSize + Math.random() * (tileSize * 0.3), // 랜덤 오프셋
          y: row * tileSize + Math.random() * (tileSize * 0.3),
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: opacityValues[Math.floor(Math.random() * opacityValues.length)],
          size: tileSize * (0.7 + Math.random() * 0.4) // 크기 변화 (70%~110%)
        })
      }
    }
    
    return tiles
  }, [colors])

  // Canvas 렌더링 함수
  const drawTiles = useCallback((ctx: CanvasRenderingContext2D, currentTime: number) => {
    const canvas = ctx.canvas
    
    // 캔버스 클리어
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 타일 그리기
    tilesRef.current.forEach((tile, index) => {
      // 부드러운 애니메이션을 위한 시간 기반 계산
      const timeOffset = currentTime * 0.001 + index * 0.1
      const animatedOpacity = tile.opacity * (0.8 + 0.2 * Math.sin(timeOffset))
      
      ctx.globalAlpha = animatedOpacity
      ctx.fillStyle = tile.color
      
      // 둥근 모서리 사각형 그리기 (fallback for older browsers)
      const radius = 3
      ctx.beginPath()
      if (ctx.roundRect) {
        ctx.roundRect(tile.x, tile.y, tile.size, tile.size, radius)
      } else {
        // Fallback for browsers without roundRect support
        ctx.rect(tile.x, tile.y, tile.size, tile.size)
      }
      ctx.fill()
    })
    
    ctx.globalAlpha = 1
  }, [])

  // 애니메이션 루프
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // 60fps 제한 (16.67ms)
    if (currentTime - lastTimeRef.current >= 16.67) {
      drawTiles(ctx, currentTime)
      lastTimeRef.current = currentTime
    }
    
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [drawTiles])

  // 리사이즈 핸들러
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const { innerWidth, innerHeight } = window
    const dpr = window.devicePixelRatio || 1
    
    // 캔버스 크기 설정 (고해상도 지원)
    canvas.width = innerWidth * dpr
    canvas.height = innerHeight * dpr
    canvas.style.width = `${innerWidth}px`
    canvas.style.height = `${innerHeight}px`
    
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }
    
    // 새로운 타일 생성
    tilesRef.current = generateTiles(innerWidth, innerHeight)
  }, [generateTiles])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // 초기 설정
    handleResize()
    
    // 애니메이션 시작
    animationFrameRef.current = requestAnimationFrame(animate)
    
    // 리사이즈 이벤트 리스너 (throttled)
    let resizeTimeout: NodeJS.Timeout
    const throttledResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 100)
    }
    
    window.addEventListener('resize', throttledResize)
    
    // 클린업
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      window.removeEventListener('resize', throttledResize)
      clearTimeout(resizeTimeout)
    }
  }, [handleResize, animate])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {/* Canvas 배경 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          background: 'transparent',
          willChange: 'transform' // GPU 가속 활성화
        }}
      />
      
      {/* 가벼운 블러 오버레이 */}
      <div className="absolute inset-0 backdrop-blur-[1px] bg-black/10" />
    </div>
  )
})

