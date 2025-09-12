"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DocumentUpload } from "@/components/documents/document-upload"
import { FileText, Building, CreditCard, Download, Eye } from "lucide-react"

export default function ShipperDocumentsPage() {
  const handleDocumentUpload = (file: File) => {
    console.log("Uploading document:", file.name)
    // Handle document upload logic here
  }

  // Mock data - replace with real API calls
  const verificationStatus = {
    overall: "approved", // pending, approved, rejected
    kycComplete: true,
    businessComplete: true,
  }

  const documents = {
    kyc: {
      aadhaar: {
        name: "aadhaar_card.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-05",
        url: "/documents/aadhaar_card.pdf",
      },
      pan: {
        name: "pan_card.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-05",
        url: "/documents/pan_card.pdf",
      },
    },
    business: {
      gst: {
        name: "gst_certificate.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-06",
        url: "/documents/gst_certificate.pdf",
      },
      incorporation: {
        name: "incorporation_certificate.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-06",
        url: "/documents/incorporation_certificate.pdf",
      },
    },
  }

  const shipmentDocuments = [
    {
      id: "SH001",
      shipmentId: "SH001",
      route: "Mumbai → Delhi",
      date: "2024-01-15",
      documents: [
        { type: "Invoice", name: "invoice_SH001.pdf", status: "uploaded" },
        { type: "Proof of Delivery", name: "pod_SH001.pdf", status: "uploaded" },
        { type: "Transport Receipt", name: "receipt_SH001.pdf", status: "uploaded" },
      ],
    },
    {
      id: "SH002",
      shipmentId: "SH002",
      route: "Delhi → Bangalore",
      date: "2024-01-12",
      documents: [
        { type: "Invoice", name: "invoice_SH002.pdf", status: "uploaded" },
        { type: "Proof of Delivery", name: "pod_SH002.pdf", status: "uploaded" },
      ],
    },
  ]

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Manage your verification and shipment documents</p>
        </div>
        <Badge variant={verificationStatus.overall === "approved" ? "default" : "secondary"} className="text-sm">
          {verificationStatus.overall === "approved" ? "Verified" : "Verification Pending"}
        </Badge>
      </div>

      {/* Verification Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div className={`p-2 rounded-full ${verificationStatus.kycComplete ? "bg-green-100" : "bg-yellow-100"}`}>
                <FileText
                  className={`h-5 w-5 ${verificationStatus.kycComplete ? "text-green-600" : "text-yellow-600"}`}
                />
              </div>
              <div>
                <p className="font-semibold">KYC Documents</p>
                <p className="text-sm text-muted-foreground">
                  {verificationStatus.kycComplete ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div
                className={`p-2 rounded-full ${verificationStatus.businessComplete ? "bg-green-100" : "bg-yellow-100"}`}
              >
                <Building
                  className={`h-5 w-5 ${verificationStatus.businessComplete ? "text-green-600" : "text-yellow-600"}`}
                />
              </div>
              <div>
                <p className="font-semibold">Business Documents</p>
                <p className="text-sm text-muted-foreground">
                  {verificationStatus.businessComplete ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
          </div>

          {verificationStatus.overall === "approved" && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <div className="p-1 bg-green-600 rounded-full">
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-green-800">Account Verified</p>
                <p className="text-sm text-green-700">
                  Your account is fully verified. You can now book shipments and access all features.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KYC Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          KYC Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUpload
            title="Aadhaar Card"
            description="Upload your Aadhaar card for identity verification"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            required
            existingDocument={documents.kyc.aadhaar}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            title="PAN Card"
            description="Upload your PAN card for tax verification"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            required
            existingDocument={documents.kyc.pan}
            onUpload={handleDocumentUpload}
          />
        </div>
      </div>

      {/* Business Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Building className="h-5 w-5" />
          Business Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUpload
            title="GST Certificate"
            description="Upload your GST registration certificate"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            required
            existingDocument={documents.business.gst}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            title="Company Incorporation"
            description="Upload your company incorporation certificate"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            existingDocument={documents.business.incorporation}
            onUpload={handleDocumentUpload}
          />
        </div>
      </div>

      {/* Shipment Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Shipment Documents
        </h2>
        <Card>
          <CardHeader>
            <CardTitle>Recent Shipment Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shipmentDocuments.map((shipment) => (
                <div key={shipment.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold">{shipment.shipmentId}</p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.route} • {shipment.date}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {shipment.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-sm font-medium">{doc.type}</p>
                            <p className="text-xs text-muted-foreground">{doc.name}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
