import Footer from "@/components/Footer"
import Header from "@/components/Header"
import React from "react"

export default function Layout({ children }: {
    children: React.ReactNode
}) {
    return (
        <div className="bg-gray-100">
            <Header />
            {children}
            <Footer />
        </div>)
}