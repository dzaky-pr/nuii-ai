'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/lib/utils/debounce'
import { Check, ChevronsUpDown } from 'lucide-react'
import * as React from 'react'

export interface Option {
  value: string
  label: string
}

interface SearchableComboboxProps {
  options: Option[]
  value?: string | number
  onValueChange: (value: string | null, option?: Option) => void
  placeholder: string
  isLoading?: boolean
  isDisabled?: boolean
}

export default function SearchableCombobox({
  options,
  value,
  onValueChange,
  placeholder,
  isLoading,
  isDisabled
}: SearchableComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebounce(query)

  const filteredOptions = React.useMemo(() => {
    if (isLoading) return []
    return options.filter(option => {
      const label = option.label ?? ''
      return options.filter(option => {
        const label = option.label ?? ''
        return label.toLowerCase().includes(debouncedQuery.toLowerCase())
      })
    })
  }, [options, debouncedQuery, isLoading])

  const handleSelect = (selectedValue: string | null) => {
    if (selectedValue === value) {
      // Kalau klik lagi item yang sama, clear
      onValueChange(null, undefined)
      setOpen(false)
      return
    }

    const selectedOption = options.find(
      option => option.value === selectedValue
    )
    onValueChange(selectedValue, selectedOption)
    setOpen(false)
  }

  const selectedOption = options.find(o => o.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            isDisabled && 'cursor-not-allowed opacity-50'
          )}
          disabled={isDisabled || isLoading}
        >
          {selectedOption?.label ?? placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder={isLoading ? 'Loading...' : 'Cari...'}
            disabled={isDisabled || isLoading}
            className="h-9"
          />
          <CommandList>
            {isLoading ? (
              <div className="p-4 text-center text-muted">Loading...</div>
            ) : (
              <>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map(option => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={handleSelect}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
