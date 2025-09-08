import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Tesseract from 'tesseract.js';
import { Upload, X, FileImage, Loader2, CheckCircle, AlertCircle, Camera, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ImageUpload = ({ onTextExtracted, maxFiles = 2, maxSize = 5 * 1024 * 1024 }) => {
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();
  }, []);

  // Mobile image optimization function
  const optimizeImageForMobile = async (file) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Resize image to max 1200px width for mobile OCR
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Draw resized image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert back to blob
        canvas.toBlob((blob) => {
          const optimizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(optimizedFile);
        }, file.type, 0.8); // 80% quality
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(file => {
        if (file.errors[0]?.code === 'file-too-large') {
          return 'File is too large (max 5MB)';
        }
        if (file.errors[0]?.code === 'file-invalid-type') {
          return 'Invalid file type (PNG, JPG, WebP only)';
        }
        return 'File rejected';
      });
      
      toast({
        variant: "destructive",
        title: "File Upload Error",
        description: errors.join(', '),
      });
      return;
    }

    // Check if adding these files would exceed maxFiles limit
    if (uploadedFiles.length + acceptedFiles.length > maxFiles) {
      toast({
        variant: "destructive",
        title: "Too Many Files",
        description: `Maximum ${maxFiles} files allowed`,
      });
      return;
    }

    setIsProcessing(true);
    const newFiles = [];

    for (let i = 0; i < acceptedFiles.length; i++) {
      const file = acceptedFiles[i];
      const fileId = `${file.name}-${Date.now()}-${i}`;
      
      // Add file to state immediately
      const fileData = {
        id: fileId,
        file,
        name: file.name,
        size: file.size,
        preview: URL.createObjectURL(file),
        status: 'processing',
        extractedText: '',
        error: null
      };
      
      newFiles.push(fileData);
      setUploadedFiles(prev => [...prev, fileData]);

      // Process OCR with mobile optimizations
      try {
        setProcessingProgress(prev => ({ ...prev, [fileId]: 0 }));
        
        // Mobile optimization: reduce image size for faster processing
        let processedFile = file;
        if (isMobile && file.size > 1024 * 1024) { // If file > 1MB on mobile
          processedFile = await optimizeImageForMobile(file);
        }
        
        const { data: { text } } = await Tesseract.recognize(processedFile, 'eng', {
          logger: m => {
            if (m.status === 'recognizing text') {
              setProcessingProgress(prev => ({ 
                ...prev, 
                [fileId]: Math.round(m.progress * 100) 
              }));
            }
          },
          // Mobile optimizations
          ...(isMobile && {
            tessedit_pageseg_mode: '6', // Uniform block of text
            tessedit_ocr_engine_mode: '1', // Neural nets LSTM engine only
          })
        });

        // Update file with extracted text
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'completed', extractedText: text.trim() }
            : f
        ));

        // Call parent callback with extracted text
        if (onTextExtracted) {
          onTextExtracted(text.trim(), file.name);
        }

        toast({
          title: "Text Extracted! 📸",
          description: `Successfully extracted text from ${file.name}`,
        });

      } catch (error) {
        console.error('OCR Error:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === fileId 
            ? { ...f, status: 'error', error: 'Failed to extract text' }
            : f
        ));

        toast({
          variant: "destructive",
          title: "OCR Failed",
          description: `Could not extract text from ${file.name}`,
        });
      }
    }

    setIsProcessing(false);
  }, [uploadedFiles.length, maxFiles, onTextExtracted, toast, isMobile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp']
    },
    maxSize,
    maxFiles: maxFiles - uploadedFiles.length,
    disabled: isProcessing || uploadedFiles.length >= maxFiles
  });

  const removeFile = (fileId) => {
    setUploadedFiles(prev => {
      const file = prev.find(f => f.id === fileId);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const clearAllFiles = () => {
    uploadedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setUploadedFiles([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileImage className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-purple-400 bg-purple-50 dark:bg-purple-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          }
          ${isProcessing || uploadedFiles.length >= maxFiles 
            ? 'opacity-50 cursor-not-allowed' 
            : ''
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center">
          {isMobile ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <Camera className="h-8 w-8 text-purple-400" />
                <ImageIcon className="h-8 w-8 text-purple-400" />
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tap to select photos
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                From your camera or photo library
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isDragActive 
                  ? 'Drop images here...' 
                  : 'Upload images or drag & drop'
                }
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                PNG, JPG, WebP up to 5MB each
              </p>
            </>
          )}
          <p className="text-xs text-gray-400 mt-1">
            {uploadedFiles.length}/{maxFiles} files uploaded
          </p>
        </div>
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Uploaded Images ({uploadedFiles.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFiles}
              disabled={isProcessing}
            >
              Clear All
            </Button>
          </div>

          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-12 w-12 object-cover rounded"
                />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </p>
                {file.status === 'processing' && (
                  <div className="mt-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${processingProgress[file.id] || 0}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">
                        {processingProgress[file.id] || 0}%
                      </span>
                    </div>
                  </div>
                )}
                {file.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">{file.error}</p>
                )}
                {file.status === 'completed' && file.extractedText && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Text extracted ({file.extractedText.length} characters)
                  </p>
                )}
              </div>

              {/* Status & Actions */}
              <div className="flex items-center space-x-2">
                {getStatusIcon(file.status)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Processing Indicator */}
      {isProcessing && (
        <div className="flex items-center justify-center space-x-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="text-sm text-blue-700 dark:text-blue-300">
            Extracting text from images...
          </span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;