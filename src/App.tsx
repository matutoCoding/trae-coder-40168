import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { GeneratorPage } from "@/pages/GeneratorPage";
import { PreviewPage } from "@/pages/PreviewPage";
import { FeedbackPage } from "@/pages/FeedbackPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<GeneratorPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
