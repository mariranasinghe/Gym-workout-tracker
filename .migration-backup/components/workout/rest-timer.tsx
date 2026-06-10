'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pause, Play, RotateCcw, Timer, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const PRESETS = [30, 60, 90, 120, 180]

export function RestTimer() {
  const [isOpen, setIsOpen] = useState(false)
  const [seconds, setSeconds] = useState(90)
  const [isRunning, setIsRunning] = useState(false)
  const [initialTime, setInitialTime] = useState(90)

  const formatTime = useCallback((secs: number) => {
    const mins = Math.floor(secs / 60)
    const remainingSecs = secs % 60
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((s) => s - 1)
      }, 1000)
    } else if (seconds === 0 && isRunning) {
      setIsRunning(false)
      // Vibrate on completion if supported
      if ('vibrate' in navigator) {
        navigator.vibrate([200, 100, 200])
      }
    }

    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const handlePreset = (preset: number) => {
    setSeconds(preset)
    setInitialTime(preset)
    setIsRunning(true)
  }

  const handleReset = () => {
    setSeconds(initialTime)
    setIsRunning(false)
  }

  const progress = initialTime > 0 ? (seconds / initialTime) * 100 : 0

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 rounded-full shadow-lg bg-card border-border"
      >
        <Timer className="w-4 h-4 mr-2" />
        Rest Timer
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-24 right-4 left-4 z-40 p-4 bg-card border-border shadow-2xl sm:left-auto sm:w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Timer className="w-4 h-4" />
          Rest Timer
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Timer display */}
      <div className="relative mb-4">
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full transition-all duration-1000',
              seconds > 10 ? 'bg-primary' : 'bg-destructive'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center mt-3">
          <span className={cn(
            'text-4xl font-bold tabular-nums',
            seconds === 0 && 'text-success',
            seconds <= 10 && seconds > 0 && 'text-destructive'
          )}>
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="h-10 w-10"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          onClick={() => setIsRunning(!isRunning)}
          className={cn(
            'h-12 w-12 rounded-full',
            isRunning ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90'
          )}
        >
          {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </Button>
        <div className="w-10" /> {/* Spacer for centering */}
      </div>

      {/* Presets */}
      <div className="flex gap-2 justify-center">
        {PRESETS.map((preset) => (
          <Button
            key={preset}
            variant="outline"
            size="sm"
            onClick={() => handlePreset(preset)}
            className="text-xs"
          >
            {preset < 60 ? `${preset}s` : preset === 90 ? '1:30' : `${Math.floor(preset / 60)}m`}
          </Button>
        ))}
      </div>
    </Card>
  )
}
