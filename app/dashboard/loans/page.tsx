'use client';

import { useState, useEffect } from 'react';
import { getLoans, createLoan, getCustomers, getLoansByCustomer, getPaymentsByLoan } from '@/app/actions/finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, DollarSign, Calendar } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
}

interface Loan {
  id: string;
  customerId: string;
  loanAmount: number;
  principalAmount: number;
  interestRate: number;
  loanType: string;
  status: string;
  startDate: Date | number;
  endDate?: Date | number;
}

export default function LoansPage() {
  const searchParams = useSearchParams();
  const customerIdParam = searchParams.get('customerId');

  const [loans, setLoans] = useState<Loan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: customerIdParam || '',
    loanAmount: '',
    principalAmount: '',
    interestRate: '',
    loanType: 'Personal',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const customerList = await getCustomers();
    setCustomers(customerList);

    if (customerIdParam) {
      const loanList = await getLoansByCustomer(customerIdParam);
      setLoans(loanList);
    } else {
      const loanList = await getLoans();
      setLoans(loanList);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await createLoan(
      formData.customerId,
      parseFloat(formData.loanAmount),
      parseFloat(formData.principalAmount),
      parseFloat(formData.interestRate),
      formData.loanType,
      new Date(formData.startDate),
      formData.endDate ? new Date(formData.endDate) : undefined
    );

    if (result.success) {
      setFormData({
        customerId: '',
        loanAmount: '',
        principalAmount: '',
        interestRate: '',
        loanType: 'Personal',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
      setIsOpen(false);
      await loadData();
    }
  };

  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || 'Unknown';
  };

  const getPaymentAmount = (loan: Loan) => {
    // This would need to fetch payments for the loan
    return loan.loanAmount - loan.principalAmount; // Simplified
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Loans</h1>
          <p className="text-slate-600">Manage and track all loans</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Loan
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Loan</DialogTitle>
              <DialogDescription>Enter the loan details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer</label>
                <select
                  required
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loan Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Principal Amount</label>
                  <Input
                    type="number"
                    step="0.01"
                    required
                    value={formData.principalAmount}
                    onChange={(e) => setFormData({ ...formData, principalAmount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Interest Rate (%)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Loan Type</label>
                  <select
                    value={formData.loanType}
                    onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                  >
                    <option>Personal</option>
                    <option>Business</option>
                    <option>Home</option>
                    <option>Auto</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Create Loan</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>Cancel</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Loading...</p>
        </div>
      ) : loans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-slate-600 mb-4">No loans yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Customer</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Loan Amount</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Interest Rate</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Start Date</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">{getCustomerName(loan.customerId)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      {loan.loanAmount.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">{loan.loanType}</td>
                  <td className="py-3 px-4">{loan.interestRate}%</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      loan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-slate-600" />
                      {new Date(loan.startDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm">View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
