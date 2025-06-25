'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  CreditCard,
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Edit,
} from 'lucide-react'

// Mock data for payments
const mockPayments = [
  {
    id: '1',
    title: 'E-Ticaret Sitesi - İlk Ödeme',
    amount: 15000,
    currency: 'TRY',
    type: 'INCOMING',
    status: 'PAID',
    method: 'bank_transfer',
    invoiceDate: '2024-06-01',
    dueDate: '2024-06-15',
    paidDate: '2024-06-10',
    invoiceNumber: 'INV-2024-001',
    projectName: 'E-Ticaret Sitesi',
    clientName: 'ABC Şirketi',
  },
  {
    id: '2',
    title: 'Mobil Uygulama - Ara Ödeme',
    amount: 12000,
    currency: 'TRY',
    type: 'INCOMING',
    status: 'PENDING',
    method: 'credit_card',
    invoiceDate: '2024-06-15',
    dueDate: '2024-06-30',
    paidDate: null,
    invoiceNumber: 'INV-2024-002',
    projectName: 'Mobil Uygulama',
    clientName: 'XYZ Tech',
  },
  {
    id: '3',
    title: 'Hosting Maliyeti',
    amount: 500,
    currency: 'TRY',
    type: 'OUTGOING',
    status: 'PAID',
    method: 'credit_card',
    invoiceDate: '2024-06-01',
    dueDate: '2024-06-01',
    paidDate: '2024-06-01',
    invoiceNumber: 'EXP-2024-001',
    projectName: 'Genel Giderler',
    clientName: 'Hosting Şirketi',
  },
  {
    id: '4',
    title: 'Kurumsal Website - Final Ödeme',
    amount: 8000,
    currency: 'TRY',
    type: 'INCOMING',
    status: 'OVERDUE',
    method: 'bank_transfer',
    invoiceDate: '2024-05-15',
    dueDate: '2024-05-30',
    paidDate: null,
    invoiceNumber: 'INV-2024-003',
    projectName: 'Kurumsal Website',
    clientName: 'DEF Holding',
  },
  {
    id: '5',
    title: 'Yazılım Lisansı',
    amount: 2000,
    currency: 'TRY',
    type: 'OUTGOING',
    status: 'PENDING',
    method: 'credit_card',
    invoiceDate: '2024-06-20',
    dueDate: '2024-07-01',
    paidDate: null,
    invoiceNumber: 'EXP-2024-002',
    projectName: 'Genel Giderler',
    clientName: 'Yazılım Şirketi',
  },
]

const statusColors = {
  PAID: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

const statusLabels = {
  PAID: 'Ödendi',
  PENDING: 'Bekliyor',
  OVERDUE: 'Gecikmiş',
  CANCELLED: 'İptal',
}

const typeColors = {
  INCOMING: 'text-green-600',
  OUTGOING: 'text-red-600',
}

const typeLabels = {
  INCOMING: 'Gelen',
  OUTGOING: 'Giden',
}

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [activeTab, setActiveTab] = useState('all')

  // Filter payments
  const filteredPayments = mockPayments.filter(payment => {
    const matchesSearch = payment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.projectName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || payment.status === statusFilter
    const matchesType = !typeFilter || payment.type === typeFilter
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'incoming' && payment.type === 'INCOMING') ||
                      (activeTab === 'outgoing' && payment.type === 'OUTGOING')
    
    return matchesSearch && matchesStatus && matchesType && matchesTab
  })

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('')
    setTypeFilter('')
  }

  // Calculate stats
  const totalIncoming = mockPayments
    .filter(p => p.type === 'INCOMING' && p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const totalOutgoing = mockPayments
    .filter(p => p.type === 'OUTGOING' && p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingAmount = mockPayments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const overdueAmount = mockPayments
    .filter(p => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <DashboardLayout title="Ödemeler" subtitle="Gelir ve giderlerinizi takip edin">
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gelir</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₺{totalIncoming.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Bu ay ödenen faturalar
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Gider</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ₺{totalOutgoing.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Bu ay ödenen giderler
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                ₺{pendingAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Ödeme bekleyen faturalar
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gecikmiş</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ₺{overdueAmount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Vadesi geçmiş faturalar
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Ödemelerde ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Durum" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Durumlar</SelectItem>
                <SelectItem value="PAID">Ödendi</SelectItem>
                <SelectItem value="PENDING">Bekliyor</SelectItem>
                <SelectItem value="OVERDUE">Gecikmiş</SelectItem>
                <SelectItem value="CANCELLED">İptal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Tür" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm Türler</SelectItem>
                <SelectItem value="INCOMING">Gelen</SelectItem>
                <SelectItem value="OUTGOING">Giden</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || statusFilter || typeFilter) && (
              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Filtreleri Temizle
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Dışa Aktar
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Yeni Ödeme
            </Button>
          </div>
        </div>

        {/* Payments Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">Tümü ({mockPayments.length})</TabsTrigger>
            <TabsTrigger value="incoming">
              Gelen ({mockPayments.filter(p => p.type === 'INCOMING').length})
            </TabsTrigger>
            <TabsTrigger value="outgoing">
              Giden ({mockPayments.filter(p => p.type === 'OUTGOING').length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredPayments.length > 0 ? (
              <div className="grid gap-4">
                {filteredPayments.map((payment) => (
                  <Card key={payment.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div className={`w-3 h-3 rounded-full ${
                              payment.status === 'PAID' ? 'bg-green-500' :
                              payment.status === 'PENDING' ? 'bg-yellow-500' :
                              payment.status === 'OVERDUE' ? 'bg-red-500' :
                              'bg-gray-500'
                            }`} />
                            <h3 className="text-lg font-semibold">{payment.title}</h3>
                            <Badge
                              variant="secondary"
                              className={statusColors[payment.status as keyof typeof statusColors]}
                            >
                              {statusLabels[payment.status as keyof typeof statusLabels]}
                            </Badge>
                            <span className={`text-sm font-medium ${typeColors[payment.type as keyof typeof typeColors]}`}>
                              {typeLabels[payment.type as keyof typeof typeLabels]}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-6 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>{payment.projectName}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Vade: {new Date(payment.dueDate).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Fatura: {payment.invoiceNumber}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Müşteri: {payment.clientName}</p>
                              {payment.paidDate && (
                                <p className="text-sm text-green-600">
                                  Ödendi: {new Date(payment.paidDate).toLocaleDateString('tr-TR')}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className={`text-2xl font-bold ${
                                payment.type === 'INCOMING' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {payment.type === 'INCOMING' ? '+' : '-'}₺{payment.amount.toLocaleString()}
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {payment.method === 'bank_transfer' ? 'Banka Havalesi' : 
                                 payment.method === 'credit_card' ? 'Kredi Kartı' : 
                                 payment.method}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            Görüntüle
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Düzenle
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            İndir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">Ödeme bulunamadı</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter || typeFilter
                      ? 'Arama kriterlerinize uygun ödeme bulunamadı.'
                      : 'Henüz hiç ödeme kaydı bulunmuyor.'}
                  </p>
                  {(searchTerm || statusFilter || typeFilter) ? (
                    <Button variant="outline" onClick={clearFilters}>
                      Filtreleri Temizle
                    </Button>
                  ) : (
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      İlk Ödemenizi Kaydedin
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 