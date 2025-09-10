"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DocumentUpload } from "@/components/documents/document-upload"
import { FileText, Shield, Truck, CreditCard, AlertTriangle } from "lucide-react"

export default function TruckOwnerDocumentsPage() {
  const handleDocumentUpload = (file: File) => {
    console.log("Uploading document:", file.name)
    // Handle document upload logic here
  }

  // Mock data - replace with real API calls
  const verificationStatus = {
    overall: "pending", // pending, approved, rejected
    kycComplete: false,
    businessComplete: true,
    vehicleComplete: false,
  }

  const documents = {
    kyc: {
      drivingLicense: {
        name: "driving_license.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-10",
        url: "/documents/driving_license.pdf",
      },
      aadhaar: null,
      pan: {
        name: "pan_card.pdf",
        status: "pending" as const,
        uploadDate: "2024-01-12",
        url: "/documents/pan_card.pdf",
      },
    },
    business: {
      gst: {
        name: "gst_certificate.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-08",
        url: "/documents/gst_certificate.pdf",
      },
      tradeLicense: {
        name: "trade_license.pdf",
        status: "approved" as const,
        uploadDate: "2024-01-08",
        url: "/documents/trade_license.pdf",
      },
    },
    vehicle: {
      registration: null,
      insurance: {
        name: "vehicle_insurance.pdf",
        status: "rejected" as const,
        uploadDate: "2024-01-11",
        url: "/documents/vehicle_insurance.pdf",
      },
      permit: null,
    },
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Management</h1>
          <p className="text-muted-foreground">Upload and manage your verification documents</p>
        </div>
        <Badge variant={verificationStatus.overall === "approved" ? "default" : "secondary"} className="text-sm">
          {verificationStatus.overall === "approved" ? "Verified" : "Verification Pending"}
        </Badge>
      </div>

      {/* Verification Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Verification Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <CreditCard
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

            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <div
                className={`p-2 rounded-full ${verificationStatus.vehicleComplete ? "bg-green-100" : "bg-yellow-100"}`}
              >
                <Truck
                  className={`h-5 w-5 ${verificationStatus.vehicleComplete ? "text-green-600" : "text-yellow-600"}`}
                />
              </div>
              <div>
                <p className="font-semibold">Vehicle Documents</p>
                <p className="text-sm text-muted-foreground">
                  {verificationStatus.vehicleComplete ? "Complete" : "Incomplete"}
                </p>
              </div>
            </div>
          </div>

          {!verificationStatus.kycComplete && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="font-semibold text-yellow-800">Action Required</p>
                <p className="text-sm text-yellow-700">
                  Please complete your document verification to start receiving bookings.
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
            title="Driving License"
            description="Upload a clear photo of your valid driving license"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024} // 5MB
            required
            existingDocument={documents.kyc.drivingLicense}
            onUpload={handleDocumentUpload}
          />

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
          <CreditCard className="h-5 w-5" />
          Business Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUpload
            title="GST Certificate"
            description="Upload your GST registration certificate"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            existingDocument={documents.business.gst}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            title="Trade License"
            description="Upload your trade license or business registration"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            existingDocument={documents.business.tradeLicense}
            onUpload={handleDocumentUpload}
          />
        </div>
      </div>

      {/* Vehicle Documents */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Vehicle Documents
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUpload
            title="Vehicle Registration (RC)"
            description="Upload your vehicle registration certificate"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            required
            existingDocument={documents.vehicle.registration}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            title="Vehicle Insurance"
            description="Upload your valid vehicle insurance certificate"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            required
            existingDocument={documents.vehicle.insurance}
            onUpload={handleDocumentUpload}
          />

          <DocumentUpload
            title="Transport Permit"
            description="Upload your commercial transport permit"
            acceptedTypes={["image/jpeg", "image/png", "application/pdf"]}
            maxSize={5 * 1024 * 1024}
            required
            existingDocument={documents.vehicle.permit}
            onUpload={handleDocumentUpload}
          />
        </div>
      </div>
    </div>
  )
}
