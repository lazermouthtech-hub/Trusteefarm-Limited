import React from 'react';
import { Camera, UploadCloud, File as FileIcon, Loader2, X, Wand2, Download } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { classNames } from '../lib/utils';
import { OcrUploadHistoryItem } from '../types';

type OcrStep = 'select' | 'preview' | 'loading' | 'result' | 'error';

interface AdminOCRProps {
  history: OcrUploadHistoryItem[];
  onUploadSuccess: (logData: Omit<OcrUploadHistoryItem, 'id'>) => void;
}

const AdminOCR = ({ history, onUploadSuccess }: AdminOCRProps) => {
    const [step, setStep] = React.useState<OcrStep>('select');
    const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
    const [filePreview, setFilePreview] = React.useState<string | null>(null);
    const [extractedData, setExtractedData] = React.useState<Record<string, any>[] | null>(null);
    const [rawText, setRawText] = React.useState<string>('');
    const [error, setError] = React.useState<string | null>(null);

    const resetState = () => {
        setStep('select');
        setSelectedFile(null);
        setFilePreview(null);
        setExtractedData(null);
        setRawText('');
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            processFile(file);
        }
    };
    
    const blobToBase64 = (blob: Blob): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const processFile = (file: File) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        
        if (allowedImageTypes.includes(file.type)) {
            setSelectedFile(file);
            const previewUrl = URL.createObjectURL(file);
            setFilePreview(previewUrl);
            setStep('preview');
            setError(null);
        } else if (file.type === 'application/pdf') {
            setSelectedFile(file);
            setFilePreview(null); // No preview for PDF
            setStep('preview');
            setError(null);
        } else {
            setError('Invalid file type. Please upload an image (JPEG, PNG) or a PDF.');
            setStep('error');
        }
    };

    const handleOcrProcess = async () => {
        if (!selectedFile) return;

        setStep('loading');
        setError(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const base64Data = await blobToBase64(selectedFile);
            
            const filePart = {
                inlineData: {
                    mimeType: selectedFile.type,
                    data: base64Data,
                },
            };

            const textPart = {
                text: `
                  Analyze the provided document (image or PDF). Extract information for each distinct person or entity found.
                  Return the data as a JSON array of objects.
                  Each object in the array should represent one person/entity and include the following fields if found:
                  - "name" (string)
                  - "phone" (string)
                  - "email" (string)
                  - "location" (string, e.g., city or region)
                  - "dateOfBirth" (string, in YYYY-MM-DD format)
                  - "nationalId" (string, e.g., from a Ghana Card)
                  - "farmName" (string)
                  
                  If a field is not present for an entity, omit it from that object.
                  If only one person is found, you MUST still return an array containing a single object.
                  If the document contains a table of people, create one JSON object for each row in the table.
                  Return ONLY the JSON array. Do not include any other text or markdown formatting.
                `
            };

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [filePart, textPart] },
            });
            
            let jsonText = response.text.trim();
            if (jsonText.startsWith('```json')) {
                jsonText = jsonText.substring(7, jsonText.length - 3).trim();
            } else if (jsonText.startsWith('```')) {
                jsonText = jsonText.substring(3, jsonText.length - 3).trim();
            }

            try {
                const parsedData = JSON.parse(jsonText);
                // Ensure data is always an array
                const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
                setExtractedData(dataArray);
                onUploadSuccess({
                    fileName: selectedFile.name,
                    date: new Date(),
                    status: 'Success',
                    recordsExtracted: dataArray.length,
                });
            } catch (parseError) {
                console.error("Failed to parse AI response as JSON:", parseError);
                setRawText(response.text); // Store raw text as fallback
                setExtractedData(null); // Ensure data is null on error
                setError("AI returned data in an unexpected format. Displaying raw text instead.");
                onUploadSuccess({
                    fileName: selectedFile.name,
                    date: new Date(),
                    status: 'Success',
                    recordsExtracted: 0,
                });
            }
            
            setStep('result');

        } catch (err: any) {
            console.error("Error during OCR process:", err);
            setError(err.message || "Failed to process the document with AI. Please try again.");
            setStep('error');
             onUploadSuccess({
                fileName: selectedFile!.name,
                date: new Date(),
                status: 'Failed',
                recordsExtracted: 0,
            });
        }
    };

    const convertToCSV = (data: Record<string, any>[]): string => {
        if (!data || data.length === 0) return '';
    
        // Define the canonical headers in the desired order to ensure consistency.
        const canonicalHeaders = [
            "name", "phone", "email", "location", "dateOfBirth", "nationalId", "farmName"
        ];
        
        // Find any extra headers that might have been returned by the AI.
        const allKeys = new Set<string>();
        data.forEach(record => {
            if (record && typeof record === 'object') {
                Object.keys(record).forEach(key => allKeys.add(key));
            }
        });

        const extraHeaders = Array.from(allKeys).filter(key => !canonicalHeaders.includes(key));
        
        const headers = [...canonicalHeaders, ...extraHeaders];
    
        const headerRow = headers.join(',');
    
        const valueRows = data.map(record => {
             if (!record || typeof record !== 'object') return '';
            return headers.map(header => {
                const value = record[header];
                let escapedValue = String(value ?? '');
                
                escapedValue = escapedValue.replace(/"/g, '""');
    
                if (escapedValue.includes(',') || escapedValue.includes('\n') || escapedValue.includes('"')) {
                    escapedValue = `"${escapedValue}"`;
                }
                return escapedValue;
            }).join(',');
        });
    
        return [headerRow, ...valueRows].join('\n');
    };

    const handleDownloadCsv = () => {
        if (!extractedData) return;

        const csvString = convertToCSV(extractedData);
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedFile?.name.split('.')[0]}_extracted.csv` || 'extracted_data.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };


    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-lg shadow-lg space-y-6">
                <div className="text-center">
                    <Camera className="mx-auto h-12 w-12 text-primary-600" />
                    <h2 className="mt-4 text-2xl font-bold text-gray-800">OCR Bulk Upload</h2>
                    <p className="text-gray-500 mt-1">Upload an image or PDF to extract farmer data using AI.</p>
                </div>

                {step === 'select' && (
                    <div 
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary-500 transition-colors"
                    >
                        <input type="file" id="ocr-upload" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                        <label htmlFor="ocr-upload" className="cursor-pointer">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-2 text-sm text-gray-600">
                                <span className="font-semibold text-primary-600">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">Images (PNG, JPG) or PDF documents</p>
                        </label>
                    </div>
                )}
                
                {step === 'preview' && selectedFile && (
                    <div className="text-center space-y-4">
                        <div className="bg-gray-100 p-4 rounded-lg inline-block border">
                            {filePreview ? (
                                <img src={filePreview} alt="Preview" className="max-h-64 rounded-md shadow-sm" />
                            ) : (
                                <div className="w-64 h-64 flex flex-col items-center justify-center bg-gray-200 rounded-md">
                                    <FileIcon className="h-20 w-20 text-gray-500" />
                                </div>
                            )}
                            <p className="mt-2 text-sm font-medium text-gray-700">{selectedFile.name}</p>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button onClick={resetState} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md">
                                Cancel
                            </button>
                            <button onClick={handleOcrProcess} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md flex items-center">
                                <Wand2 className="h-5 w-5 mr-2"/>
                                Process with AI
                            </button>
                        </div>
                    </div>
                )}
                
                {step === 'loading' && (
                    <div className="text-center py-12">
                        <Loader2 className="mx-auto h-12 w-12 text-primary-600 animate-spin" />
                        <p className="mt-4 text-lg font-semibold text-gray-700">Extracting & Formatting Data...</p>
                        <p className="text-sm text-gray-500">The AI is analyzing your document.</p>
                    </div>
                )}
                
                {step === 'result' && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">Extracted Data</h3>
                        {extractedData ? (
                            <>
                                <pre className="w-full p-4 font-mono text-sm bg-gray-900 text-green-300 border border-gray-600 rounded-md max-h-96 overflow-y-auto">
                                    <code>{JSON.stringify(extractedData, null, 2)}</code>
                                </pre>
                                <div className="flex space-x-4">
                                    <button onClick={handleDownloadCsv} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md flex items-center">
                                        <Download className="h-5 w-5 mr-2"/>
                                        Download CSV
                                    </button>
                                    <button onClick={resetState} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md">
                                        Upload Another
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-yellow-800 bg-yellow-50 p-3 rounded-md border border-yellow-200">{error}</p>
                                <textarea
                                    value={rawText}
                                    readOnly
                                    rows={15}
                                    className="w-full p-3 font-mono text-sm bg-gray-900 text-yellow-300 border border-gray-600 rounded-md"
                                />
                                <button onClick={resetState} className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-md">
                                    Upload Another
                                </button>
                            </>
                        )}
                    </div>
                )}

                {(step === 'error' && error) && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0"><X className="h-5 w-5 text-red-400" /></div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                                <button onClick={resetState} className="mt-2 text-sm font-medium text-red-800 hover:text-red-600">Try again</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
             {history && history.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">OCR Upload History</h3>
                    <div className="max-h-96 overflow-y-auto border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Records Extracted</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {history.map(item => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.fileName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'Success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{item.recordsExtracted}</td>
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

export default AdminOCR;