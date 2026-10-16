
import { Fragment } from "react";
import { BrowserRouter, Route, Routes, Navigate, useNavigate } from "react-router-dom";

import Dashboard from "./components/dashboard/dashboard";
import LeadForm from "./components/lead_form/lead-form";
import Mainlayout from "./components/layouts/mainlayout";

function LeadsPage() {
  const navigate = useNavigate();

  return (
    <LeadForm
      onCreated={() => {
        navigate("/dashboard");
      }}
    />
  );
}

const App = () => {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainlayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<LeadsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default App;
