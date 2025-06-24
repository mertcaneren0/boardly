'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateNoteData, UpdateNoteData, Note } from '@/types'

interface NoteWithRelations extends Note {
  author: { name: string | null; image: string | null }
  project?: { name: string; slug: string } | null
}

interface NotesFilter {
  projectId?: string
  workspaceId?: string
  category?: string
  priority?: string
  archived?: boolean
  pinned?: boolean
  search?: string
}

// Fetch notes
export function useNotes(filters: NotesFilter = {}) {
  const queryKey = ['notes', filters]
  
  return useQuery({
    queryKey,
    queryFn: async (): Promise<NoteWithRelations[]> => {
      const searchParams = new URLSearchParams()
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
      
      const response = await fetch(`/api/notes?${searchParams}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      
      const data = await response.json()
      return data.notes
    },
  })
}

// Fetch single note
export function useNote(id: string) {
  return useQuery({
    queryKey: ['notes', id],
    queryFn: async (): Promise<NoteWithRelations> => {
      const response = await fetch(`/api/notes/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch note')
      }
      
      const data = await response.json()
      return data.note
    },
    enabled: !!id,
  })
}

// Create note mutation
export function useCreateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateNoteData): Promise<NoteWithRelations> => {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create note')
      }
      
      const result = await response.json()
      return result.note
    },
    onSuccess: (newNote) => {
      // Invalidate all notes queries to refetch
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      
      // Optionally add the new note to existing cache
      queryClient.setQueryData(['notes', newNote.id], newNote)
    },
  })
}

// Update note mutation
export function useUpdateNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateNoteData): Promise<NoteWithRelations> => {
      const { id, ...updateData } = data
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update note')
      }
      
      const result = await response.json()
      return result.note
    },
    onSuccess: (updatedNote) => {
      // Invalidate all notes queries
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      
      // Update specific note cache
      queryClient.setQueryData(['notes', updatedNote.id], updatedNote)
    },
  })
}

// Delete note mutation
export function useDeleteNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete note')
      }
    },
    onSuccess: (_, deletedId) => {
      // Invalidate all notes queries
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      
      // Remove specific note from cache
      queryClient.removeQueries({ queryKey: ['notes', deletedId] })
    },
  })
}

// Pin/Unpin note
export function usePinNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, isPinned }: { id: string; isPinned: boolean }): Promise<NoteWithRelations> => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPinned }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update note')
      }
      
      const result = await response.json()
      return result.note
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.setQueryData(['notes', updatedNote.id], updatedNote)
    },
  })
}

// Archive/Unarchive note
export function useArchiveNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string; isArchived: boolean }): Promise<NoteWithRelations> => {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isArchived }),
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update note')
      }
      
      const result = await response.json()
      return result.note
    },
    onSuccess: (updatedNote) => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      queryClient.setQueryData(['notes', updatedNote.id], updatedNote)
    },
  })
} 