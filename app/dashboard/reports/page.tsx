'use client';

import { useState, useEffect } from 'react';
import { getReportData, getCustomers } from '@/app/actions/finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, DollarSign, Users } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  location?: string;
}

interface Loan {
  id: string;
  customerId: string;
  loanAmount: number;
  principalAmount: number;
  interestRate: number;
  status: string;
  startDate: Date | number;
}

interface Payment {
  id: string;
  loanId: string;
  amount: number;
  date: Date | number;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<{ customers: Customer[]; loans: Loan[]; payments: Payment[] }>({
    customers: [],
    loans: [],
    payments: [],
  });
  const [loading, setLoading] = useState(true);
  const [filterLocation, setFilterLocation] = useState('all');

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    setLoading(true);
    const data = await getReportData();
    setReportData(data);
    setLoading(false);
  };

  const getCustomerName = (customerId: string) => {
    return reportData.customers.find((c) => c.id === customerId)?.name || 'Unknown';
  };

  const getLoansByLocation = () => {
    if (filterLocation === 'all') return reportData.loans;
    return reportData.loans.filter((loan) => {
      const customer = reportData.customers.find((c) => c.id === loan.customerId);
      return customer?.location === filterLocation;
    });
  };

  const filteredLoans = getLoansByLocation();

  // Calculate metrics
  const totalLoanAmount = filteredLoans.reduce((sum, loan) => sum + loan.loanAmount, 0);
  const totalPayments = reportData.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const activeLoanCount = filteredLoans.filter((l) => l.status === 'Active').length;
  const defaultedLoanCount = filteredLoans.filter((l) => l.status === 'Defaulted').length;

  const locations = [...new Set(reportData.customers.map((c) => c.location).filter(Boolean))];

  const handleExport = () => {
    const csv = [
      ['LOAN REPORT'],
      [],
      ['Customer', 'Loan Amount', 'Interest Rate', 'Status', 'Start Date'],
      ...filteredLoans.map((loan) => [
        getCustomerName(loan.customerId),
        loan.loanAmount,
        `${loan.interestRate}%`,
        loan.status,
        new Date(loan.startDate).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-slate-600">Comprehensive financial reports and insights</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              }).format(totalLoanAmount)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Across {filteredLoans.length} loans
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLoanCount}</div>
            <p className="text-xs text-slate-600 mt-1">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              }).format(totalPayments)}
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {reportData.payments.length} payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Defaulted Loans</CardTitle>
            <TrendingUp className="w-4 h-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{defaultedLoanCount}</div>
            <p className="text-xs text-slate-600 mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm"
          >
            <option value="all">All Locations</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Loan Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Loan Details</CardTitle>
          <CardDescription>Detailed breakdown of all loans</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : filteredLoans.length === 0 ? (
            <p className="text-slate-600">No loans found for the selected criteria</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Customer</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Loan Amount</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Interest Rate</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Status</th>
                    <th className="text-left py-2 px-3 font-semibold text-slate-700">Start Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLoans.map((loan) => (
                    <tr key={loan.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-2 px-3">{getCustomerName(loan.customerId)}</td>
                      <td className="py-2 px-3">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(loan.loanAmount)}
                      </td>
                      <td className="py-2 px-3">{loan.interestRate}%</td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            loan.status === 'Active'
                              ? 'bg-green-100 text-green-800'
                              : loan.status === 'Defaulted'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-2 px-3">{new Date(loan.startDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
