import React, { useRef, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectTrigger, SelectValue } from './ui/select';
import { toast } from './ui/use-toast';
import { useCreateCustomer } from '../hooks/useAPI/use-customer';
import { useFetchAllCustomerTypes } from '../hooks/useAPI/use-customer-types';
import DefaultSelectDataItems from './select-data-items';
import { formatPhoneNumber } from '../lib/utils';
import listOfUSStates from '../data/state_titlecase.json';
import { UploadIcon } from 'lucide-react';

// @ts-ignore – no type declarations for vcard-parser
import vcardParser from 'vcard-parser';

interface ParsedContact {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  street_address: string;
  city: string;
  state: string;
  zipcode: string;
  customer_type_id: string;
}

function parseVCard(text: string): ParsedContact {
  const card = vcardParser.parse(text);

  // Name: prefer structured N field, fall back to FN
  let firstName = '';
  let lastName = '';
  const n = card.n?.[0]?.value;
  const fn = card.fn?.[0]?.value;
  if (Array.isArray(n) && (n[0] || n[1])) {
    lastName = (n[0] || '').trim();
    firstName = (n[1] || '').trim();
  } else if (typeof fn === 'string') {
    const parts = fn.trim().split(/\s+/);
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ');
  }

  // Phone: strip non-digits, keep last 10, then format
  const rawPhone = card.tel?.[0]?.value || '';
  const digits = rawPhone.replace(/\D/g, '');
  const phone = formatPhoneNumber(digits.length >= 10 ? digits.slice(-10) : digits);

  // Email
  const email = (card.email?.[0]?.value || '').trim();

  // Address — ADR: [PO Box, Extended, Street, City, State/Region, Zip, Country]
  const adr = card.adr?.[0]?.value;
  let street = '';
  let city = '';
  let state = '';
  let zipcode = '';
  if (Array.isArray(adr)) {
    street = (adr[2] || '').trim();
    city = (adr[3] || '').trim();
    state = (adr[4] || '').trim();
    zipcode = (adr[5] || '').trim();
  }

  // Normalise state to 2-letter abbreviation
  if (state.length > 2) {
    const match = listOfUSStates.find((s) => s.name.toLowerCase() === state.toLowerCase());
    state = match ? match.abbreviation : state.slice(0, 2).toUpperCase();
  } else {
    state = state.toUpperCase();
  }

  return {
    first_name: firstName,
    last_name: lastName,
    email,
    phone_number: phone,
    street_address: street,
    city,
    state,
    zipcode,
    customer_type_id: '1'
  };
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportContactDialog({ open, onOpenChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<'pick' | 'preview'>('pick');
  const [contact, setContact] = useState<ParsedContact | null>(null);
  const [parseError, setParseError] = useState('');

  const { data: customerTypes } = useFetchAllCustomerTypes();
  const { mutate: createCustomer, isLoading } = useCreateCustomer(toast, (val: boolean) => {
    if (!val) onOpenChange(false);
  });

  // Auto-trigger file picker when dialog first opens
  useEffect(() => {
    if (open && step === 'pick') {
      const timer = setTimeout(() => fileInputRef.current?.click(), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setStep('pick');
      setContact(null);
      setParseError('');
    }
  }, [open]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string;
        const parsed = parseVCard(text);
        setContact(parsed);
        setStep('preview');
        setParseError('');
      } catch {
        setParseError(
          'Could not read the contact file. Please export a valid vCard (.vcf) from Apple Contacts and try again.'
        );
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be picked again if needed
    e.target.value = '';
  }

  function handleSave() {
    if (!contact) return;
    createCustomer({
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email,
      phone_number: contact.phone_number,
      street_address: contact.street_address,
      city: contact.city,
      state: contact.state,
      zipcode: contact.zipcode,
      customer_type_id: parseInt(contact.customer_type_id)
    });
  }

  function update(field: keyof ParsedContact, value: string) {
    setContact((c) => (c ? { ...c, [field]: value } : c));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".vcf"
          className="hidden"
          onChange={handleFileChange}
        />

        <DialogHeader>
          <DialogTitle>Import Contact</DialogTitle>
        </DialogHeader>

        {step === 'pick' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <p className="text-sm text-muted-foreground text-center">
              In Apple Contacts, right-click any contact and choose{' '}
              <span className="font-medium text-foreground">Export vCard...</span>, then select the
              downloaded <span className="font-medium text-foreground">.vcf</span> file below.
            </p>
            {parseError && <p className="text-sm text-destructive text-center">{parseError}</p>}
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon className="h-4 w-4 mr-2" />
              Select .vcf File
            </Button>
          </div>
        )}

        {step === 'preview' && contact && (
          <>
            <p className="text-sm text-muted-foreground -mt-2">
              Review and edit the contact details, then save.
            </p>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>First Name</Label>
                  <Input
                    value={contact.first_name}
                    onChange={(e) => update('first_name', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Last Name</Label>
                  <Input
                    value={contact.last_name}
                    onChange={(e) => update('last_name', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={contact.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <Label>Phone Number</Label>
                <Input
                  value={contact.phone_number}
                  onChange={(e) => update('phone_number', formatPhoneNumber(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <Label>Street Address</Label>
                <Input
                  value={contact.street_address}
                  onChange={(e) => update('street_address', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>City</Label>
                  <Input value={contact.city} onChange={(e) => update('city', e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>State</Label>
                  <Select value={contact.state} onValueChange={(val) => update('state', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <DefaultSelectDataItems
                      data={listOfUSStates}
                      valueKey="abbreviation"
                      labelKey="name"
                    />
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Zipcode</Label>
                  <Input
                    value={contact.zipcode}
                    onChange={(e) => update('zipcode', e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Customer Type</Label>
                  <Select
                    value={contact.customer_type_id}
                    onValueChange={(val) => update('customer_type_id', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <DefaultSelectDataItems data={customerTypes} />
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-2 gap-2">
              <Button variant="secondary" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={isLoading || !contact.email || !contact.first_name}>
                {isLoading ? 'Saving...' : 'Save as Customer'}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
