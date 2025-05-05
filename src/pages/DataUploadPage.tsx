import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { FileText, Upload, AlertCircle, Check, RefreshCw } from "lucide-react";

const DataUploadPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const fileType = selectedFile.type;

      // Validate file type (only CSV or XLSX)
      if (
        fileType !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        fileType !== "text/csv"
      ) {
        alert("Please upload a CSV or XLSX file.");
        return;
      }

      setFile(selectedFile);
      setUploadSuccess(false); // Reset success status
      setErrorMessage(null); // Reset error message
    }
  };

  // Handle drag over event
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  // Handle drag leave event
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  // Handle file drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setUploadSuccess(false);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error: any) {
      setUploadSuccess(false);
      setErrorMessage(
        error.response?.data?.error || "An error occurred during file upload."
      );
    }
  };

  // Open file input selector
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Upload Student Data
      </h1>
      <p className="text-gray-600 mb-8">
        Upload your CSV/XLSX file with student data or generate demo data.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card title="Upload CSV/XLSX File">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : uploadSuccess
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv, .xlsx"
                className="hidden"
              />

              {uploadSuccess ? (
                <div className="text-center text-green-600 animate-fade-in">
                  <Check className="h-8 w-8 text-green-500 mx-auto" />
                  <h3 className="text-lg font-medium">Upload Successful!</h3>
                  <p className="mt-2">Redirecting to dashboard...</p>
                </div>
              ) : file ? (
                <div>
                  <FileText className="h-6 w-6 text-blue-500 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">{file.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {(file.size / 1024).toFixed(2)} KB • CSV/XLSX file
                  </p>
                  <Button
                    onClick={handleUpload}
                    icon={<Upload className="h-4 w-4" />}
                  >
                    Upload File
                  </Button>
                  <button
                    onClick={() => setFile(null)}
                    className="ml-3 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="h-6 w-6 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-medium">
                    Drop your CSV/XLSX file here
                  </h3>
                  <p className="text-sm text-gray-500 mb-5">
                    or{" "}
                    <button
                      className="text-blue-600 hover:text-blue-800 underline"
                      onClick={openFileSelector}
                    >
                      browse
                    </button>{" "}
                    to select
                  </p>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start text-red-700">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </Card>
        </div>

        <div className="md:col-span-1">
          <Card title="Demo Data">
            <div className="text-center py-3">
              <RefreshCw className="h-5 w-5 text-teal-500 mx-auto mb-3" />
              <h3 className="text-md font-medium">Generate Demo Dataset</h3>
              <p className="text-sm text-gray-600 mb-4">
                Don't have a CSV file? Use our demo data to test the
                application.
              </p>
              <Button variant="secondary" fullWidth>
                Generate Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DataUploadPage;
