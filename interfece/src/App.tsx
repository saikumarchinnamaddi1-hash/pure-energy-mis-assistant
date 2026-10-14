import { Fragment } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Dashboard from "./components/dashboard/dashboard";
import LeadForm from "./components/lead_form/lead-form";
import Mainlayout from "./components/layouts/mainlayout";

const App = () => {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Mainlayout />}>
            <Route index element={<Dashboard />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="leads" element={<LeadForm />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
};

export default App;