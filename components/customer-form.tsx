'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface CustomerFormData {
  name: string;
  dateOfBirth?: string;
  fathersName?: string;
  gender?: string;
  maritalStatus?: string;
  dependents?: number;
  email?: string;
  phone?: string;
  aadharNumber?: string;
  panNumber?: string;
  voterIdNumber?: string;
  currentResidentialAddress?: string;
  currentCity?: string;
  currentState?: string;
  currentPincode?: string;
  currentResidentialType?: string;
  currentResidenceStability?: number;
  permanentResidentialAddress?: string;
  permanentCity?: string;
  permanentState?: string;
  permanentPincode?: string;
  permanentResidentialType?: string;
  permanentResidenceStability?: number;
  location?: string;
  address?: string;
  bankAccountNumber?: string;
  bankAccountType?: string;
  bankAccountName?: string;
  bankBranchName?: string;
  ifscCode?: string;
  occupationType?: string;
  monthlyIncome?: number;
  businessAddress?: string;
}

interface CustomerFormProps {
  initialData?: Partial<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => Promise<void>;
  isSubmitting?: boolean;
}

export function CustomerForm({ initialData, onSubmit, isSubmitting = false }: CustomerFormProps) {
  const [formData, setFormData] = useState<CustomerFormData>({
    name: initialData?.name || '',
    dateOfBirth: initialData?.dateOfBirth || '',
    fathersName: initialData?.fathersName || '',
    gender: initialData?.gender || '',
    maritalStatus: initialData?.maritalStatus || '',
    dependents: initialData?.dependents || 0,
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    aadharNumber: initialData?.aadharNumber || '',
    panNumber: initialData?.panNumber || '',
    voterIdNumber: initialData?.voterIdNumber || '',
    currentResidentialAddress: initialData?.currentResidentialAddress || '',
    currentCity: initialData?.currentCity || '',
    currentState: initialData?.currentState || '',
    currentPincode: initialData?.currentPincode || '',
    currentResidentialType: initialData?.currentResidentialType || '',
    currentResidenceStability: initialData?.currentResidenceStability || 0,
    permanentResidentialAddress: initialData?.permanentResidentialAddress || '',
    permanentCity: initialData?.permanentCity || '',
    permanentState: initialData?.permanentState || '',
    permanentPincode: initialData?.permanentPincode || '',
    permanentResidentialType: initialData?.permanentResidentialType || '',
    permanentResidenceStability: initialData?.permanentResidenceStability || 0,
    location: initialData?.location || '',
    address: initialData?.address || '',
    bankAccountNumber: initialData?.bankAccountNumber || '',
    bankAccountType: initialData?.bankAccountType || '',
    bankAccountName: initialData?.bankAccountName || '',
    bankBranchName: initialData?.bankBranchName || '',
    ifscCode: initialData?.ifscCode || '',
    occupationType: initialData?.occupationType || '',
    monthlyIncome: initialData?.monthlyIncome || 0,
    businessAddress: initialData?.businessAddress || '',
  });

  const [sameAsCurrentAddress, setSameAsCurrentAddress] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.aadharNumber && !/^\d{12}$/.test(formData.aadharNumber.replace(/\D/g, ''))) {
      newErrors.aadharNumber = 'Aadhar must be 12 digits';
    }

    if (formData.panNumber && !/^[A-Z0-9]{10}$/.test(formData.panNumber)) {
      newErrors.panNumber = 'PAN must be 10 alphanumeric characters';
    }

    if (formData.voterIdNumber && !/^[A-Z0-9]{10}$/.test(formData.voterIdNumber)) {
      newErrors.voterIdNumber = 'Voter ID must be 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Copy current to permanent if checkbox is selected
    if (sameAsCurrentAddress) {
      formData.permanentResidentialAddress = formData.currentResidentialAddress;
      formData.permanentCity = formData.currentCity;
      formData.permanentState = formData.currentState;
      formData.permanentPincode = formData.currentPincode;
      formData.permanentResidentialType = formData.currentResidentialType;
      formData.permanentResidenceStability = formData.currentResidenceStability;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof CustomerFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-2">
      {/* Personal Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Enter applicant information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name *</label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="John Doe"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <Input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Father&apos;s Name</label>
              <Input
                value={formData.fathersName}
                onChange={(e) => handleInputChange('fathersName', e.target.value)}
                placeholder="Father's full name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age (Years)</label>
              <Input
                type="number"
                min="0"
                placeholder="Age"
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Transgender">Transgender</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Marital Status</label>
              <select
                value={formData.maritalStatus}
                onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Widow">Widow</option>
                <option value="Divorce">Divorce</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Dependents</label>
              <Input
                type="number"
                min="0"
                value={formData.dependents}
                onChange={(e) => handleInputChange('dependents', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identification Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Identification Details</CardTitle>
          <CardDescription>Enter government-issued ID numbers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Aadhar Card Number</label>
              <Input
                value={formData.aadharNumber}
                onChange={(e) => handleInputChange('aadharNumber', e.target.value)}
                placeholder="XXXX XXXX XXXX"
                maxLength="14"
                className={errors.aadharNumber ? 'border-red-500' : ''}
              />
              {errors.aadharNumber && (
                <p className="text-sm text-red-500">{errors.aadharNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">PAN Card Number</label>
              <Input
                value={formData.panNumber}
                onChange={(e) => handleInputChange('panNumber', e.target.value.toUpperCase())}
                placeholder="AAAPE5055K"
                maxLength="10"
                className={errors.panNumber ? 'border-red-500' : ''}
              />
              {errors.panNumber && <p className="text-sm text-red-500">{errors.panNumber}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Voter ID Number</label>
              <Input
                value={formData.voterIdNumber}
                onChange={(e) => handleInputChange('voterIdNumber', e.target.value.toUpperCase())}
                placeholder="1234567890"
                maxLength="10"
                className={errors.voterIdNumber ? 'border-red-500' : ''}
              />
              {errors.voterIdNumber && (
                <p className="text-sm text-red-500">{errors.voterIdNumber}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 000-0000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Residential Address Section */}
      <Card>
        <CardHeader>
          <CardTitle>Current Residential Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Address</label>
            <Input
              value={formData.currentResidentialAddress}
              onChange={(e) => handleInputChange('currentResidentialAddress', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">City</label>
              <Input
                value={formData.currentCity}
                onChange={(e) => handleInputChange('currentCity', e.target.value)}
                placeholder="City"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">State / Tamil Nadu</label>
              <Input
                value={formData.currentState}
                onChange={(e) => handleInputChange('currentState', e.target.value)}
                placeholder="State"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Pincode</label>
              <Input
                value={formData.currentPincode}
                onChange={(e) => handleInputChange('currentPincode', e.target.value)}
                placeholder="600001"
                maxLength="6"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Residential Type</label>
              <select
                value={formData.currentResidentialType}
                onChange={(e) => handleInputChange('currentResidentialType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Own House">Own House</option>
                <option value="Rental House">Rental House</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Residence Stability (Years)</label>
              <Input
                type="number"
                min="0"
                value={formData.currentResidenceStability}
                onChange={(e) => handleInputChange('currentResidenceStability', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Same Address Checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="sameAddress"
          checked={sameAsCurrentAddress}
          onChange={(e) => setSameAsCurrentAddress(e.target.checked)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="sameAddress" className="text-sm font-medium">
          Permanent address is same as current address
        </label>
      </div>

      {/* Permanent Residential Address Section */}
      {!sameAsCurrentAddress && (
        <Card>
          <CardHeader>
            <CardTitle>Permanent Residential Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                value={formData.permanentResidentialAddress}
                onChange={(e) => handleInputChange('permanentResidentialAddress', e.target.value)}
                placeholder="123 Main Street"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  value={formData.permanentCity}
                  onChange={(e) => handleInputChange('permanentCity', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State / Tamil Nadu</label>
                <Input
                  value={formData.permanentState}
                  onChange={(e) => handleInputChange('permanentState', e.target.value)}
                  placeholder="State"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Pincode</label>
                <Input
                  value={formData.permanentPincode}
                  onChange={(e) => handleInputChange('permanentPincode', e.target.value)}
                  placeholder="600001"
                  maxLength="6"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Residential Type</label>
                <select
                  value={formData.permanentResidentialType}
                  onChange={(e) => handleInputChange('permanentResidentialType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Type</option>
                  <option value="Own House">Own House</option>
                  <option value="Rental House">Rental House</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Residence Stability (Years)</label>
                <Input
                  type="number"
                  min="0"
                  value={formData.permanentResidenceStability}
                  onChange={(e) => handleInputChange('permanentResidenceStability', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bank Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bank Details</CardTitle>
          <CardDescription>Enter your bank account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Account Number</label>
              <Input
                value={formData.bankAccountNumber}
                onChange={(e) => handleInputChange('bankAccountNumber', e.target.value)}
                placeholder="123456789012345"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Account Type</label>
              <select
                value={formData.bankAccountType}
                onChange={(e) => handleInputChange('bankAccountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Type</option>
                <option value="Savings">Savings</option>
                <option value="Current">Current</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Account Holder Name</label>
              <Input
                value={formData.bankAccountName}
                onChange={(e) => handleInputChange('bankAccountName', e.target.value)}
                placeholder="Account holder name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Branch Name</label>
              <Input
                value={formData.bankBranchName}
                onChange={(e) => handleInputChange('bankBranchName', e.target.value)}
                placeholder="Branch name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">IFSC Code</label>
              <Input
                value={formData.ifscCode}
                onChange={(e) => handleInputChange('ifscCode', e.target.value.toUpperCase())}
                placeholder="SBIN0001234"
                maxLength="11"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupation Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Occupation Details</CardTitle>
          <CardDescription>Enter your occupation and income information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Occupation Type</label>
              <select
                value={formData.occupationType}
                onChange={(e) => handleInputChange('occupationType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Occupation</option>
                <option value="Self Employed Business">Self Employed Business</option>
                <option value="Salaried Worker">Salaried Worker</option>
                <option value="House Wife">House Wife</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Monthly Income (Rs.)</label>
              <Input
                type="number"
                min="0"
                value={formData.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', parseFloat(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            {formData.occupationType === 'Self Employed Business' && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">Business Address</label>
                <Input
                  value={formData.businessAddress}
                  onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                  placeholder="Business address"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex gap-2 sticky bottom-0 bg-white py-4 border-t">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : 'Save Customer'}
        </Button>
      </div>
    </form>
  );
}
