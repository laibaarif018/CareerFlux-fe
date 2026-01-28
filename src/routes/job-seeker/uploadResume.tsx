import { createFileRoute, useNavigate, useRouter } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { useUploadResume } from '@/queries/resume.queries'

import { showError,showToast } from '@/utils/swal'

function UploadModalRoute() {
  const [isOpen, setIsOpen] = useState(true)
  const router = useRouter()

  const handleClose = () => {
    setIsOpen(false)
    router.history.back()
  }

  return <UploadModal isOpen={isOpen} onClose={handleClose} />
}

export const Route = createFileRoute('/job-seeker/uploadResume')({
 
  component: UploadModalRoute,
})

function UploadModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const navigate = useNavigate()
  const uploadResumeMutation = useUploadResume()

  if (!isOpen) return null

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0]
      const validTypes = ['application/pdf']
      if (validTypes.includes(selectedFile.type)) {
        setFile(selectedFile)
        setProgress(0)
      } else {
        alert('Please upload a PDF or Word document (.pdf, .doc, .docx)')
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files?.[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ]
      if (validTypes.includes(droppedFile.type)) {
        setFile(droppedFile)
        setProgress(0)
      } else {
        alert('Please upload a PDF or Word document (.pdf, .doc, .docx)')
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

 const handleUpload = async () => {
  if (!file) {
    showToast('Please select a file first', 'warning')
    return
  }

  setIsUploading(true)
  setProgress(0)

  uploadResumeMutation.mutate(
    {
      file,
      onProgress: (percent) => {
        setProgress(percent)
      },
    },
    {
      onSuccess: (res) => {
        const resumeId = res.payload.resumeId

        showToast('Resume uploaded successfully', 'success')

        setIsUploading(false)
        setProgress(0)

        navigate({
          to: '/job-seeker/parsedResume/$resumeId',
          params: { resumeId },
        })
      },
      onError: (error: any) => {
        showError(
          'Upload Failed',
          error?.response?.data?.message ||
            error?.message ||
            'Resume upload failed. Please try again.',
        )

        setIsUploading(false)
        setProgress(0)
      },
    },
  )
}

  const handleRemoveFile = () => {
    setFile(null)
    setProgress(0)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/70 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700">
        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Upload Your Resume
              </h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Add a new resume to be analyzed by our AI-powered system.
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Drag & Drop Area */}
          <div
            className={`relative flex flex-col items-center justify-center w-full px-6 py-12 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
              isDragging
                ? 'border-teal-600 dark:border-teal-400 bg-teal-50 dark:bg-teal-900/20'
                : file
                  ? 'border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/10'
                  : 'border-slate-300 dark:border-slate-600 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  file
                    ? 'bg-teal-100 dark:bg-teal-900/30'
                    : 'bg-teal-100 dark:bg-teal-900/30'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-4xl ${
                    file
                      ? 'text-teal-600 dark:text-teal-400'
                      : 'text-teal-600 dark:text-teal-400'
                  }`}
                >
                  {file ? 'check_circle' : 'cloud_upload'}
                </span>
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">
                {file ? 'File selected!' : 'Drag & drop your resume here'}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {file ? 'Click to change file' : 'or click to browse'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="sr-only"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx"
            />
          </div>

          {/* File Preview */}
          {file && (
            <div className="mt-6 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-teal-600 dark:text-teal-400">
                      description
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                {!isUploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile()
                    }}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label="Remove file"
                  >
                    <span className="material-symbols-outlined text-lg">
                      close
                    </span>
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              {progress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                    <span>
                      {progress < 100
                        ? 'Uploading...'
                        : 'Upload complete! Navigating...'}
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-600 dark:bg-teal-500 h-2 rounded-full transition-all duration-300 relative overflow-hidden"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Add shimmer effect to progress bar */}
                      {progress < 100 && (
                        <div className="absolute inset-0 animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="inline-flex items-center justify-center gap-2 rounded-lg h-11 px-5 bg-teal-600 text-white text-sm font-bold shadow-lg shadow-teal-600/20 hover:bg-teal-700 active:bg-teal-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">
                    progress_activity
                  </span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">
                    upload
                  </span>
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
