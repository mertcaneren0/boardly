'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Users,
  Globe,
  Palette,
  Database,
  Key,
  Save,
  Upload,
  Download,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    marketing: true,
  })

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: value
    }))
  }

  return (
    <DashboardLayout title="Ayarlar" subtitle="Hesap ve uygulama ayarlarınızı yönetin">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="notifications">Bildirimler</TabsTrigger>
            <TabsTrigger value="security">Güvenlik</TabsTrigger>
            <TabsTrigger value="billing">Faturalama</TabsTrigger>
            <TabsTrigger value="team">Ekip</TabsTrigger>
            <TabsTrigger value="general">Genel</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>
                  Kişisel bilgilerinizi ve profil ayarlarınızı güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-xl">D</span>
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Fotoğraf Yükle
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Kaldır
                    </Button>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Ad</Label>
                    <Input id="firstName" defaultValue="Demo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Soyad</Label>
                    <Input id="lastName" defaultValue="User" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" type="email" defaultValue="demo@boardly.app" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" type="tel" defaultValue="+90 532 123 4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Şirket</Label>
                    <Input id="company" defaultValue="Boardly Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Pozisyon</Label>
                    <Input id="position" defaultValue="Freelancer" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biyografi</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
                    defaultValue="Deneyimli freelance developer ve proje yöneticisi. Web ve mobil uygulama geliştirme konularında uzmanım."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Konum</Label>
                  <Input id="location" defaultValue="İstanbul, Türkiye" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" type="url" placeholder="https://yourwebsite.com" />
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Değişiklikleri Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Bildirim Ayarları</CardTitle>
                <CardDescription>
                  Hangi bildirimleri almak istediğinizi seçin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">E-posta Bildirimleri</h4>
                      <p className="text-sm text-muted-foreground">
                        Proje güncellemeleri ve önemli duyurular
                      </p>
                    </div>
                    <Button
                      variant={notifications.email ? "default" : "outline"}
                      onClick={() => handleNotificationChange('email', !notifications.email)}
                    >
                      {notifications.email ? 'Açık' : 'Kapalı'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Bildirimleri</h4>
                      <p className="text-sm text-muted-foreground">
                        Tarayıcı bildirimleri
                      </p>
                    </div>
                    <Button
                      variant={notifications.push ? "default" : "outline"}
                      onClick={() => handleNotificationChange('push', !notifications.push)}
                    >
                      {notifications.push ? 'Açık' : 'Kapalı'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS Bildirimleri</h4>
                      <p className="text-sm text-muted-foreground">
                        Acil durumlar için SMS
                      </p>
                    </div>
                    <Button
                      variant={notifications.sms ? "default" : "outline"}
                      onClick={() => handleNotificationChange('sms', !notifications.sms)}
                    >
                      {notifications.sms ? 'Açık' : 'Kapalı'}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Pazarlama E-postaları</h4>
                      <p className="text-sm text-muted-foreground">
                        Yeni özellikler ve promosyonlar
                      </p>
                    </div>
                    <Button
                      variant={notifications.marketing ? "default" : "outline"}
                      onClick={() => handleNotificationChange('marketing', !notifications.marketing)}
                    >
                      {notifications.marketing ? 'Açık' : 'Kapalı'}
                    </Button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Bildirim Zamanlaması</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">Sessiz Mod Başlangıcı</Label>
                      <Input id="quietStart" type="time" defaultValue="22:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">Sessiz Mod Bitişi</Label>
                      <Input id="quietEnd" type="time" defaultValue="08:00" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Ayarları Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Güvenlik Ayarları</CardTitle>
                <CardDescription>
                  Hesap güvenliğinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                    <div className="relative">
                      <Input 
                        id="currentPassword" 
                        type={showPassword ? "text" : "password"}
                        placeholder="Mevcut şifrenizi girin"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Yeni Şifre</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      placeholder="Yeni şifrenizi girin"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      placeholder="Yeni şifrenizi tekrar girin"
                    />
                  </div>

                  <Button>
                    <Key className="h-4 w-4 mr-2" />
                    Şifreyi Güncelle
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">İki Faktörlü Doğrulama</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">2FA Durumu</p>
                      <p className="text-sm text-muted-foreground">
                        Hesabınızın güvenliği için 2FA'yı etkinleştirin
                      </p>
                    </div>
                    <Badge variant="outline">Devre Dışı</Badge>
                  </div>
                  <Button className="mt-4" variant="outline">
                    <Shield className="h-4 w-4 mr-2" />
                    2FA'yı Etkinleştir
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Aktif Oturumlar</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">MacBook Air - Chrome</p>
                        <p className="text-sm text-muted-foreground">İstanbul, Türkiye • Şu an aktif</p>
                      </div>
                      <Badge variant="secondary">Mevcut</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">iPhone - Safari</p>
                        <p className="text-sm text-muted-foreground">İstanbul, Türkiye • 2 saat önce</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Sonlandır
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Faturalama Bilgileri</CardTitle>
                <CardDescription>
                  Ödeme yönteminizi ve fatura bilgilerinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Mevcut Plan</p>
                    <p className="text-sm text-muted-foreground">Freelancer Pro</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₺299/ay</p>
                    <Badge>Aktif</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Ödeme Yöntemi</h4>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-6 w-6" />
                      <div>
                        <p className="font-medium">•••• •••• •••• 1234</p>
                        <p className="text-sm text-muted-foreground">Visa • 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Düzenle
                    </Button>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Yeni Kart Ekle
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Fatura Adresi</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="billingName">Ad Soyad</Label>
                      <Input id="billingName" defaultValue="Demo User" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCompany">Şirket</Label>
                      <Input id="billingCompany" defaultValue="Boardly Inc." />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="billingAddress">Adres</Label>
                      <Input id="billingAddress" defaultValue="Maslak Mahallesi, Büyükdere Caddesi No:123" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingCity">Şehir</Label>
                      <Input id="billingCity" defaultValue="İstanbul" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="billingZip">Posta Kodu</Label>
                      <Input id="billingZip" defaultValue="34485" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Son Faturalar</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Haziran 2024</p>
                        <p className="text-sm text-muted-foreground">01 Haz 2024 - 30 Haz 2024</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">₺299</span>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          İndir
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ekip Yönetimi</CardTitle>
                <CardDescription>
                  Ekip üyelerini yönetin ve izinleri düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ekip Üyeleri</h4>
                    <p className="text-sm text-muted-foreground">
                      Mevcut plan: 5 üyeye kadar
                    </p>
                  </div>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Üye Davet Et
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-primary-foreground font-medium">D</span>
                      </div>
                      <div>
                        <p className="font-medium">Demo User</p>
                        <p className="text-sm text-muted-foreground">demo@boardly.app</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge>Admin</Badge>
                      <Button variant="outline" size="sm">
                        Düzenle
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Bekleyen Davetler</h4>
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>Bekleyen davet bulunmuyor</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Genel Ayarlar</CardTitle>
                <CardDescription>
                  Uygulama tercihlerinizi ve genel ayarlarınızı yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Dil</Label>
                    <Select defaultValue="tr">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Saat Dilimi</Label>
                    <Select defaultValue="europe/istanbul">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="europe/istanbul">Europe/Istanbul</SelectItem>
                        <SelectItem value="europe/london">Europe/London</SelectItem>
                        <SelectItem value="america/new_york">America/New_York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Para Birimi</Label>
                    <Select defaultValue="try">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="try">TRY (₺)</SelectItem>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Açık</SelectItem>
                        <SelectItem value="dark">Koyu</SelectItem>
                        <SelectItem value="system">Sistem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4 text-red-600">Tehlikeli Bölge</h4>
                  <div className="space-y-4">
                    <div className="p-4 border border-red-200 rounded-lg">
                      <h5 className="font-medium text-red-600 mb-2">Hesabı Sil</h5>
                      <p className="text-sm text-muted-foreground mb-4">
                        Hesabınızı kalıcı olarak silmek istiyorsanız, tüm verileriniz silinecektir ve bu işlem geri alınamaz.
                      </p>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hesabı Sil
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Ayarları Kaydet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
} 