'use client'

import * as React from "react"
import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TagInputProps {
    value: string[]
    onChange: (tags: string[]) => void
    suggestions?: string[]
    placeholder?: string
    maxTags?: number
    className?: string
}

export function TagInput({
    value = [],
    onChange,
    suggestions = [],
    placeholder = "Digite para buscar ou adicionar...",
    maxTags = 5,
    className
}: TagInputProps) {
    const [inputValue, setInputValue] = React.useState("")
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = React.useState(false)
    const [selectedIndex, setSelectedIndex] = React.useState(-1)
    const inputRef = React.useRef<HTMLInputElement>(null)

    React.useEffect(() => {
        if (inputValue.trim()) {
            const filtered = suggestions.filter(
                (suggestion) =>
                    suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
                    !value.includes(suggestion)
            )
            setFilteredSuggestions(filtered)
            setShowSuggestions(filtered.length > 0)
        } else {
            setFilteredSuggestions([])
            setShowSuggestions(false)
        }
        setSelectedIndex(-1)
    }, [inputValue, suggestions, value])

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim()
        if (trimmedTag && !value.includes(trimmedTag) && value.length < maxTags) {
            onChange([...value, trimmedTag])
            setInputValue("")
            setShowSuggestions(false)
        }
    }

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((tag) => tag !== tagToRemove))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (selectedIndex >= 0 && filteredSuggestions[selectedIndex]) {
                addTag(filteredSuggestions[selectedIndex])
            } else if (inputValue.trim()) {
                addTag(inputValue)
            }
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value[value.length - 1])
        } else if (e.key === "ArrowDown") {
            e.preventDefault()
            setSelectedIndex((prev) =>
                prev < filteredSuggestions.length - 1 ? prev + 1 : prev
            )
        } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        } else if (e.key === "Escape") {
            setShowSuggestions(false)
        }
    }

    return (
        <div className={cn("relative w-full space-y-4", className)}>
            {/* Tags Display */}
            <div className="flex flex-wrap gap-2.5 min-h-[40px] items-center">
                {value.length === 0 && !inputValue && (
                    <span className="text-sm font-medium text-gray-400 italic">Nenhuma habilidade selecionada</span>
                )}
                {value.map((tag) => (
                    <Badge
                        key={tag}
                        variant="secondary"
                        className="pl-3 pr-1.5 py-1.5 text-xs font-bold bg-white text-primary border-2 border-primary/10 hover:border-primary/30 transition-all rounded-xl shadow-sm group"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-2 rounded-lg p-1 hover:bg-red-50 hover:text-red-500 transition-colors opacity-60 group-hover:opacity-100"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>

            {/* Input and Counter Container */}
            <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                        Habilidades
                    </span>
                    <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest transition-colors",
                        value.length >= maxTags ? "text-red-500" : "text-primary/60"
                    )}>
                        {value.length} / {maxTags}
                    </span>
                </div>

                {value.length < maxTags && (
                    <div className="relative group/input">
                        <Input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onFocus={() => inputValue && setShowSuggestions(filteredSuggestions.length > 0)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder={placeholder}
                            className="h-14 bg-white border-2 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all rounded-2xl font-medium px-6 text-sm shadow-none placeholder:text-gray-300"
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-50 rounded-2xl shadow-2xl max-h-60 overflow-y-auto p-2 scrollbar-none animate-in fade-in slide-in-from-top-2 duration-200">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            addTag(suggestion)
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all mb-1 last:mb-0",
                                            index === selectedIndex
                                                ? "bg-primary text-white"
                                                : "text-gray-600 hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Max Tags Warning */}
            {value.length >= maxTags && (
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-300">
                    <div className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                    <p className="text-xs font-bold text-orange-700">
                        Você atingiu o limite de {maxTags} habilidades. Para adicionar outra, remova uma das atuais.
                    </p>
                </div>
            )}
        </div>
    )
}
