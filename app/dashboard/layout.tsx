import { getSession, signOut } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Users, FileText, Wallet, BarChart3 } from 'lucide-react';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 shadow-lg">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">FinanceApp</h1>
          <p className="text-slate-400 text-sm">Loan Management System</p>
        </div>

        <nav className="space-y-2">
          <Link href="/dashboard">
            <Button variant="ghost" className="w-full justify-start text-left hover:bg-slate-800">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/dashboard/customers">
            <Button variant="ghost" className="w-full justify-start text-left hover:bg-slate-800">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </Button>
          </Link>
          <Link href="/dashboard/loans">
            <Button variant="ghost" className="w-full justify-start text-left hover:bg-slate-800">
              <Wallet className="w-4 h-4 mr-2" />
              Loans
            </Button>
          </Link>
          <Link href="/dashboard/payments">
            <Button variant="ghost" className="w-full justify-start text-left hover:bg-slate-800">
              <FileText className="w-4 h-4 mr-2" />
              Payments
            </Button>
          </Link>
          <Link href="/dashboard/reports">
            <Button variant="ghost" className="w-full justify-start text-left hover:bg-slate-800">
              <BarChart3 className="w-4 h-4 mr-2" />
              Reports
            </Button>
          </Link>
        </nav>

        {/* User Info & Sign Out */}
        <div className="absolute bottom-6 left-6 right-6 border-t border-slate-700 pt-4">
          <div className="mb-4">
            <p className="text-slate-300 text-sm">Logged in as</p>
            <p className="font-medium text-white truncate">{session.name}</p>
            <p className="text-slate-400 text-xs truncate">{session.email}</p>
          </div>
          <form
            action={async () => {
              'use server';
              await signOut();
              redirect('/login');
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-md text-sm text-slate-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
