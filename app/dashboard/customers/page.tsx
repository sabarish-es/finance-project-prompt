'use client';

import { useState, useEffect } from 'react';
import { getCustomers, createCustomer, updateCustomer } from '@/app/actions/finance';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit2, MapPin, Phone, Mail, FileText } from 'lucide-react';
import Link from 'next/link';
import { CustomerForm } from '@/components/customer-form';

interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  aadharNumber?: string;
  occupationType?: string;
  monthlyIncome?: number;
  currentResidentialAddress?: string;
  currentCity?: string;
  currentState?: string;
  bankAccountNumber?: string;
  bankAccountType?: string;
  location?: string;
  address?: string;
  createdAt: Date | number;
  dateOfBirth?: string;
  fathersName?: string;
  gender?: string;
  maritalStatus?: string;
  dependents?: number;
  panNumber?: string;
  voterIdNumber?: string;
  currentResidentialType?: string;
  currentResidenceStability?: number;
  permanentResidentialAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  permanentResidentialType?: string;
  permanentResidenceStability?: string;
  currentPincode?: string;
  bankAccountName?: string;
  bankBranchName?: string;
  ifscCode?: string;
  businessAddress?: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    const data = await getCustomers();
    setCustomers(data);
    setLoading(false);
  };

  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (editingId) {
        const result = await updateCustomer(editingId, formData);
        if (result.success) {
          setEditingId(null);
          setEditingCustomer(undefined);
          setIsOpen(false);
          await loadCustomers();
        }
      } else {
        const result = await createCustomer(formData);
        if (result.success) {
          setIsOpen(false);
          await loadCustomers();
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setEditingId(customer.id);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEditingId(null);
    setEditingCustomer(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-slate-600">Manage loan customers and their details</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingId(null); setEditingCustomer(undefined); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              <DialogDescription>
                {editingId ? 'Update customer information' : 'Enter complete customer details for loan application'}
              </DialogDescription>
            </DialogHeader>
            <CustomerForm
              initialData={editingCustomer}
              onSubmit={handleFormSubmit}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600">Loading...</p>
        </div>
      ) : customers.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <p className="text-slate-600 mb-4">No customers yet</p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => { setEditingId(null); setEditingCustomer(undefined); }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Customer
                </Button>
              </DialogTrigger>
            </Dialog>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle>{customer.name}</CardTitle>
                    {customer.aadharNumber && (
                      <p className="text-xs text-slate-500 mt-1">
                        Aadhar: {`XXXX-XXXX-${customer.aadharNumber.slice(-4)}`}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(customer)} className="p-1 hover:bg-slate-100 rounded">
                      <Edit2 className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {customer.occupationType && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4" />
                    <span>{customer.occupationType}</span>
                  </div>
                )}
                {customer.monthlyIncome && (
                  <div className="text-sm text-slate-600">
                    Income: <span className="font-semibold">Rs. {customer.monthlyIncome.toLocaleString()}</span>
                  </div>
                )}
                {customer.email && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Mail className="w-4 h-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4" />
                    <span>{customer.phone}</span>
                  </div>
                )}
                {customer.currentCity && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{customer.currentCity}, {customer.currentState}</span>
                  </div>
                )}
                <Link href={`/dashboard/loans?customerId=${customer.id}`}>
                  <Button variant="outline" className="w-full mt-4">View Loans</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
