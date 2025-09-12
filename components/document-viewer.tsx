"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileText, Download, X } from "lucide-react"

interface DocumentViewerProps {
  document: {
    name: string
    type: string
  }
  onClose: () => void
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = "#"
    link.download = document.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`Downloading ${document.name}`)
    // Show toast notification
    if (typeof window !== "undefined") {
      // Simple notification without importing toast
      alert(`Downloading ${document.name}...`)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {document.name}
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mock document preview */}
          <div className="border rounded-lg p-8 bg-slate-50 min-h-[500px] flex items-center justify-center">
            <div className="text-center space-y-4">
              <FileText className="h-16 w-16 text-slate-400 mx-auto" />
              <div>
                <h3 className="font-medium text-lg">{document.name}</h3>
                <p className="text-slate-600">Document Preview</p>
                <p className="text-sm text-slate-500 mt-2">
                  This is a mock preview of the {document.type} document. In a real application, this would show the
                  actual document content.
                </p>
              </div>

              {/* Mock document details */}
              <div className="bg-white p-4 rounded border max-w-md mx-auto">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">File Type:</span>
                    <span className="font-medium">PDF</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">File Size:</span>
                    <span className="font-medium">2.4 MB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Uploaded:</span>
                    <span className="font-medium">Jan 15, 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Status:</span>
                    <span className="font-medium text-green-600">Valid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
