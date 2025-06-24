'use client'

import { useState, useMemo } from 'react'
import { NoteCard } from './note-card'
import { NoteFormDialog } from './note-form-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Note, CreateNoteData, UpdateNoteData } from '@/types'
import { 
  Plus, 
  Search, 
  Filter,
  StickyNote,
  Archive,
  Pin
} from 'lucide-react'

interface NotesListProps {
  notes: (Note & { 
    author: { name: string | null; image: string | null }
    project?: { name: string; slug: string } | null
  })[]
  projectId?: string
  workspaceId?: string
  title?: string
  showCreateButton?: boolean
  onCreateNote?: (data: CreateNoteData) => Promise<void>
  onUpdateNote?: (data: UpdateNoteData) => Promise<void>
  onDeleteNote?: (noteId: string) => Promise<void>
  onPinNote?: (noteId: string) => Promise<void>
  onArchiveNote?: (noteId: string) => Promise<void>
  isLoading?: boolean
}

const categoryOptions = [
  { value: 'all', label: 'Tüm Kategoriler' },
  { value: 'GENERAL', label: 'Genel' },
  { value: 'MEETING', label: 'Toplantı' },
  { value: 'IDEA', label: 'Fikir' },
  { value: 'TODO', label: 'Yapılacak' },
  { value: 'RESEARCH', label: 'Araştırma' },
  { value: 'CLIENT', label: 'Müşteri' },
  { value: 'TECHNICAL', label: 'Teknik' },
  { value: 'FINANCIAL', label: 'Finansal' },
]

const priorityOptions = [
  { value: 'all', label: 'Tüm Öncelikler' },
  { value: 'LOW', label: 'Düşük' },
  { value: 'MEDIUM', label: 'Orta' },
  { value: 'HIGH', label: 'Yüksek' },
  { value: 'URGENT', label: 'Acil' },
]

export function NotesList({
  notes,
  projectId,
  workspaceId,
  title = 'Notlar',
  showCreateButton = true,
  onCreateNote,
  onUpdateNote,
  onDeleteNote,
  onPinNote,
  onArchiveNote,
  isLoading = false,
}: NotesListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [showArchived, setShowArchived] = useState(false)
  const [showPinnedOnly, setShowPinnedOnly] = useState(false)

  const filteredNotes = useMemo(() => {
    let filtered = notes.filter(note => {
      // Search in title, content, and tags
      const searchLower = searchQuery.toLowerCase()
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchLower))

      // Category filter
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory

      // Priority filter
      const matchesPriority = selectedPriority === 'all' || note.priority === selectedPriority

      // Archive filter
      const matchesArchive = showArchived ? note.isArchived : !note.isArchived

      // Pinned filter
      const matchesPinned = showPinnedOnly ? note.isPinned : true

      return matchesSearch && matchesCategory && matchesPriority && matchesArchive && matchesPinned
    })

    // Sort: pinned first, then by creation date (newest first)
    return filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [notes, searchQuery, selectedCategory, selectedPriority, showArchived, showPinnedOnly])

  const pinnedNotes = filteredNotes.filter(note => note.isPinned)
  const unpinnedNotes = filteredNotes.filter(note => !note.isPinned)

  const handleEditNote = (note: Note) => {
    if (onUpdateNote) {
      // This will be handled by parent component's state management
      console.log('Edit note:', note.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StickyNote className="h-5 w-5" />
          <h2 className="text-lg font-semibold">{title}</h2>
          <Badge variant="secondary" className="text-xs">
            {filteredNotes.length}
          </Badge>
        </div>

                 {showCreateButton && onCreateNote && (
           <NoteFormDialog
             projectId={projectId}
             workspaceId={workspaceId}
             onSubmit={onCreateNote as (data: CreateNoteData | UpdateNoteData) => Promise<void>}
             trigger={
               <Button size="sm">
                 <Plus className="h-4 w-4 mr-2" />
                 Yeni Not
               </Button>
             }
           />
         )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Notlarda ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedPriority} onValueChange={setSelectedPriority}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {priorityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={showPinnedOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPinnedOnly(!showPinnedOnly)}
          >
            <Pin className="h-4 w-4 mr-1" />
            Sabitlenmiş
          </Button>

          <Button
            variant={showArchived ? "default" : "outline"}
            size="sm"
            onClick={() => setShowArchived(!showArchived)}
          >
            <Archive className="h-4 w-4 mr-1" />
            {showArchived ? 'Aktif' : 'Arşiv'}
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {/* Notes Grid */}
      {!isLoading && (
        <div className="space-y-6">
          {/* Pinned Notes */}
          {pinnedNotes.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Pin className="h-4 w-4" />
                Sabitlenmiş Notlar
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={onDeleteNote}
                    onPin={onPinNote}
                    onArchive={onArchiveNote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Notes */}
          {unpinnedNotes.length > 0 && (
            <div className="space-y-4">
              {pinnedNotes.length > 0 && (
                <h3 className="text-sm font-medium text-muted-foreground">
                  Diğer Notlar
                </h3>
              )}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {unpinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={handleEditNote}
                    onDelete={onDeleteNote}
                    onPin={onPinNote}
                    onArchive={onArchiveNote}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all' 
                  ? 'Filtreye uygun not bulunamadı' 
                  : 'Henüz not yok'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== 'all' || selectedPriority !== 'all'
                  ? 'Farklı filtreler deneyebilir veya yeni not ekleyebilirsiniz.'
                  : 'İlk notunuzu oluşturun ve fikirlerinizi kaydetmeye başlayın.'}
              </p>
                             {showCreateButton && onCreateNote && (
                 <NoteFormDialog
                   projectId={projectId}
                   workspaceId={workspaceId}
                   onSubmit={onCreateNote as (data: CreateNoteData | UpdateNoteData) => Promise<void>}
                   trigger={
                     <Button>
                       <Plus className="h-4 w-4 mr-2" />
                       İlk Notunu Oluştur
                     </Button>
                   }
                 />
               )}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 