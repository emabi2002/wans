'use client';

import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, Film, Image, FileText } from 'lucide-react';

interface UploadFile {
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  id: string;
}

export default function UploadContent() {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    creator: '',
    genre: '',
    releaseDate: '',
    rating: 'PG-13',
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      file,
      progress: 0,
      status: 'uploading' as const,
      id: Math.random().toString(36).substr(2, 9),
    }));

    setFiles(prev => [...prev, ...uploadFiles]);

    // Simulate upload progress
    uploadFiles.forEach(uploadFile => {
      simulateUpload(uploadFile.id);
    });
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId && file.progress < 100) {
          const newProgress = Math.min(file.progress + Math.random() * 30, 100);
          return {
            ...file,
            progress: newProgress,
            status: newProgress === 100 ? 'complete' : 'uploading',
          };
        }
        return file;
      }));
    }, 500);

    setTimeout(() => clearInterval(interval), 5000);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('video/')) return <Film className="h-8 w-8 text-red-600" />;
    if (file.type.startsWith('image/')) return <Image className="h-8 w-8 text-blue-600" />;
    return <FileText className="h-8 w-8 text-gray-600" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Upload className="h-8 w-8 mr-3 text-red-600" />
          Upload Content
        </h1>
        <p className="text-gray-600 mt-2">Upload new films and videos to the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
              isDragging
                ? 'border-red-600 bg-red-50'
                : 'border-gray-300 hover:border-red-600 hover:bg-gray-50'
            }`}
          >
            <Upload className={`h-16 w-16 mx-auto mb-4 ${isDragging ? 'text-red-600' : 'text-gray-400'}`} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {isDragging ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">or</p>
            <label className="inline-block">
              <span className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer">
                Browse Files
              </span>
              <input
                type="file"
                multiple
                accept="video/*,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            <p className="text-xs text-gray-500 mt-4">
              Supported formats: MP4, MOV, AVI, MKV (max 5GB per file)
            </p>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-lg font-bold text-gray-900">Uploading Files ({files.length})</h2>
              </div>
              <div className="divide-y">
                {files.map(uploadFile => (
                  <div key={uploadFile.id} className="p-6">
                    <div className="flex items-start gap-4">
                      {getFileIcon(uploadFile.file)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {uploadFile.file.name}
                          </p>
                          <button
                            onClick={() => removeFile(uploadFile.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {formatFileSize(uploadFile.file.size)}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                uploadFile.status === 'complete'
                                  ? 'bg-green-600'
                                  : uploadFile.status === 'error'
                                  ? 'bg-red-600'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${uploadFile.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-12">
                            {Math.round(uploadFile.progress)}%
                          </span>
                        </div>
                        {uploadFile.status === 'complete' && (
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-xs text-green-600 font-medium">Upload complete</span>
                          </div>
                        )}
                        {uploadFile.status === 'error' && (
                          <div className="flex items-center gap-2 mt-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <span className="text-xs text-red-600 font-medium">Upload failed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content Details Form */}
        <div className="bg-white rounded-lg shadow p-6 h-fit sticky top-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Content Details</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Enter film title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Enter film description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creator/Studio *
              </label>
              <input
                type="text"
                value={formData.creator}
                onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Enter creator name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genre
              </label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="">Select genre</option>
                <option value="action">Action</option>
                <option value="drama">Drama</option>
                <option value="comedy">Comedy</option>
                <option value="documentary">Documentary</option>
                <option value="thriller">Thriller</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Release Date
              </label>
              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="G">G - General Audiences</option>
                <option value="PG">PG - Parental Guidance</option>
                <option value="PG-13">PG-13 - Parents Strongly Cautioned</option>
                <option value="R">R - Restricted</option>
                <option value="NC-17">NC-17 - Adults Only</option>
              </select>
            </div>

            <div className="pt-4 space-y-3">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Publish Content
              </button>
              <button
                type="button"
                className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Save as Draft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
