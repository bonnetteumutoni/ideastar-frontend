'use client';
import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaPlus } from 'react-icons/fa';
import Head from 'next/head';
import Navigation from '../sharedComponents/Navigation';
import { BsStars } from "react-icons/bs";
import { useRouter } from 'next/navigation';
const PROJECT_FIELD_CHOICES = [
  { value: 'TECH', label: 'Technology' },
  { value: 'AGRI', label: 'Agriculture' },
  { value: 'FASH', label: 'Fashion' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'EDU', label: 'Education' },
  { value: 'FIN', label: 'Finance' },
];

export default function NewProject() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [country, setCountry] = useState('');
  const [field, setField] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [products, setProducts] = useState<File[]>([]);
  const [documents, setDocuments] = useState<File[]>([]);
  const [countries, setCountries] = useState<{code: string, name: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserData = localStorage.getItem('user');
    if (storedUserData) {
      try {
        const userData = JSON.parse(storedUserData);
        if (userData.id) {
          setUserId(userData.id);
        }
      } catch (error) {
        setSubmitError("Error retrieving user information. Please log in again.");
      }
    } else {
      setSubmitError("User not logged in. Please log in to create a project.");
    }
    
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2');
        if (response.ok) {
          const data = await response.json();
          const countryList = data.map((country: any) => ({
            code: country.cca2,
            name: country.name.common
          })).sort((a: any, b: any) => a.name.localeCompare(b.name));
          setCountries(countryList);
        }
      } catch (error) {
      }
    };

    fetchCountries();
  }, []);

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleProductsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setProducts([...products, ...filesArray]);
    }
  };

  const handleDocumentsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setDocuments([...documents, ...filesArray]);
    }
  };

  const handleSaveProject = async () => {
    setIsLoading(true);
    setSubmitError(null);
    setSuccessMessage(null);
    if (!projectName || !projectDescription || !country || !field || !coverImage) {
      setSubmitError("Please fill in all required fields and upload a cover image");
      setIsLoading(false);
      return;
    }
    if (!userId) {
      setSubmitError("User ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('project_name', projectName);
      formData.append('project_description', projectDescription);
      formData.append('project_location', country);
      formData.append('project_field', field);
      formData.append('user', userId.toString());

      if (coverImage) {
        formData.append('cover_image', coverImage);
      }
      
      products.forEach((file) => {
        formData.append('project_products', file);
      });
      
      documents.forEach((file) => {
        formData.append('project_document', file);
      });

      const response = await fetch('/api/projects/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create project: ${response.statusText}`);
      }

      const result = await response.json();
      setSuccessMessage("Project created successfully!");
      setProjectName('');
      setProjectDescription('');
      setCountry('');
      setField('');
      setCoverImage(null);
      setProducts([]);
      setDocuments([]);
      setTimeout(() => {
        router.push('/projects');
      }, 2000);
      
    } catch (error) {
      setSubmitError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navigation/>
      <Head>
        <title>New Project</title>
        <meta name="description" content="Create a new project" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#2F5A2B] mb-1 mt-4">New Project</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  Name of the project
                </label>
                <input
                  type="text"
                  id="projectName"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter project name"
                  required
                />
              </div>

              <div>
                <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your project"
                  required
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="field" className="block text-sm font-medium text-gray-700 mb-2">
                  Field
                </label>
                <select
                  id="field"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a field</option>
                  {PROJECT_FIELD_CHOICES.map((field) => (
                    <option key={field.value} value={field.value}>
                      {field.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Cover Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="coverImage"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="hidden"
                    required
                  />
                  <label htmlFor="coverImage" className="cursor-pointer">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-[#AC7A15] mb-2" />
                    <p className="text-sm text-gray-600">
                      {coverImage ? coverImage.name : "Click to upload cover image"}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Products of Projects
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="products"
                    multiple
                    onChange={handleProductsUpload}
                    className="hidden"
                  />
                  <label htmlFor="products" className="cursor-pointer">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-[#AC7A15] mb-2" />
                    <p className="text-sm text-gray-600">
                      {products.length > 0 
                        ? `${products.length} file(s) selected` 
                        : "Click to upload product files"}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="documents"
                    multiple
                    onChange={handleDocumentsUpload}
                    className="hidden"
                  />
                  <label htmlFor="documents" className="cursor-pointer">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-[#AC7A15] mb-2" />
                    <p className="text-sm text-gray-600">
                      {documents.length > 0 
                        ? `${documents.length} file(s) selected` 
                        : "Click to upload documents"}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {submitError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {submitError}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              {successMessage}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <BsStars className='h-7 w-7 mt-2 mr-2 text-[#AC7A15]'/>
            <button
              onClick={handleSaveProject}
              disabled={isLoading}
              className="px-6 py-3 bg-[#2F5A2B] text-white font-medium rounded-md hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            > 
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}