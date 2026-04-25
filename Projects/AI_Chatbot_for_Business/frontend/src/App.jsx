import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Bots from './pages/Bots'
import BotDetail from './pages/BotDetail'
import Conversations from './pages/Conversations'
import Leads from './pages/Leads'
import Chat from './pages/Chat'
import WidgetDemo from './pages/WidgetDemo'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="bots" element={<Bots />} />
          <Route path="bots/:botId" element={<BotDetail />} />
          <Route path="conversations" element={<Conversations />} />
          <Route path="leads" element={<Leads />} />
          <Route path="chat" element={<Chat />} />
        </Route>
        <Route path="/widget-demo" element={<WidgetDemo />} />
      </Routes>
    </Router>
  )
}

export default App
