'use client'

import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Input } from './input'

interface SearchSuggestion {
  label: string
  href?: string
}

interface SearchBarProps {
  onSearch?: (query: string) => void
  suggestions?: SearchSuggestion[]
  placeholder?: string
  className?: string
}

export function SearchBar({
  onSearch,
  suggestions = [],
  placeholder = 'Search products...',
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false)
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch?.(query.trim())
      setShowSuggestions(false)
    }
  }

  const filteredSuggestions = suggestions.filter((s) =>
    s.label.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <motion.form
        onSubmit={handleSubmit}
        animate={{
          width: isFocused ? 320 : 200,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="relative"
      >
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => {
            setIsFocused(true)
            if (query) setShowSuggestions(true)
          }}
          placeholder={placeholder}
          leftIcon={<Search className="h-4 w-4" />}
          rightIcon={
            query ? (
              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setShowSuggestions(false)
                  inputRef.current?.focus()
                }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            ) : undefined
          }
          className="rounded-xl border-zinc-200 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm"
        />
      </motion.form>

      <AnimatePresence>
        {showSuggestions && filteredSuggestions.length > 0 && isFocused && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-xl z-50 overflow-hidden"
          >
            {filteredSuggestions.map((suggestion, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(suggestion.label)
                  setShowSuggestions(false)
                  onSearch?.(suggestion.label)
                }}
                className="w-full px-4 py-2.5 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-3"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                {suggestion.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
