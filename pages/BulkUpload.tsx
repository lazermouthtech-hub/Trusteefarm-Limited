
import React from 'react';
import { GoogleGenAI } from "@google/genai";
import { UploadCloud, FileText, CheckCircle, AlertTriangle, Loader2, Wand2, ArrowRight } from 'lucide-react';
import { Farmer, FarmerStatus, Produce, ProduceCategory, ProduceStatus } from '../../types';

interface BulkUploadProps {
  onAddFarmers: (newFarmers: Farmer[]) => void;
}

type UploadStep = 'select' | 'mapping' | 'review_mapping' | 'preview' | 'error' | 'success';

interface UploadHistoryItem {
    id: number;
    fileName: string;
    date: Date;
    status: 'Success' | 'Failed';
    recordsAdded: number;
}

const SYSTEM_FIELDS = [
    { key: 'name', label: 'Farmer Name', required: false },
    { key: 'location', label: 'Location / Region', required: false },
    { key: 'phone', label: 'Phone Number', required: true },
    { key: 'cropType', label: 'Crop Type', required: false },
    { key: 'farmSize', label: 'Farm Size (acres)', required: false },
    { key: 'harvestTime', label: 'Harvest Time', required: false },
    { key: 'email', label: 'Email Address', required: false },
    { key: 'farmName', label: 'Farm Name', required: false },
];

