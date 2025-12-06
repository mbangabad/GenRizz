import './App.css'
import Pages from "@/pages/index.jsx"
// Temporarily disabled Toaster to fix React hooks error
// import { Toaster } from "@/components/ui/sonner"

function App() {
  return (
    <>
      <Pages />
      {/* Toaster temporarily disabled - sonner library causing React hooks conflicts */}
    </>
  )
}

export default App 