import { useCallback, useEffect, useState } from "react";
import {
  getLeads,
  updateLeadStatus,
  type Lead,
} from "../../api";
import ImportButton from "../import-button";
import "./dashboard.css";
import { deleteLead } from "../../api";

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadLeads = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
      setMessage("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to load leads"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  async function handleStatusChange(
    id: string,
    status: Lead["status"]
  ) {
    try {
      await updateLeadStatus(id, status);
      await loadLeads();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to update status"
      );
    }
  }

  const countStatus = (status: Lead["status"]) =>
    leads.filter((lead) => lead.status === status).length;


  const handleDeleteLead = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lead?"
    );

    if (!confirmed) return;

    try {
      await deleteLead(id);
      await loadLeads(); // Refresh dashboard leads
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Unable to delete lead"
      );
    }
  };

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(leads.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentLeads = leads.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>PURE Energy MIS Assistant</h1>
          <p>Lead Management Dashboard</p>
        </div>

        <button type="button" onClick={() => void loadLeads()}>
          Refresh Data
        </button>
      </header>

      <section className="dashboard-stats">
        <article className="stat-card">
          <span>Total Leads</span>
          <strong>{leads.length}</strong>
        </article>

        <article className="stat-card">
          <span>New</span>
          <strong>{countStatus("New")}</strong>
        </article>

        <article className="stat-card">
          <span>Contacted</span>
          <strong>{countStatus("Contacted")}</strong>
        </article>

        <article className="stat-card">
          <span>Converted</span>
          <strong>{countStatus("Converted")}</strong>
        </article>

        <article className="stat-card">
          <span>Lost</span>
          <strong>{countStatus("Lost")}</strong>
        </article>
      </section>



      <section className="dashboard-panel">
        <h2>Legacy Data Import</h2>
        <ImportButton onImported={() => void loadLeads()} />
      </section>

      <section className="dashboard-panel">
        <div className="table-heading">
          <h2>All Leads</h2>
          <span>{leads.length} records</span>
        </div>

        {message && <p role="alert" className="error-message">{message}</p>}

        {loading ? (
          <p>Loading leads...</p>
        ) : leads.length === 0 ? (
          <p>No leads found. Add a lead or import your legacy CSV.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Pincode</th>
                  <th>Product</th>
                  <th>Source</th>
                  <th>Dealer</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>{lead.name}</td>
                    <td>{lead.mobile}</td>
                    <td>{lead.pincode}</td>
                    <td>{lead.product}</td>
                    <td>{lead.source}</td>
                    <td>{lead.dealer || "In-house Sales"}</td>
                    <td>
                      <select
                        aria-label={`Status for ${lead.name}`}
                        value={lead.status || "New"}
                        onChange={(event) =>
                          void handleStatusChange(
                            lead.id,
                            event.target.value as Lead["status"]
                          )
                        }
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleDeleteLead(lead.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {!loading && leads.length > 0 && (
  <div className="pagination">
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((page) => page - 1)}
    >
      Previous
    </button>

    <span>
      Page {currentPage} of {Math.max(totalPages, 1)}
    </span>

    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() => setCurrentPage((page) => page + 1)}
    >
      Next
    </button>
  </div>
)}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}