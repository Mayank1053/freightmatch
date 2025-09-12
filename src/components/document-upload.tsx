"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useDropzone } from "react-dropzone"
import { Upload, File, X, Check, AlertCircle, Eye } from "lucide-react"

interface DocumentUploadProps {
  title: string
  description?: string
  acceptedTypes: string[]
  maxSize: number
  required?: boolean
  existingDocument?: {
    name: string
    status: "pending" | "approved" | "rejected"
    uploadDate: string
    url?: string
  }
  onUpload: (file: File) => void
}

export function DocumentUpload({
  title,
  description,
  acceptedTypes,
  maxSize,
  required = false,
  existingDocument,
  onUpload,
}: DocumentUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (file) {
        setIsUploading(true)
        setUploadProgress(0)

        // Simulate upload progress
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              setIsUploading(false)
              onUpload(file)
              return 100
            }
            return prev + 10
          })
        }, 200)
      }
    },
    [onUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4" />
      case "rejected":
        return <X className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          {required && (
            <Badge variant="destructive" className="text-xs">
              Required
            </Badge>
          )}
        </CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="space-y-4">
        {existingDocument ? (
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium">{existingDocument.name}</p>
                  <p className="text-sm text-muted-foreground">Uploaded on {existingDocument.uploadDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {existingDocument.url && (
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                )}
                <Badge className={getStatusColor(existingDocument.status)}>
                  {getStatusIcon(existingDocument.status)}
                  <span className="ml-1">{existingDocument.status}</span>
                </Badge>
              </div>
            </div>

            {existingDocument.status === "rejected" && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-sm text-red-800">Document rejected. Please upload a clear, valid document.</p>
              </div>
            )}
          </div>
        ) : (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-blue-400 bg-blue-50" : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto text-slate-400 mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop the file here...</p>
            ) : (
              <div className="space-y-2">
                <p className="text-slate-600">Drag & drop your document here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Accepted formats: {acceptedTypes.join(", ")} • Max size: {maxSize / 1024 / 1024}MB
                </p>
              </div>
            )}
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {!existingDocument && (
          <Button variant="outline" className="w-full bg-transparent">
            <Upload className="h-4 w-4 mr-2" />
            Choose File
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
