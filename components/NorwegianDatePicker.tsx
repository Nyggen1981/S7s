'use client'

import { useState, useRef } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS_NO = [
  'Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'
]

const DAYS_NO = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn']

interface NorwegianDatePickerProps {
  value: string
  onChange: (date: string) => void
  max?: string
  required?: boolean
}

export default function NorwegianDatePicker({ value, onChange, max, required }: NorwegianDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value)
    return new Date()
  })

  const today = new Date()
  const maxDate = max ? new Date(max) : today

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return `${date.getDate()}. ${MONTHS_NO[date.getMonth()]} ${date.getFullYear()}`
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay()
    return day === 0 ? 6 : day - 1 // Convert to Monday = 0
  }

  const handleDateClick = (day: number) => {
    const selected = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
    if (selected <= maxDate) {
      const dateStr = selected.toISOString().split('T')[0]
      onChange(dateStr)
      setIsOpen(false)
    }
  }

  const navigateMonth = (delta: number) => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1))
  }

  const renderCalendar = () => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)
    const days = []

    // Empty cells before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-9 h-9" />)
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isSelected = value === date.toISOString().split('T')[0]
      const isToday = date.toDateString() === today.toDateString()
      const isDisabled = date > maxDate

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => handleDateClick(day)}
          className={`w-9 h-9 rounded-full text-sm font-medium transition-all
            ${isSelected 
              ? 'bg-primary-600 text-white' 
              : isToday 
                ? 'bg-primary-100 text-primary-700'
                : isDisabled
                  ? 'text-mountain-300 cursor-not-allowed'
                  : 'hover:bg-mountain-100 text-mountain-700'
            }`}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-left flex items-center justify-between bg-white"
      >
        <span className={value ? 'text-mountain-900' : 'text-mountain-400'}>
          {value ? formatDisplayDate(value) : 'Vel dato...'}
        </span>
        <Calendar className="w-5 h-5 text-mountain-400" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-mountain-200 p-4 z-50 w-72">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-mountain-100 rounded-full"
              >
                <ChevronLeft className="w-5 h-5 text-mountain-600" />
              </button>
              <span className="font-semibold text-mountain-800">
                {MONTHS_NO[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                disabled={viewDate.getMonth() === maxDate.getMonth() && viewDate.getFullYear() === maxDate.getFullYear()}
                className="p-1 hover:bg-mountain-100 rounded-full disabled:opacity-30"
              >
                <ChevronRight className="w-5 h-5 text-mountain-600" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS_NO.map(day => (
                <div key={day} className="w-9 h-8 flex items-center justify-center text-xs font-medium text-mountain-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
        </>
      )}

      {/* Hidden input for form validation */}
      {required && !value && (
        <input type="text" required className="sr-only" tabIndex={-1} />
      )}
    </div>
  )
}


