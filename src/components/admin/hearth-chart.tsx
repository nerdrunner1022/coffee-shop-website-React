import { useId } from 'react'

import type { ChartSeries } from '@/mocks/schema'

const WIDTH = 720
const HEIGHT = 220
const PAD_X = 28
const PAD_Y = 24
const MAX = 50

export function HearthChart({
  series,
  metrics,
}: {
  series: ChartSeries
  metrics: Array<{ label: string; value: string; note: string }>
}) {
  const gradientId = useId().replace(/:/g, '')
  const values = series.points.map((point) => point.value)
  const step = (WIDTH - PAD_X * 2) / Math.max(series.points.length - 1, 1)
  const points = values.map((value, index) => ({
    x: PAD_X + index * step,
    y: HEIGHT - PAD_Y - (value / MAX) * (HEIGHT - PAD_Y * 2),
    value,
    label: series.points[index]?.label ?? '',
  }))
  const line = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ')
  const area = `${line} L ${points[points.length - 1]?.x ?? WIDTH - PAD_X} ${HEIGHT - PAD_Y} L ${PAD_X} ${HEIGHT - PAD_Y} Z`
  const peak = points.reduce((best, point) => (point.value > best.value ? point : best), points[0])
  const labelIndexes = [0, 2, 5, 8, 11]

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm text-primary">
            Hourly Extraction Velocity & Revenue Rush
          </h2>
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            Sand bath temperature 240°C • Extraction cycles across 6 hearth stations
          </p>
        </div>
        <div className="hidden rounded-full bg-secondary-fixed px-3 py-1.5 font-label-sm text-label-sm text-on-secondary-fixed sm:block">
          {series.peak}
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-card bg-surface-container-low p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={`${series.label} extraction velocity from 07:00 to 18:00. Peak ${series.peak}.`}
          className="h-56 w-full"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#994703" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#994703" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((lineIndex) => {
            const y = PAD_Y + (lineIndex * (HEIGHT - PAD_Y * 2)) / 3
            return (
              <line
                key={lineIndex}
                x1={PAD_X}
                y1={y}
                x2={WIDTH - PAD_X}
                y2={y}
                stroke="#d3c3be"
                strokeOpacity="0.55"
                strokeDasharray="3 6"
              />
            )
          })}
          <path d={area} fill={`url(#${gradientId})`} />
          <path
            d={line}
            fill="none"
            stroke="#994703"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {peak ? (
            <>
              <circle cx={peak.x} cy={peak.y} r="7" fill="#fdf9f4" stroke="#994703" strokeWidth="2.5" />
              <circle cx={peak.x} cy={peak.y} r="2.5" fill="#994703" />
            </>
          ) : null}
          {labelIndexes.map((index) => {
            const point = points[index]
            if (!point) return null
            return (
              <text
                key={point.label}
                x={point.x}
                y={HEIGHT - 4}
                textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
                fill="#504440"
                fontSize="11"
                fontFamily="DM Sans, sans-serif"
              >
                {point.label}
              </text>
            )
          })}
        </svg>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-card bg-surface-container-low p-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label}>
            <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">
              {metric.label}
            </div>
            <div className="mt-0.5 font-headline-sm text-headline-sm font-bold text-primary">
              {metric.value}
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">{metric.note}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
