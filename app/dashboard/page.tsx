import { db } from '@/lib/db';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, FileText, AlertCircle } from 'lucide-react';

export default async function DashboardPage() {
  // Get statistics
  const allCustomers = (db.select('customers') as any[]) || [];
  const allLoans = (db.select('loans') as any[]) || [];
  const allPayments = (db.select('payments') as any[]) || [];

  const totalLoans = allLoans.length;
  const activeLoans = allLoans.filter((l) => l.status === 'Active').length;
  const totalLoanAmount = allLoans.reduce((sum, loan) => sum + (loan.loanAmount || 0), 0);
  const totalPayments = allPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

  const stats = {
    totalCustomers: allCustomers.length,
    totalLoans,
    activeLoans,
    totalLoanAmount,
    totalPayments,
    paymentCount: allPayments.length,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here&apos;s an overview of your finance management system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-slate-600">Active in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
            <FileText className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLoans}</div>
            <p className="text-xs text-slate-600">{stats.activeLoans} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Loan Amount</CardTitle>
            <DollarSign className="w-4 h-4 text-slate-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(stats.totalLoanAmount)}
            </div>
            <p className="text-xs text-slate-600">Across all loans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(stats.totalPayments)}
            </div>
            <p className="text-xs text-slate-600">{stats.paymentCount} payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
          <CardDescription>Common actions you can perform</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/dashboard/customers" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <h3 className="font-medium mb-1">Manage Customers</h3>
            <p className="text-sm text-slate-600">Add, edit, and view customer information</p>
          </a>
          <a href="/dashboard/loans" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <h3 className="font-medium mb-1">Manage Loans</h3>
            <p className="text-sm text-slate-600">Create and track loan disbursements</p>
          </a>
          <a href="/dashboard/payments" className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <h3 className="font-medium mb-1">Record Payments</h3>
            <p className="text-sm text-slate-600">Track customer payments and collections</p>
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
