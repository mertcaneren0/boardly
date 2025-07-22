'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Wallet {
  id: string
  name: string
  currency: 'USD' | 'EUR' | 'TRY'
  balance: number
  color: string
}

interface Transaction {
  id: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  description: string
  category: string
  date: string
  currency: 'USD' | 'EUR' | 'TRY'
}

interface CashFlow {
  month: string
  income: number
  expense: number
}

export default function FinancePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cashFlow, setCashFlow] = useState<CashFlow[]>([])

  // Check if user is admin
  useEffect(() => {
    if (session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
    }
  }, [session, router])

  useEffect(() => {
    // Mock data - gerçek uygulamada API'den gelecek
    const mockWallets: Wallet[] = [
      { id: '1', name: 'Ana Hesap', currency: 'TRY', balance: 125000, color: 'bg-blue-500' },
      { id: '2', name: 'Dolar Hesabı', currency: 'USD', balance: 8500, color: 'bg-green-500' },
      { id: '3', name: 'Euro Hesabı', currency: 'EUR', balance: 3200, color: 'bg-purple-500' },
    ]

    const mockTransactions: Transaction[] = [
      {
        id: '1',
        amount: 25000,
        type: 'INCOME',
        description: 'E-ticaret Projesi Ödemesi',
        category: 'Proje Geliri',
        date: '2024-01-15',
        currency: 'TRY',
      },
      {
        id: '2',
        amount: 5000,
        type: 'EXPENSE',
        description: 'Adobe Creative Suite Aboneliği',
        category: 'Yazılım',
        date: '2024-01-10',
        currency: 'TRY',
      },
      {
        id: '3',
        amount: 15000,
        type: 'INCOME',
        description: 'Logo Tasarımı Projesi',
        category: 'Proje Geliri',
        date: '2024-01-08',
        currency: 'TRY',
      },
      {
        id: '4',
        amount: 2000,
        type: 'EXPENSE',
        description: 'Hosting Hizmeti',
        category: 'Altyapı',
        date: '2024-01-05',
        currency: 'TRY',
      },
    ]

    const mockCashFlow: CashFlow[] = [
      { month: 'Oca', income: 40000, expense: 7000 },
      { month: 'Şub', income: 35000, expense: 8000 },
      { month: 'Mar', income: 45000, expense: 6000 },
      { month: 'Nis', income: 30000, expense: 9000 },
      { month: 'May', income: 50000, expense: 7500 },
      { month: 'Haz', income: 38000, expense: 8500 },
    ]

    setWallets(mockWallets)
    setTransactions(mockTransactions)
    setCashFlow(mockCashFlow)
  }, [])

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0)
  const totalIncome = transactions
    .filter(t => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0)

  if (session?.user?.role !== 'ADMIN') {
    return null
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Finans</h1>
        <p className="mt-1 text-sm text-gray-500">
          Finansal durumunuzu takip edin ve yönetin
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Bakiye
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {totalBalance.toLocaleString('tr-TR')} ₺
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Gelir
                  </dt>
                  <dd className="text-lg font-medium text-green-600">
                    {totalIncome.toLocaleString('tr-TR')} ₺
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Toplam Gider
                  </dt>
                  <dd className="text-lg font-medium text-red-600">
                    {totalExpense.toLocaleString('tr-TR')} ₺
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Net Kar
                  </dt>
                  <dd className={`text-lg font-medium ${totalIncome - totalExpense >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(totalIncome - totalExpense).toLocaleString('tr-TR')} ₺
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cash Flow Chart */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Nakit Akışı</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10B981" name="Gelir" />
                <Bar dataKey="expense" fill="#EF4444" name="Gider" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wallets */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Cüzdanlar</h3>
            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200">
              <PlusIcon className="h-4 w-4 mr-1" />
              Yeni Cüzdan
            </button>
          </div>
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className={`h-8 w-8 rounded-full ${wallet.color} flex items-center justify-center mr-3`}>
                    <WalletIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{wallet.name}</p>
                    <p className="text-xs text-gray-500">{wallet.currency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {wallet.balance.toLocaleString('tr-TR')} {wallet.currency}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Son İşlemler</h3>
            <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200">
              <PlusIcon className="h-4 w-4 mr-1" />
              Yeni İşlem
            </button>
          </div>
        </div>
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Açıklama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tutar
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {transaction.category}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    {transaction.amount.toLocaleString('tr-TR')} {transaction.currency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
} 