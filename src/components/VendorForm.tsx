import React, { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
  initialData?: any;
  mode?: 'create' | 'edit';
}

export default function VendorForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  mode = 'create' 
}: VendorFormProps) {
  const [formData, setFormData] = useState({
    // Basic Details
    id: initialData?.id || "",
    salutation: initialData?.salutation || "",
    firstName: initialData?.firstName || initialData?.first_name || "",
    lastName: initialData?.lastName || initialData?.last_name || "",
    companyName: initialData?.companyName || initialData?.company_name || "",
    displayName: initialData?.displayName || initialData?.display_name || "",
    email: initialData?.email || "",
    workPhone: initialData?.workPhone || initialData?.phone || "",
    mobile: initialData?.mobile || "",
    
    // Other Details
    pan: initialData?.pan || initialData?.PAN || "",
    msmeRegistered: initialData?.msmeRegistered || initialData?.msme_register || false,
    msmeRegistrationType: initialData?.msmeRegistrationType || initialData?.msme_register_type || "",
    msmeRegistrationNumber: initialData?.msmeRegistrationNumber || initialData?.msme_register_number || "",
    currency: initialData?.currency || "",
    openingBalance: initialData?.openingBalance || initialData?.opening_balance || "",
    paymentTerms: initialData?.paymentTerms || "",
    tds: initialData?.tds || "",
    
    // Address - Billing
    billingAttention: initialData?.billingAttention || "",
    billingCountry: initialData?.billingCountry || "",
    billingAddress1: initialData?.billingAddress1 || "",
    billingAddress2: initialData?.billingAddress2 || "",
    billingCity: initialData?.billingCity || initialData?.city || "",
    billingState: initialData?.billingState || "",
    billingPinCode: initialData?.billingPinCode || "",
    billingPhone: initialData?.billingPhone || "",
    billingFax: initialData?.billingFax || "",
    
    // Address - Shipping
    shippingAttention: initialData?.shippingAttention || "",
    shippingCountry: initialData?.shippingCountry || "",
    shippingAddress1: initialData?.shippingAddress1 || "",
    shippingAddress2: initialData?.shippingAddress2 || "",
    shippingCity: initialData?.shippingCity || "",
    shippingState: initialData?.shippingState || "",
    shippingPinCode: initialData?.shippingPinCode || "",
    shippingPhone: initialData?.shippingPhone || "",
    shippingFax: initialData?.shippingFax || "",
    
    // Bank Details
    accountHolderName: initialData?.accountHolderName || "",
    bankName: initialData?.bankName || "",
    accountNumber: initialData?.accountNumber || "",
    reenterAccountNumber: initialData?.reenterAccountNumber || "",
    ifsc: initialData?.ifsc || "",
    
    // Remarks
    remarks: initialData?.remarks || "",
  });

  const [contactPersons, setContactPersons] = useState(() => {
    // Load from initialData if in edit mode
    if (mode === 'edit' && initialData?.contact_person && Array.isArray(initialData.contact_person) && initialData.contact_person.length > 0) {
      return initialData.contact_person.map((person: any, index: number) => ({
        id: index + 1,
        salutation: person.saluation === 1 ? "mr" : person.saluation === 2 ? "mrs" : person.saluation === 3 ? "ms" : person.saluation === 4 ? "dr" : "",
        firstName: person.first_name || "",
        lastName: person.last_name || "",
        email: person.email || "",
        workPhone: person.work_phone || "",
        workMobile: person.work_mobile || "",
        designation: person.designation || "",
        department: person.department || "",
      }));
    }
    return [{
      id: 1,
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      workPhone: "",
      workMobile: "",
      designation: "",
      department: "",
    }];
  });

  const [banks, setBanks] = useState(() => {
    // Load from initialData if in edit mode
    if (mode === 'edit' && initialData?.bank && Array.isArray(initialData.bank) && initialData.bank.length > 0) {
      return initialData.bank.map((bank: any, index: number) => ({
        id: index + 1,
        accountHolderName: bank.account_holder_name || "",
        bankName: bank.bank_name || "",
        accountNumber: bank.account_number || "",
        ifsc: bank.ifsc || "",
      }));
    }
    return [{
      id: 1,
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    }];
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const addContactPerson = () => {
    setContactPersons([...contactPersons, {
      id: contactPersons.length + 1,
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      workPhone: "",
      workMobile: "",
      designation: "",
      department: "",
    }]);
  };

  const updateContactPerson = (id: number, field: string, value: string) => {
    setContactPersons(contactPersons.map(person => 
      person.id === id ? { ...person, [field]: value } : person
    ));
  };

  const removeContactPerson = (id: number) => {
    setContactPersons(contactPersons.filter(person => person.id !== id));
  };

  const addBank = () => {
    setBanks([...banks, {
      id: banks.length + 1,
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifsc: "",
    }]);
  };

  const updateBank = (id: number, field: string, value: string) => {
    setBanks(banks.map(bank => 
      bank.id === id ? { ...bank, [field]: value } : bank
    ));
  };

  const removeBank = (id: number) => {
    setBanks(banks.filter(bank => bank.id !== id));
  };

  const handleSubmit = () => {
    // Format data according to the new API structure
    const submissionData: any = {
      saluation: formData.salutation === "mr" ? 1 : formData.salutation === "mrs" ? 2 : formData.salutation === "ms" ? 3 : formData.salutation === "dr" ? 4 : 1,
      first_name: formData.firstName,
      last_name: formData.lastName,
      company_name: formData.companyName,
      display_name: formData.displayName,
      email: formData.email,
      phone: parseInt(formData.workPhone) || 0,
      PAN: formData.pan || null,
      msme_register: formData.msmeRegistered ? 1 : 0,
      msme_register_type: formData.msmeRegistrationType === "micro" ? 0 : formData.msmeRegistrationType === "small" ? 1 : formData.msmeRegistrationType === "medium" ? 2 : 0,
      msme_register_number: formData.msmeRegistrationNumber || null,
      opening_balance: formData.openingBalance ? parseFloat(formData.openingBalance) : null,
      currency: formData.currency || null,
      bank: banks.map(bank => ({
        account_holder_name: bank.accountHolderName,
        bank_name: bank.bankName,
        account_number: bank.accountNumber,
        ifsc: bank.ifsc || null,
      })),
      contact_person: contactPersons.map(person => ({
        saluation: person.salutation === "mr" ? 1 : person.salutation === "mrs" ? 2 : person.salutation === "ms" ? 3 : person.salutation === "dr" ? 4 : 1,
        first_name: person.firstName || null,
        last_name: person.lastName || null,
        email: person.email || null,
        work_phone: person.workPhone || null,
        work_mobile: person.workMobile || null,
        designation: person.designation || null,
        department: person.department || null,
      })),
    };
    
    // Add ID for edit mode
    if (mode === 'edit' && formData.id) {
      submissionData.id = formData.id;
    }
    
    console.log("🔥 VendorForm - Submission Data:", submissionData);
    console.log("🔥 VendorForm - Mode:", mode);
    
    if (onSubmit) {
      onSubmit(submissionData);
    } else {
      console.log("Form Data:", formData);
      console.log("Contact Persons:", contactPersons);
      console.log("Banks:", banks);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            {mode === 'edit' ? 'Edit Vendor' : 'New Vendor'}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">Primary Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Salutation</Label>
                  <Select value={formData.salutation} onValueChange={(value) => handleInputChange("salutation", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mr">Mr.</SelectItem>
                      <SelectItem value="mrs">Mrs.</SelectItem>
                      <SelectItem value="ms">Ms.</SelectItem>
                      <SelectItem value="dr">Dr.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>First Name</Label>
                  <Input 
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <Label>Last Name</Label>
                  <Input 
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Last Name"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Company Name</Label>
                  <Input 
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Display Name*</Label>
                  <Select value={formData.displayName} onValueChange={(value) => handleInputChange("displayName", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select or type to add" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company Name</SelectItem>
                      <SelectItem value="contact">Contact Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Email Address</Label>
                  <Input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <Label>Work Phone</Label>
                  <Input 
                    value={formData.workPhone}
                    onChange={(e) => handleInputChange("workPhone", e.target.value)}
                    placeholder="Work Phone"
                  />
                </div>
                <div>
                  <Label>Mobile</Label>
                  <Input 
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    placeholder="Mobile"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tabbed Content */}
          <Tabs defaultValue="other-details" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="other-details">Other Details</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="contact-persons">Contact Persons</TabsTrigger>
              <TabsTrigger value="bank-details">Bank Details</TabsTrigger>
              <TabsTrigger value="remarks">Remarks</TabsTrigger>
            </TabsList>

            {/* Other Details Tab */}
            <TabsContent value="other-details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>PAN</Label>
                  <Input 
                    value={formData.pan}
                    onChange={(e) => handleInputChange("pan", e.target.value)}
                    placeholder="Enter PAN"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox 
                    id="msme"
                    checked={formData.msmeRegistered}
                    onCheckedChange={(checked) => handleInputChange("msmeRegistered", !!checked)}
                  />
                  <Label htmlFor="msme">MSME Registered</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>MSME/Udyam Registration Type</Label>
                  <Select value={formData.msmeRegistrationType} onValueChange={(value) => handleInputChange("msmeRegistrationType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro</SelectItem>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>MSME/Udyam Registration Number</Label>
                  <Input 
                    value={formData.msmeRegistrationNumber}
                    onChange={(e) => handleInputChange("msmeRegistrationNumber", e.target.value)}
                    placeholder="Registration Number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">INR - Indian Rupee</SelectItem>
                      <SelectItem value="usd">USD - US Dollar</SelectItem>
                      <SelectItem value="eur">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Opening Balance</Label>
                  <Input 
                    value={formData.openingBalance}
                    onChange={(e) => handleInputChange("openingBalance", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Payment Terms</Label>
                  <Select value={formData.paymentTerms} onValueChange={(value) => handleInputChange("paymentTerms", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="net15">Net 15</SelectItem>
                      <SelectItem value="net30">Net 30</SelectItem>
                      <SelectItem value="net45">Net 45</SelectItem>
                      <SelectItem value="net60">Net 60</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>TDS</Label>
                  <Select value={formData.tds} onValueChange={(value) => handleInputChange("tds", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select TDS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="1">1%</SelectItem>
                      <SelectItem value="2">2%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                      <SelectItem value="10">10%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Billing Address */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Billing Address</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>Attention</Label>
                        <Input 
                          value={formData.billingAttention}
                          onChange={(e) => handleInputChange("billingAttention", e.target.value)}
                          placeholder="Attention"
                        />
                      </div>
                      <div>
                        <Label>Country/Region</Label>
                        <Select value={formData.billingCountry} onValueChange={(value) => handleInputChange("billingCountry", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Address Line 1</Label>
                        <Input 
                          value={formData.billingAddress1}
                          onChange={(e) => handleInputChange("billingAddress1", e.target.value)}
                          placeholder="Street Address"
                        />
                      </div>
                      <div>
                        <Label>Address Line 2</Label>
                        <Input 
                          value={formData.billingAddress2}
                          onChange={(e) => handleInputChange("billingAddress2", e.target.value)}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>City</Label>
                          <Input 
                            value={formData.billingCity}
                            onChange={(e) => handleInputChange("billingCity", e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Select value={formData.billingState} onValueChange={(value) => handleInputChange("billingState", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                              <SelectItem value="karnataka">Karnataka</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Pin Code</Label>
                          <Input 
                            value={formData.billingPinCode}
                            onChange={(e) => handleInputChange("billingPinCode", e.target.value)}
                            placeholder="Pin Code"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input 
                            value={formData.billingPhone}
                            onChange={(e) => handleInputChange("billingPhone", e.target.value)}
                            placeholder="Phone"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Fax Number</Label>
                        <Input 
                          value={formData.billingFax}
                          onChange={(e) => handleInputChange("billingFax", e.target.value)}
                          placeholder="Fax Number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardContent className="pt-6">
                    <h4 className="font-semibold mb-4">Shipping Address</h4>
                    <div className="space-y-4">
                      <div>
                        <Label>Attention</Label>
                        <Input 
                          value={formData.shippingAttention}
                          onChange={(e) => handleInputChange("shippingAttention", e.target.value)}
                          placeholder="Attention"
                        />
                      </div>
                      <div>
                        <Label>Country/Region</Label>
                        <Select value={formData.shippingCountry} onValueChange={(value) => handleInputChange("shippingCountry", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Address Line 1</Label>
                        <Input 
                          value={formData.shippingAddress1}
                          onChange={(e) => handleInputChange("shippingAddress1", e.target.value)}
                          placeholder="Street Address"
                        />
                      </div>
                      <div>
                        <Label>Address Line 2</Label>
                        <Input 
                          value={formData.shippingAddress2}
                          onChange={(e) => handleInputChange("shippingAddress2", e.target.value)}
                          placeholder="Apartment, suite, etc."
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>City</Label>
                          <Input 
                            value={formData.shippingCity}
                            onChange={(e) => handleInputChange("shippingCity", e.target.value)}
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <Label>State</Label>
                          <Select value={formData.shippingState} onValueChange={(value) => handleInputChange("shippingState", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="State" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maharashtra">Maharashtra</SelectItem>
                              <SelectItem value="delhi">Delhi</SelectItem>
                              <SelectItem value="karnataka">Karnataka</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label>Pin Code</Label>
                          <Input 
                            value={formData.shippingPinCode}
                            onChange={(e) => handleInputChange("shippingPinCode", e.target.value)}
                            placeholder="Pin Code"
                          />
                        </div>
                        <div>
                          <Label>Phone</Label>
                          <Input 
                            value={formData.shippingPhone}
                            onChange={(e) => handleInputChange("shippingPhone", e.target.value)}
                            placeholder="Phone"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Fax Number</Label>
                        <Input 
                          value={formData.shippingFax}
                          onChange={(e) => handleInputChange("shippingFax", e.target.value)}
                          placeholder="Fax Number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contact Persons Tab */}
            <TabsContent value="contact-persons" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Contact Persons</h4>
                <Button onClick={addContactPerson} size="sm">
                  Add Contact Person
                </Button>
              </div>
              
              <div className="space-y-4">
                {contactPersons.map((person, index) => (
                  <Card key={person.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold">Contact Person {index + 1}</h5>
                        {contactPersons.length > 1 && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeContactPerson(person.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Salutation</Label>
                          <Select 
                            value={person.salutation} 
                            onValueChange={(value) => updateContactPerson(person.id, "salutation", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mr">Mr.</SelectItem>
                              <SelectItem value="mrs">Mrs.</SelectItem>
                              <SelectItem value="ms">Ms.</SelectItem>
                              <SelectItem value="dr">Dr.</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>First Name</Label>
                          <Input 
                            value={person.firstName}
                            onChange={(e) => updateContactPerson(person.id, "firstName", e.target.value)}
                            placeholder="First Name"
                          />
                        </div>
                        <div>
                          <Label>Last Name</Label>
                          <Input 
                            value={person.lastName}
                            onChange={(e) => updateContactPerson(person.id, "lastName", e.target.value)}
                            placeholder="Last Name"
                          />
                        </div>
                        <div>
                          <Label>Email Address</Label>
                          <Input 
                            type="email"
                            value={person.email}
                            onChange={(e) => updateContactPerson(person.id, "email", e.target.value)}
                            placeholder="Email"
                          />
                        </div>
                        <div>
                          <Label>Work Phone</Label>
                          <Input 
                            value={person.workPhone}
                            onChange={(e) => updateContactPerson(person.id, "workPhone", e.target.value)}
                            placeholder="Work Phone"
                          />
                        </div>
                        <div>
                          <Label>Work Mobile</Label>
                          <Input 
                            value={person.workMobile}
                            onChange={(e) => updateContactPerson(person.id, "workMobile", e.target.value)}
                            placeholder="Work Mobile"
                          />
                        </div>
                        <div>
                          <Label>Designation</Label>
                          <Input 
                            value={person.designation}
                            onChange={(e) => updateContactPerson(person.id, "designation", e.target.value)}
                            placeholder="Designation"
                          />
                        </div>
                        <div>
                          <Label>Department</Label>
                          <Input 
                            value={person.department}
                            onChange={(e) => updateContactPerson(person.id, "department", e.target.value)}
                            placeholder="Department"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Bank Details Tab */}
            <TabsContent value="bank-details" className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Bank Accounts</h4>
                <Button onClick={addBank} size="sm">
                  Add Bank Account
                </Button>
              </div>
              
              <div className="space-y-4">
                {banks.map((bank, index) => (
                  <Card key={bank.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-semibold">Bank Account {index + 1}</h5>
                        {banks.length > 1 && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeBank(bank.id)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Account Holder Name</Label>
                          <Input 
                            value={bank.accountHolderName}
                            onChange={(e) => updateBank(bank.id, "accountHolderName", e.target.value)}
                            placeholder="Account Holder Name"
                          />
                        </div>
                        <div>
                          <Label>Bank Name</Label>
                          <Input 
                            value={bank.bankName}
                            onChange={(e) => updateBank(bank.id, "bankName", e.target.value)}
                            placeholder="Bank Name"
                          />
                        </div>
                        <div>
                          <Label>Account Number</Label>
                          <Input 
                            value={bank.accountNumber}
                            onChange={(e) => updateBank(bank.id, "accountNumber", e.target.value)}
                            placeholder="Account Number"
                          />
                        </div>
                        <div>
                          <Label>IFSC</Label>
                          <Input 
                            value={bank.ifsc}
                            onChange={(e) => updateBank(bank.id, "ifsc", e.target.value)}
                            placeholder="IFSC Code"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>


            {/* Remarks Tab */}
            <TabsContent value="remarks" className="space-y-4">
              <div>
                <Label>Remarks</Label>
                <Textarea 
                  value={formData.remarks}
                  onChange={(e) => handleInputChange("remarks", e.target.value)}
                  placeholder="Enter any additional remarks or notes about this vendor..."
                  rows={6}
                />
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}