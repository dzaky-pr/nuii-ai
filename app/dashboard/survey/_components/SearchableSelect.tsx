'use client'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useDebounce } from '@/lib/utils/debounce'
import { useMemo, useState } from 'react'

export interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value?: string
  onValueChange: (value: string, option?: Option) => void
  placeholder: string
  isLoading?: boolean
  isDisabled?: boolean
}

export default function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder,
  isLoading,
  isDisabled
}: SearchableSelectProps) {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query)

  const filteredOptions = useMemo(() => {
    if (isLoading) return []

    return options.filter(option =>
      option.label?.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
  }, [options, debouncedQuery, isLoading])

  const handleValueChange = (newValue: string) => {
    const selectedOption = options.find(option => option.value === newValue)
    onValueChange(newValue, selectedOption)
  }

  return (
    <Select
      value={value}
      onValueChange={handleValueChange}
      disabled={isLoading || isDisabled}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={isLoading ? 'Loading...' : 'Cari...'}
            className="mb-2"
            disabled={isLoading || isDisabled}
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1 text-muted">Tidak ada pilihan</div>
          )}
        </div>
      </SelectContent>
    </Select>
  )
}
