import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Boardly</h1>
          <div className="flex gap-2">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Başla</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Projelerini Yönet, İlerlemeni Takip Et
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Freelance projelerinden işbirliği platformuna. Görevlerini, ödemelerini ve ekip çalışmanı tek yerden yönet.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3">
              Hemen Başla
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Dashboard
              </CardTitle>
              <CardDescription>
                Tüm projelerini tek bakışta gör
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gelir grafikleri, görev durumları ve proje ilerlemelerin için kapsamlı analitik dashboard.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💰 Finans Takibi
              </CardTitle>
              <CardDescription>
                Ödemelerini ve kazançlarını takip et
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Alınan/alınacak ödemeler, fatura yönetimi ve gelir-gider analizi.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                👥 İşbirliği
              </CardTitle>
              <CardDescription>
                Ekibinle gerçek zamanlı çalış
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Proje paylaşımı, anlık chat ve granular yetki yönetimi ile takım çalışması.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground">Açık Kaynak</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">⚡</div>
              <div className="text-sm text-muted-foreground">Hızlı Setup</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">🔒</div>
              <div className="text-sm text-muted-foreground">Güvenli</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">📱</div>
              <div className="text-sm text-muted-foreground">Responsive</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>© 2024 Boardly. Kişisel proje yönetimi platformu.</p>
        </div>
      </footer>
    </div>
  )
}
