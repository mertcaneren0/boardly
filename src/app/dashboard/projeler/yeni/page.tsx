'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  Plus,
  X,
  Calendar,
  DollarSign,
  User,
  Users,
  Target,
  FileText,
  Save
} from 'lucide-react'

interface ProjectFormData {
  name: string
  description: string
  client: string
  clientEmail: string
  clientPhone: string
  status: 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED'
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  budget: string
  startDate: string
  deadline: string
  tags: string[]
}

const initialFormData: ProjectFormData = {
  name: '',
  description: '',
  client: '',
  clientEmail: '',
  clientPhone: '',
  status: 'ACTIVE',
  priority: 'MEDIUM',
  budget: '',
  startDate: '',
  deadline: '',
  tags: []
}

export default function NewProjectPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData)
  const [newTag, setNewTag] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({})

  const handleInputChange = (field: keyof ProjectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Proje adı gereklidir'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Proje açıklaması gereklidir'
    }

    if (!formData.client.trim()) {
      newErrors.client = 'Müşteri adı gereklidir'
    }

    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Müşteri e-posta adresi gereklidir'
    } else if (!/\S+@\S+\.\S+/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Geçerli bir e-posta adresi giriniz'
    }

    if (!formData.budget.trim()) {
      newErrors.budget = 'Bütçe gereklidir'
    } else if (isNaN(Number(formData.budget)) || Number(formData.budget) <= 0) {
      newErrors.budget = 'Geçerli bir bütçe giriniz'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Başlangıç tarihi gereklidir'
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Bitiş tarihi gereklidir'
    }

    if (formData.startDate && formData.deadline && new Date(formData.startDate) >= new Date(formData.deadline)) {
      newErrors.deadline = 'Bitiş tarihi başlangıç tarihinden sonra olmalıdır'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In real app, make API call here
      console.log('Project created:', formData)
      
      // Redirect to projects list
      router.push('/dashboard/projeler')
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout 
      title="Yeni Proje Oluştur"
      subtitle="Yeni bir proje ekleyin ve detaylarını belirleyin"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri Dön
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" type="button">
              Taslak Kaydet
            </Button>
            <Button 
              type="submit" 
              form="project-form"
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Oluşturuluyor...' : 'Proje Oluştur'}
            </Button>
          </div>
        </div>

        <form id="project-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Proje Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Projenin temel bilgilerini girin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Proje Adı *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Örn: E-Ticaret Sitesi"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Proje Açıklaması *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Projenin detaylı açıklaması..."
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-500">{errors.description}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status">Durum</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: any) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">Aktif</SelectItem>
                          <SelectItem value="ON_HOLD">Beklemede</SelectItem>
                          <SelectItem value="COMPLETED">Tamamlandı</SelectItem>
                          <SelectItem value="CANCELLED">İptal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Öncelik</Label>
                      <Select 
                        value={formData.priority} 
                        onValueChange={(value: any) => handleInputChange('priority', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HIGH">Yüksek</SelectItem>
                          <SelectItem value="MEDIUM">Orta</SelectItem>
                          <SelectItem value="LOW">Düşük</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Client Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Müşteri Bilgileri
                  </CardTitle>
                  <CardDescription>
                    Projeyi yürüttüğünüz müşteri bilgileri
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="client">Müşteri/Şirket Adı *</Label>
                    <Input
                      id="client"
                      value={formData.client}
                      onChange={(e) => handleInputChange('client', e.target.value)}
                      placeholder="Örn: TechCorp Ltd."
                      className={errors.client ? 'border-red-500' : ''}
                    />
                    {errors.client && (
                      <p className="text-sm text-red-500">{errors.client}</p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="clientEmail">E-posta Adresi *</Label>
                      <Input
                        id="clientEmail"
                        type="email"
                        value={formData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        placeholder="contact@techcorp.com"
                        className={errors.clientEmail ? 'border-red-500' : ''}
                      />
                      {errors.clientEmail && (
                        <p className="text-sm text-red-500">{errors.clientEmail}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="clientPhone">Telefon</Label>
                      <Input
                        id="clientPhone"
                        value={formData.clientPhone}
                        onChange={(e) => handleInputChange('clientPhone', e.target.value)}
                        placeholder="+90 555 123 4567"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {/* Budget & Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Bütçe & Zaman
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Bütçe (₺) *</Label>
                    <Input
                      id="budget"
                      type="number"
                      value={formData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      placeholder="25000"
                      className={errors.budget ? 'border-red-500' : ''}
                    />
                    {errors.budget && (
                      <p className="text-sm text-red-500">{errors.budget}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="startDate">Başlangıç Tarihi *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className={errors.startDate ? 'border-red-500' : ''}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500">{errors.startDate}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Bitiş Tarihi *</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleInputChange('deadline', e.target.value)}
                      className={errors.deadline ? 'border-red-500' : ''}
                    />
                    {errors.deadline && (
                      <p className="text-sm text-red-500">{errors.deadline}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Etiketler
                  </CardTitle>
                  <CardDescription>
                    Projeyi kategorize etmek için etiketler ekleyin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Yeni etiket..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addTag()
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={addTag}
                      disabled={!newTag.trim()}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="ml-1 hover:text-red-500"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Proje Özeti</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Müşteri:</span>
                    <span>{formData.client || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Bütçe:</span>
                    <span>₺{formData.budget ? Number(formData.budget).toLocaleString() : '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Süre:</span>
                    <span>
                      {formData.startDate && formData.deadline ? (
                        `${Math.ceil((new Date(formData.deadline).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))} gün`
                      ) : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Etiket Sayısı:</span>
                    <span>{formData.tags.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
} 