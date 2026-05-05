'use client';

import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SPEED_OPTIONS } from '@/lib/visualization/types';

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentIndex: number;
  totalSteps: number;
  speed: number;
  canStepForward: boolean;
  canStepBackward: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onSeek: (index: number) => void;
}

export function PlaybackControls({
  isPlaying,
  currentIndex,
  totalSteps,
  speed,
  canStepForward,
  canStepBackward,
  onPlay,
  onPause,
  onStepBackward,
  onStepForward,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  const progress = totalSteps > 0 ? (currentIndex + 1) / totalSteps : 0;

  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4 bg-muted/50 rounded-lg">
      {/* Control buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-2">
        {/* Main controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onReset}
            disabled={currentIndex === 0}
            title="重置"
            aria-label="重置动画"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onStepBackward}
            disabled={!canStepBackward}
            title="上一步"
            aria-label="上一步"
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="default"
            size="icon"
            onClick={isPlaying ? onPause : onPlay}
            disabled={totalSteps === 0 || (isPlaying && !canStepForward)}
            title={isPlaying ? '暂停' : '播放'}
            aria-label={isPlaying ? '暂停动画' : '播放动画'}
            className="w-10 h-10"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5" />
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={onStepForward}
            disabled={!canStepForward}
            title="下一步"
            aria-label="下一步"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Speed selector */}
        <div className="flex items-center gap-1 sm:ml-4">
          <span className="text-sm text-muted-foreground mr-1">速度:</span>
          {SPEED_OPTIONS.map((s) => (
            <Button
              key={s}
              variant={speed === s ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSpeedChange(s)}
              className="px-2 h-7 text-xs"
            >
              {s}x
            </Button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-150"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
        <span className="text-sm text-muted-foreground min-w-[50px] sm:min-w-[60px] text-right">
          {currentIndex + 1} / {totalSteps}
        </span>
      </div>
    </div>
  );
}
