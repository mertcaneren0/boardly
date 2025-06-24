'use client'

import { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Note } from '@/types'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { 
  Edit, 
  Trash2, 
  Pin, 
  Archive, 
  Clock,
  Tag,
  MoreVertical,
  Lightbulb,
  Users,
  Calendar,
  ListTodo,
  Search,
  DollarSign,
  Code,
  MessageSquare
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface NoteCardProps {
  note: Note & { 
    author: { name: string | null; image: string | null }
    project?: { name: string; slug: string } | null
  }
  onEdit?: (note: Note) => void
  onDelete?: (noteId: string) => void
  onPin?: (noteId: string) => void
  onArchive?: (noteId: string) => void
}

const categoryIcons = {
  GENERAL: MessageSquare,
  MEETING: Users,
  IDEA: Lightbulb,
  TODO: ListTodo,
  RESEARCH: Search,
  CLIENT: Users,
  TECHNICAL: Code,
  FINANCIAL: DollarSign,
}

const categoryColors = {
  GENERAL: 'bg-gray-100 text-gray-800',
  MEETING: 'bg-blue-100 text-blue-800',
  IDEA: 'bg-yellow-100 text-yellow-800',
  TODO: 'bg-green-100 text-green-800',
  RESEARCH: 'bg-purple-100 text-purple-800',
  CLIENT: 'bg-pink-100 text-pink-800',
  TECHNICAL: 'bg-indigo-100 text-indigo-800',
  FINANCIAL: 'bg-emerald-100 text-emerald-800',
}

const priorityColors = {
  LOW: 'border-l-gray-300',
  MEDIUM: 'border-l-blue-400',
  HIGH: 'border-l-orange-400',
  URGENT: 'border-l-red-500',
}

export function NoteCard({ note, onEdit, onDelete, onPin, onArchive }: NoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const CategoryIcon = categoryIcons[note.category]
  const truncatedContent = note.content.length > 150 
    ? note.content.substring(0, 150) + '...' 
    : note.content

  return (
    <Card className={`relative border-l-4 ${priorityColors[note.priority]} hover:shadow-md transition-shadow`}>
      {note.isPinned && (
        <Pin className="absolute top-2 right-2 h-4 w-4 text-amber-500 fill-current" />
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1">
            <CategoryIcon className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-semibold text-sm line-clamp-1">{note.title}</h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(note)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Düzenle
                </DropdownMenuItem>
              )}
              {onPin && (
                <DropdownMenuItem onClick={() => onPin(note.id)}>
                  <Pin className="mr-2 h-4 w-4" />
                  {note.isPinned ? 'Sabitlemeyi Kaldır' : 'Sabitle'}
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={() => onArchive(note.id)}>
                  <Archive className="mr-2 h-4 w-4" />
                  {note.isArchived ? 'Arşivden Çıkar' : 'Arşivle'}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete(note.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Sil
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={`text-xs ${categoryColors[note.category]}`}>
            {note.category}
          </Badge>
          {note.project && (
            <Badge variant="outline" className="text-xs">
              {note.project.name}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="py-0">
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {isExpanded ? note.content : truncatedContent}
          </p>
          
          {note.content.length > 150 && (
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Daha az göster' : 'Devamını oku'}
            </Button>
          )}
          
          {note.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              <Tag className="h-3 w-3 text-muted-foreground" />
              {note.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 pb-4">
        <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {format(new Date(note.createdAt), 'dd MMM yyyy', { locale: tr })}
          </div>
          <span>{note.author.name}</span>
        </div>
      </CardFooter>
    </Card>
  )
} 