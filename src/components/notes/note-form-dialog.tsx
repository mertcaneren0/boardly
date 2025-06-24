'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreateNoteData, UpdateNoteData, Note } from '@/types'
import { Plus, X } from 'lucide-react'

const noteSchema = z.object({
  title: z.string().min(1, 'Başlık gereklidir'),
  content: z.string().min(1, 'İçerik gereklidir'),
  category: z.enum(['GENERAL', 'MEETING', 'IDEA', 'TODO', 'RESEARCH', 'CLIENT', 'TECHNICAL', 'FINANCIAL']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  tags: z.array(z.string()).optional(),
})

type NoteFormData = z.infer<typeof noteSchema>

interface NoteFormDialogProps {
  trigger?: React.ReactNode
  note?: Note
  projectId?: string
  workspaceId?: string
  onSubmit: (data: CreateNoteData | UpdateNoteData) => Promise<void>
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const categoryOptions = [
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
  { value: 'LOW', label: 'Düşük' },
  { value: 'MEDIUM', label: 'Orta' },
  { value: 'HIGH', label: 'Yüksek' },
  { value: 'URGENT', label: 'Acil' },
]

export function NoteFormDialog({ 
  trigger, 
  note, 
  projectId, 
  workspaceId, 
  onSubmit, 
  open, 
  onOpenChange 
}: NoteFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTag, setCurrentTag] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const form = useForm<NoteFormData>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      title: '',
      content: '',
      category: 'GENERAL',
      priority: 'MEDIUM',
      tags: [],
    },
  })

  const isEditing = !!note

  // Set form values when editing
  useEffect(() => {
    if (note) {
      form.reset({
        title: note.title,
        content: note.content,
        category: note.category,
        priority: note.priority,
        tags: note.tags,
      })
      setTags(note.tags)
    } else {
      form.reset({
        title: '',
        content: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        tags: [],
      })
      setTags([])
    }
  }, [note, form])

  // Handle controlled open state
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
    if (!newOpen) {
      form.reset()
      setTags([])
      setCurrentTag('')
    }
  }

  const addTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      const newTags = [...tags, currentTag]
      setTags(newTags)
      form.setValue('tags', newTags)
      setCurrentTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove)
    setTags(newTags)
    form.setValue('tags', newTags)
  }

  const handleSubmit = async (data: NoteFormData) => {
    setIsLoading(true)
    try {
      const submitData = {
        ...data,
        tags: tags,
        projectId,
        workspaceId,
        ...(isEditing && { id: note.id }),
      }
      
      await onSubmit(submitData)
      handleOpenChange(false)
    } catch (error) {
      console.error('Error submitting note:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Notu Düzenle' : 'Yeni Not'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Başlık</FormLabel>
                  <FormControl>
                    <Input placeholder="Not başlığı..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kategori seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Öncelik</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Öncelik seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>İçerik</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Not içeriği..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Etiketler</FormLabel>
              <div className="flex gap-2">
                <Input
                  placeholder="Etiket ekle..."
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 ml-1"
                        onClick={() => removeTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Kaydediliyor...' : (isEditing ? 'Güncelle' : 'Kaydet')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 