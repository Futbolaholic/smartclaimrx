'use client';
import { useState, FormEvent } from 'react';

export default function ClaimSubmission() {
  const [formData, setFormData] = useState({
    patientName: '',
    patientDOB: '',
    patientInsuranceId: '',
    drugName: '',
    ndc: '',
    quantity: '',
    daysSupply: '',
    prescriberId: '',
    amountBilled: '',
    insurerName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    warnings: string[];
    suggestions: string[];
  } | null>(null);
  
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    message: string;
    claimId?: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.patientName.trim()) {
      newErrors.patientName = 'Patient name is required';
    }
    
    if (!formData.patientDOB.trim()) {
      newErrors.patientDOB = 'Date of birth is required';
    }
    
    if (!formData.patientInsuranceId.trim()) {
      newErrors.patientInsuranceId = 'Insurance ID is required';
    }
    
    if (!formData.drugName.trim()) {
      newErrors.drugName = 'Drug name is required';
    }
    
    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be a positive number';
    }
    
    if (!formData.daysSupply.trim()) {
      newErrors.daysSupply = 'Days supply is required';
    } else if (isNaN(Number(formData.daysSupply)) || Number(formData.daysSupply) <= 0) {
      newErrors.daysSupply = 'Days supply must be a positive number';
    }
    
    if (!formData.amountBilled.trim()) {
      newErrors.amountBilled = 'Amount billed is required';
    } else if (isNaN(Number(formData.amountBilled)) || Number(formData.amountBilled) <= 0) {
      newErrors.amountBilled = 'Amount billed must be a positive number';
    }
    
    if (!formData.insurerName.trim()) {
      newErrors.insurerName = 'Insurer name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleValidate = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Simulate AI validation check
      setIsSubmitting(true);
      
      setTimeout(() => {
        // This would be an actual API call in the real implementation
        const mockValidationResult = {
          isValid: true,
          warnings: [
            'Patient has high deductible plan - verify coverage',
            'Similar NDC has been rejected in the past'
          ],
          suggestions: [
            'Consider adding diagnosis code for better approval chance',
            'Verify step therapy requirements for this medication'
          ]
        };
        
        setValidationResult(mockValidationResult);
        setIsSubmitting(false);
      }, 1500);
    }
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate claim submission
      setTimeout(() => {
        // This would be an actual API call in the real implementation
        setSubmissionResult({
          success: true,
          message: 'Claim submitted successfully!',
          claimId: Math.random().toString(36).substring(2, 9)
        });
        setIsSubmitting(false);
        setValidationResult(null);
      }, 2000);
    }
  };
  
  const resetForm = () => {
    setFormData({
      patientName: '',
      patientDOB: '',
      patientInsuranceId: '',
      drugName: '',
      ndc: '',
      quantity: '',
      daysSupply: '',
      prescriberId: '',
      amountBilled: '',
      insurerName: ''
    });
    setErrors({});
    setValidationResult(null);
    setSubmissionResult(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Submit New Claim</h1>
      
      {submissionResult ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className={`p-4 mb-4 rounded-lg ${submissionResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className="font-medium">{submissionResult.message}</p>
            {submissionResult.claimId && (
              <p className="mt-2">Claim ID: {submissionResult.claimId}</p>
            )}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Submit Another Claim
            </button>
            
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={validationResult ? handleSubmit : handleValidate} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Patient Information</h2>
              
              <div className="mb-4">
                <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  id="patientName"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.patientName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.patientName && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="patientDOB" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="patientDOB"
                  name="patientDOB"
                  value={formData.patientDOB}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.patientDOB ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.patientDOB && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientDOB}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="patientInsuranceId" className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance ID
                </label>
                <input
                  type="text"
                  id="patientInsuranceId"
                  name="patientInsuranceId"
                  value={formData.patientInsuranceId}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.patientInsuranceId ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.patientInsuranceId && (
                  <p className="mt-1 text-sm text-red-600">{errors.patientInsuranceId}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="insurerName" className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Provider
                </label>
                <select
                  id="insurerName"
                  name="insurerName"
                  value={formData.insurerName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.insurerName ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select Insurance Provider</option>
                  <option value="Blue Cross Blue Shield">Blue Cross Blue Shield</option>
                  <option value="Aetna">Aetna</option>
                  <option value="UnitedHealthcare">UnitedHealthcare</option>
                  <option value="Cigna">Cigna</option>
                  <option value="Humana">Humana</option>
                  <option value="Medicare Part D">Medicare Part D</option>
                </select>
                {errors.insurerName && (
                  <p className="mt-1 text-sm text-red-600">{errors.insurerName}</p>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-800 mb-4">Prescription Information</h2>
              
              <div className="mb-4">
                <label htmlFor="drugName" className="block text-sm font-medium text-gray-700 mb-1">
                  Drug Name
                </label>
                <input
                  type="text"
                  id="drugName"
                  name="drugName"
                  value={formData.drugName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.drugName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.drugName && (
                  <p className="mt-1 text-sm text-red-600">{errors.drugName}</p>
                )}
              </div>
              
              <div className="mb-4">
                <label htmlFor="ndc" className="block text-sm font-medium text-gray-700 mb-1">
                  NDC (Optional)
                </label>
                <input
                  type="text"
                  id="ndc"
                  name="ndc"
                  value={formData.ndc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.quantity ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="daysSupply" className="block text-sm font-medium text-gray-700 mb-1">
                    Days Supply
                  </label>
                  <input
                    type="text"
                    id="daysSupply"
                    name="daysSupply"
                    value={formData.daysSupply}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md ${errors.daysSupply ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.daysSupply && (
                    <p className="mt-1 text-sm text-red-600">{errors.daysSupply}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="prescriberId" className="block text-sm font-medium text-gray-700 mb-1">
                  Prescriber ID (Optional)
                </label>
                <input
                  type="text"
                  id="prescriberId"
                  name="prescriberId"
                  value={formData.prescriberId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="amountBilled" className="block text-sm font-medium text-gray-700 mb-1">
                  Amount Billed ($)
                </label>
                <input
                  type="text"
                  id="amountBilled"
                  name="amountBilled"
                  value={formData.amountBilled}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${errors.amountBilled ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.amountBilled && (
                  <p className="mt-1 text-sm text-red-600">{errors.amountBilled}</p>
                )}
              </div>
            </div>
          </div>
          
          {validationResult && (
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">AI Validation Results</h2>
              
              {validationResult.warnings.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-md font-medium text-yellow-800 mb-2">Warnings</h3>
                  <ul className="list-disc pl-5 text-yellow-700 bg-yellow-50 p-3 rounded-md">
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {validationResult.suggestions.length > 0 && (
                <div>
                  <h3 className="text-md font-medium text-blue-800 mb-2">Suggestions</h3>
                  <ul className="list-disc pl-5 text-blue-700 bg-blue-50 p-3 rounded-md">
                    {validationResult.suggestions.map((suggestion, index) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          
          <div className="flex justify-end">
            {validationResult ? (
              <>
                <button
                  type="button"
                  onClick={() => setValidationResult(null)}
                  className="px-4 py-2 mr-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Back to Edit
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                </button>
              </>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Validating...' : 'Validate Claim'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
