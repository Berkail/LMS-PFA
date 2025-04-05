import NonDashboardNavBar from "@/components/NonDashboardNavBar";
import Landing from "@/app/(nondashboard)/landing/page";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Home() {
  const [sessionData, setSessionData] = useState<string | null>(null);

  const handleSetSession = async () => {
    try {
      const response = await fetch("/api/set-session", {
        method: "POST",
        credentials: "include", // to send cookies (including session cookie)
      });

      if (response.ok) {
        alert("Session value set!");
      } else {
        alert("Failed to set session.");
      }
    } catch (error) {
      console.error("Error setting session:", error);
      alert("Error setting session.");
    }
  };

  const handleGetSession = async () => {
    try {
      const response = await fetch("/api/get-session", {
        method: "GET",
        credentials: "include", // to send cookies (including session cookie)
      });

      if (response.ok) {
        const data = await response.text(); // Assuming the response is a plain text
        setSessionData(data);
      } else {
        alert("Failed to get session.");
      }
    } catch (error) {
      console.error("Error getting session:", error);
      alert("Error getting session.");
    }
  };

  return (
    <div className="nondashboard-layout">
      <NonDashboardNavBar />
      <main className="nondashboard-layout__main">
        <Landing />
      </main>
      <Footer />
    </div>
  );
}