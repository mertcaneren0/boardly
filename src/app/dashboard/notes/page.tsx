'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NotesList } from '@/components/notes'
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote, usePinNote, useArchiveNote } from '@/hooks/notes/use-notes'
import { CreateNoteData, UpdateNoteData } from '@/types'
import {
  StickyNote,
  Plus,
  Search,
  Filter,
  Pin,
  Archive,
  Loader2,
  AlertCircle,
  FileText,
  Star,
} from 'lucide-react'

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [showPinned, setShowPinned] = useState(false)
  const [showArchived, setShowArchived] = useState(false)

  // Notes hooks
  const { data: notes = [], isLoading, error } = useNotes()
  const createNoteMutation = useCreateNote()
  const updateNoteMutation = useUpdateNote()
  const deleteNoteMutation = useDeleteNote()
  const pinNoteMutation = usePinNote()
  const archiveNoteMutation = useArchiveNote()

  const handleCreateNote = async (data: CreateNoteData) => {
    await createNoteMutation.mutateAsync(data)
  }

  const handleUpdateNote = async (data: UpdateNoteData) => {
    await updateNoteMutation.mutateAsync(data)
  }

  const handleDeleteNote = async (noteId: string) => {
    await deleteNoteMutation.mutateAsync(noteId)
  }

  const handlePinNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      await pinNoteMutation.mutateAsync({ id: noteId, isPinned: !note.isPinned })
    }
  }

  const handleArchiveNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (note) {
      await archiveNoteMutation.mutateAsync({ id: noteId, isArchived: !note.isArchived })
    }
  }

  // Filter notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || note.category === categoryFilter
    const matchesPinned = !showPinned || note.isPinned
    const matchesArchived = showArchived ? note.isArchived : !note.isArchived
    
    return matchesSearch && matchesCategory && matchesPinned && matchesArchived
  })

  const clearFilters = () => {
    setSearchTerm('')
    setCategoryFilter('')
    setShowPinned(false)
    setShowArchived(false)
  }

  const pinnedNotes = filteredNotes.filter(note => note.isPinned && !note.isArchived)
  const regularNotes = filteredNotes.filter(note => !note.isPinned && !note.isArchived)
  const archivedNotes = filteredNotes.filter(note => note.isArchived)

  if (isLoading) {
    return (
      <DashboardLayout title="Notlar" subtitle="Notlarınızı organize edin ve yönetin">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout title="Notlar" subtitle="Hata oluştu">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Notlar yüklenirken hata oluştu</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Yeniden Dene
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Notlar" subtitle="Notlarınızı organize edin ve yönetin">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Notlarda ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Kategoriler</SelectItem>
                <SelectItem value="GENERAL">Genel</SelectItem>
                <SelectItem value="PROJECT">Proje</SelectItem>
                <SelectItem value="MEETING">Toplantı</SelectItem>
                <SelectItem value="IDEA">Fikir</SelectItem>
                <SelectItem value="TODO">Yapılacak</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showPinned ? "default" : "outline"}
              onClick={() => setShowPinned(!showPinned)}
            >
              <Pin className="h-4 w-4 mr-2" />
              Sabitlenmiş
            </Button>

            <Button
              variant={showArchived ? "default" : "outline"}
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Arşivlenmiş
            </Button>

            {(searchTerm || categoryFilter || showPinned) && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Filtreleri Temizle
              </Button>
            )}
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Not
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Not</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{notes.length}</div>
            </CardContent>
          </Card>
          
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sabitlenmiş</CardTitle>
              <Pin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pinnedNotes.length}</div>
            </CardContent>
          </Card>
          
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bu Hafta</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {notes.filter(note => {
                  const weekAgo = new Date()
                  weekAgo.setDate(weekAgo.getDate() - 7)
                  return new Date(note.createdAt) > weekAgo
                }).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-neon">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Arşivlenmiş</CardTitle>
              <Archive className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{archivedNotes.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Content */}
        <div className="space-y-6">
          {/* Pinned Notes */}
          {!showArchived && pinnedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Pin className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Sabitlenmiş Notlar</h2>
                <Badge variant="secondary">{pinnedNotes.length}</Badge>
              </div>
              <NotesList
                notes={pinnedNotes}
                onCreateNote={handleCreateNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onPinNote={handlePinNote}
                onArchiveNote={handleArchiveNote}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Regular Notes */}
          {!showArchived && regularNotes.length > 0 && (
            <div>
              {pinnedNotes.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <StickyNote className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Diğer Notlar</h2>
                  <Badge variant="secondary">{regularNotes.length}</Badge>
                </div>
              )}
              <NotesList
                notes={regularNotes}
                onCreateNote={handleCreateNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onPinNote={handlePinNote}
                onArchiveNote={handleArchiveNote}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Archived Notes */}
          {showArchived && archivedNotes.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Archive className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Arşivlenmiş Notlar</h2>
                <Badge variant="secondary">{archivedNotes.length}</Badge>
              </div>
              <NotesList
                notes={archivedNotes}
                onCreateNote={handleCreateNote}
                onUpdateNote={handleUpdateNote}
                onDeleteNote={handleDeleteNote}
                onPinNote={handlePinNote}
                onArchiveNote={handleArchiveNote}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <Card className="card-neon">
              <CardContent className="p-12 text-center">
                <StickyNote className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Not bulunamadı</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || categoryFilter || showPinned || showArchived
                    ? 'Arama kriterlerinize uygun not bulunamadı.'
                    : 'Henüz hiç not oluşturulmamış.'}
                </p>
                {(searchTerm || categoryFilter || showPinned) ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Filtreleri Temizle
                  </Button>
                ) : (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Notunuzu Oluşturun
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
} 