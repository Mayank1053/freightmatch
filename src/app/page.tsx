import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, MapPin, DollarSign } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">FreightMatch</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 text-balance">
          Connect Empty Trucks with Freight Loads
        </h2>
        <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto text-pretty">
          Reduce empty miles, increase profits, and help the environment. Our platform matches truck owners with return
          cargo opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/signup?type=truck-owner">
            <Button size="lg" className="w-full sm:w-auto">
              <Truck className="mr-2 h-5 w-5" />I Own Trucks
            </Button>
          </Link>
          <Link href="/signup?type=shipper">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              <Package className="mr-2 h-5 w-5" />I Need Shipping
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-12">How FreightMatch Works</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <MapPin className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>List Your Route</CardTitle>
              <CardDescription>Truck owners post empty return trips with route, capacity, and pricing</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <Package className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Find Matches</CardTitle>
              <CardDescription>Shippers search for available trucks along their desired routes</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Secure Booking</CardTitle>
              <CardDescription>Book instantly with secure payments and real-time tracking</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">25%</div>
              <div className="text-slate-300">Reduction in Empty Miles</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">1000+</div>
              <div className="text-slate-300">Active Truck Owners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">₹50L+</div>
              <div className="text-slate-300">Monthly Freight Value</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2024 FreightMatch. Connecting logistics, reducing waste.</p>
        </div>
      </footer>
    </div>
  )
}