const BulkUpload = ({ onAddFarmers }: BulkUploadProps) => {
  const [farmers, setFarmers] = React.useState<Farmer[]>([]);
  const [uploadStep, setUploadStep] = React.useState<UploadStep>('select');
  const [error, setError] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [uploadHistory, setUploadHistory] = React.useState<UploadHistoryItem[]>([]);
  
  const [columnMap, setColumnMap] = React.useState<Record<string, string | null>>({});
  const [originalHeaders, setOriginalHeaders] = React.useState<string[]>([]);
  const [fileContent, setFileContent] = React.useState<string>('');

  const resetState = () => {
    setFarmers([]);
    setUploadStep('select');
    setError(null);
    setFileName(null);
    setColumnMap({});
    setOriginalHeaders([]);
    setFileContent('');
  };

  const parseFarmersWithMap = (csvData: string, map: Record<string, string | null>, headers: string[]): Farmer[] => {
    const lines = csvData.split('\n').slice(1).filter(line => line.trim() !== '');
    
    const fieldIndices: Record<string, number> = {};
    for (const field in map) {
        if (map[field]) {
            fieldIndices[field] = headers.indexOf(map[field] as string);
        }
    }
    
    for (const field of SYSTEM_FIELDS.filter(f => f.required)) {
        if (!map[field.key] || fieldIndices[field.key] === -1) {
            throw new Error(`A mapping for the required field '${field.label}' is missing.`);
        }
    }

    return lines.map((line, index) => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        
        const phone = fieldIndices.phone > -1 ? values[fieldIndices.phone] : undefined;

        if (!phone || phone.trim() === '') {
            console.warn(`Skipping row ${index + 2}: missing required phone number.`);
            return null;
        }

        const name = (fieldIndices.name > -1 ? values[fieldIndices.name] : undefined) || 'TBD';
        const location = (fieldIndices.location > -1 ? values[fieldIndices.location] : undefined) || 'TBD';
        
        const cropType = fieldIndices.cropType > -1 ? values[fieldIndices.cropType] : undefined;
        const harvestTimeStr = fieldIndices.harvestTime > -1 ? values[fieldIndices.harvestTime] : undefined;
        
        let harvestDate: Date | undefined = undefined;
        if (harvestTimeStr) {
            const parsedDate = new Date(harvestTimeStr);
            if (!isNaN(parsedDate.getTime())) {
                harvestDate = parsedDate;
            }
        }

        const newProduces: Produce[] = [];
        if (cropType) {
            newProduces.push({
                id: `prod_bulk_${new Date().getTime()}_${index}`,
                name: cropType,
                variety: 'Unspecified',
                category: ProduceCategory.Grains, // Defaulting to a common category
                status: harvestDate && harvestDate > new Date() ? ProduceStatus.UpcomingHarvest : ProduceStatus.ReadyForSale,
                quantity: 0,
                unit: 'kg',
                availableFrom: new Date(),
                expectedHarvestDate: harvestDate,
                photos: [`https://api.dicebear.com/8.x/icons/svg?seed=${cropType}`],
                isOrganic: false,
                dateAdded: new Date(),
            });
        }

        const newFarmer: Farmer = {
          id: `bulk_${new Date().getTime()}_${index}`,
          name: name,
          location: location,
          phone: phone,
          status: FarmerStatus.PendingReview,
          profilePhoto: `https://api.dicebear.com/8.x/initials/svg?seed=${name === 'TBD' ? phone : name}`,
          registrationDate: new Date(),
          produces: newProduces,
          profileCompleteness: 0.3,
          buyerRating: 0,
          successfulTransactions: 0,
          phoneVerified: false,
          identityVerified: false,
          bankAccountVerified: false,
          email: fieldIndices.email > -1 ? values[fieldIndices.email] : undefined,
          farmName: fieldIndices.farmName > -1 ? values[fieldIndices.farmName] : undefined,
          farmSize: fieldIndices.farmSize > -1 ? parseFloat(values[fieldIndices.farmSize]) : undefined,
        };
        return newFarmer;
    }).filter((f): f is Farmer => f !== null);
  };

  const runAiMapping = async (csvContent: string) => {
    try {
        const lines = csvContent.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        setOriginalHeaders(headers);
        
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `
            You are an intelligent data mapping assistant for an agricultural platform in Ghana. Your task is to map CSV headers to the system's predefined fields.
            The system fields are: 'name', 'location', 'phone', 'cropType', 'farmSize', 'harvestTime', 'email', 'farmName'.
            The user has uploaded a CSV with these headers: [${headers.join(', ')}]
            Return a JSON object that maps each system field to the most appropriate header from the user's CSV.
            - The keys must be the system field names.
            - The values must be the corresponding header from the user's CSV.
            - If a field cannot be mapped, its value should be null.
            - Be flexible (e.g., 'Full Name' or 'Farmer Name' maps to 'name'; 'Region' maps to 'location'; 'Crop' or 'Product' maps to 'cropType'; 'Acres' maps to 'farmSize'; 'Harvest Date' maps to 'harvestTime').
            Return ONLY the JSON object.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });

        // FIX: The Gemini API may return JSON wrapped in markdown backticks. This removes them before parsing.
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7, jsonText.length - 3).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.substring(3, jsonText.length - 3).trim();
        }
        const columnMapResult = JSON.parse(jsonText);
        setColumnMap(columnMapResult);
        setUploadStep('review_mapping');

    } catch(err: any) {
        console.error("Error during AI mapping:", err);
        setError(err.message || "AI could not map columns. Please map them manually.");
        setColumnMap({});
        setUploadStep('review_mapping');
    }
  };

  const handleFileRead = (content: string, name: string) => {
    setFileName(name);
    setFileContent(content);
    setUploadStep('mapping');
    setError(null);
    runAiMapping(content);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size exceeds the 50MB limit.");
        setUploadStep('error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleFileRead(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && (file.type === 'text/csv' || file.name.endsWith('.csv'))) {
      if (file.size > 50 * 1024 * 1024) {
        setError("File size exceeds the 50MB limit.");
        setUploadStep('error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        handleFileRead(event.target?.result as string, file.name);
      };
      reader.readAsText(file);
    } else {
        setError('Please drop a valid CSV file.');
        setUploadStep('error');
    }
  };
  
  const handleConfirmMappingAndPreview = () => {
    try {
        const parsedFarmers = parseFarmersWithMap(fileContent, columnMap, originalHeaders);
        if (parsedFarmers.length === 0) {
            throw new Error("No valid farmer records could be parsed with the selected mapping. Please check the file content and your mapping selections.");
        }
        setFarmers(parsedFarmers);
        setUploadStep('preview');
    } catch (err: any) {
        setError(err.message);
        setUploadStep('error');
    }
  };

  const handleSubmit = () => {
    onAddFarmers(farmers);
    setUploadHistory(prev => [{
        id: Date.now(),
        fileName: fileName || 'Unknown file',
        date: new Date(),
        status: 'Success',
        recordsAdded: farmers.length,
    }, ...prev]);
    setUploadStep('success');
  };

  const isMappingValid = SYSTEM_FIELDS.filter(f => f.required).every(f => !!columnMap[f.key]);
  
  return (
    <div className="space-y-8">
      <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Bulk Farmer Upload</h2>
          <p className="text-gray-500 mt-1">Upload a CSV file to add multiple farmers. No record limit, max 50MB file size.</p>
        </div>

        {uploadStep === 'select' && (
          <div 
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
          >
              <input type="file" id="csv-upload" className="hidden" accept=".csv" onChange={handleFileChange} />
              <label htmlFor="csv-upload" className="cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">CSV file up to 50MB</p>
              </label>
          </div>
        )}

        {uploadStep === 'mapping' && (
            <div className="text-center py-12">
                <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
                <p className="mt-4 text-lg font-semibold text-gray-700">AI is mapping your columns...</p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
            </div>
        )}
        
        {uploadStep === 'review_mapping' && (
            <div className="space-y-4">
                <div className="text-center">
                    <Wand2 className="mx-auto h-8 w-8 text-primary-600" />
                    <h3 className="text-xl font-bold text-gray-800 mt-2">Review Column Mapping</h3>
                    <p className="text-gray-500">Our AI has suggested a mapping. Please review and correct if needed.</p>
                </div>
                <div className="space-y-3 pt-4 max-w-2xl mx-auto">
                    {SYSTEM_FIELDS.map(field => (
                        <div key={field.key} className="grid grid-cols-2 items-center gap-4">
                            <label className="text-sm font-medium text-gray-700 text-right">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>
                            <select
                                value={columnMap[field.key] || ''}
                                onChange={(e) => setColumnMap(prev => ({ ...prev, [field.key]: e.target.value || null }))}
                                className="block w-full pl-3 pr-10 py-2 text-base text-white bg-gray-700 border-gray-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                            >
                                <option value="" className="text-gray-400">-- Do not import --</option>
                                {originalHeaders.map(header => (
                                    <option key={header} value={header}>{header}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end pt-4 space-x-3 max-w-2xl mx-auto">
                    <button onClick={resetState} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button
                        onClick={handleConfirmMappingAndPreview}
                        disabled={!isMappingValid}
                        className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Confirm Mapping & Preview <ArrowRight className="ml-2 h-4 w-4"/>
                    </button>
                </div>
            </div>
        )}

        {uploadStep === 'error' && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0"><AlertTriangle className="h-5 w-5 text-red-400" /></div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                        <button onClick={resetState} className="mt-2 text-sm font-medium text-red-800 hover:text-red-600">Try with a different file</button>
                    </div>
                </div>
            </div>
        )}

        {uploadStep === 'success' && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                    <div className="flex-shrink-0"><CheckCircle className="h-5 w-5 text-green-400" /></div>
                    <div className="ml-3"><p className="text-sm text-green-700">Successfully added {farmers.length} farmers for review!</p></div>
                </div>
            </div>
        )}

        {uploadStep === 'preview' && (
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-md border">
              <FileText className="h-6 w-6 text-gray-500" />
              <span className="ml-3 font-medium text-gray-700">{fileName} - Previewing {farmers.length} valid records</span>
              <button onClick={resetState} className="ml-auto text-sm font-semibold text-red-600 hover:text-red-800">Cancel</button>
            </div>
            
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Crop Type</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {farmers.slice(0, 50).map(farmer => (
                    <tr key={farmer.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{farmer.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{farmer.produces[0]?.name || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {farmers.length > 50 && <p className="text-center p-2 bg-gray-50 text-sm text-gray-500">...and {farmers.length - 50} more rows.</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 border border-transparent rounded-md shadow-sm"
                >
                  Confirm and Add {farmers.length} Farmers
                </button>
            </div>
          </div>
        )}
      </div>

       {uploadHistory.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Upload History</h3>
            <div className="max-h-96 overflow-y-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records Added</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {uploadHistory.map(item => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.fileName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.recordsAdded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}
    </div>
  );
};

export default BulkUpload;
