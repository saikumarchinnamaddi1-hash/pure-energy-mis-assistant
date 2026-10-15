
import { useCallback, useEffect, useMemo, useState } from "react";
import { getLeads, updateLeadStatus, deleteLead, type Lead, } from "../../api";
import ImportButton from "../import-button";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, } from "recharts";
import "./dashboard.css";

const STATUS_COLORS: Record<string, string> = {
  New: "#07804b",
  Contacted: "#3985e8",
  Converted: "#23ad82",
  Lost: "#e56b6f",
};

function getCreatedDate(createdOn: Lead["createdOn"]): Date | null {
  if (!createdOn) return null;

  let date: Date;

  if (typeof createdOn === "string") {
    date = new Date(createdOn);
  } else if (typeof createdOn._seconds === "number") {
    date = new Date(createdOn._seconds * 1000);
  } else {
    return null;
  }

  return Number.isNaN(date.getTime()) ? null : date;
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

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

  const countStatus = (status: Lead["status"]) =>
    leads.filter((lead) => (lead.status || "New") === status).length;

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const searchableValues = [
        lead.name,
        lead.mobile,
        lead.pincode,
        lead.product,
        lead.source,
        lead.dealer,
      ];

      const matchesSearch = searchableValues.some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );

      const matchesStatus =
        statusFilter === "All" ||
        (lead.status || "New") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));

  const currentLeads = filteredLeads.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  const monthlyLeadData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - (11 - index),
        1
      );

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleString("en-US", { month: "short" }),
        count: 0,
      };
    });

    leads.forEach((lead) => {
      const date = getCreatedDate(lead.createdOn);
      if (!date) return;

      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = months.find((item) => item.key === key);

      if (month) month.count += 1;
    });

    return months;
  }, [leads]);

  const statusChartData = useMemo(
    () =>
      (["New", "Contacted", "Converted", "Lost"] as const).map((status) => ({
        name: status,
        value: countStatus(status),
        color: STATUS_COLORS[status],
      })),
    [leads]
  );

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

  async function handleDeleteLead(id: string) {
    if (!window.confirm("Are you sure you want to delete this lead?")) {
      return;
    }

    try {
      await deleteLead(id);
      await loadLeads();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Unable to delete lead"
      );
    }
  }

  return (
    <main className="dashboard">


      <section className="page-heading" id="dashboard">
        <div>
          <span className="eyebrow">WORKSPACE / OVERVIEW</span>
          <h1>Lead Management</h1>
          <p>Track, assign, and manage your sales leads.</p>
        </div>

        <button className="primary-btn" type="button" onClick={() => document.getElementById("lead-search")?.focus()}>
          + Find Leads
        </button>
      </section>

      {message && (
        <div className="error-message" role="alert">
          <span>{message}</span>
          <button type="button" onClick={() => setMessage("")}>
            Dismiss
          </button>
        </div>
      )}

      <section className="stats-grid" aria-label="Lead statistics">
        <article className="stat-card">
          <div className="stat-icon green-icon">▤</div>
          <div>
            <span>Total Leads</span>
            <strong>{leads.length}</strong>
            <small>All records</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon">＋</div>
          <div>
            <span>New</span>
            <strong>{countStatus("New")}</strong>
            <small>Awaiting contact</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon blue-icon">↗</div>
          <div>
            <span>Contacted</span>
            <strong>{countStatus("Contacted")}</strong>
            <small>Follow-up in progress</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon green-icon">✓</div>
          <div>
            <span>Converted</span>
            <strong>{countStatus("Converted")}</strong>
            <small>Successful leads</small>
          </div>
        </article>

        <article className="stat-card">
          <div className="stat-icon red-icon">×</div>
          <div>
            <span>Lost</span>
            <strong>{countStatus("Lost")}</strong>
            <small>Closed leads</small>
          </div>
        </article>
      </section>

      <section className="analytics-grid">
        <article className="chart-card">
          <div className="chart-heading">
            <div>
              <h2>Lead Analytics</h2>
              <p>Monthly lead creation overview</p>
            </div>
            <span className="chart-label">Last 12 months</span>
          </div>

          <div className="chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyLeadData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1" >
                    <stop offset="0%" stopColor="#07804b" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#07804b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#e8edf0" strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fill: "#718096", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fill: "#718096", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #e2e8ef", }} formatter={(value) => [value, "Leads"]} />
                <Area type="monotone" dataKey="count" name="Leads" stroke="#07804b" strokeWidth={3} fill="url(#leadGradient)" activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="chart-card status-chart-card">
          <div className="chart-heading">
            <div>
              <h2>Lead Status</h2>
              <p>Current lead distribution</p>
            </div>
          </div>

          <div className="pie-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={85} paddingAngle={3}>
                  {statusChartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="chart-total">
              <strong>{leads.length}</strong>
              <span>Total Leads</span>
            </div>
          </div>

          <div className="chart-legend">
            {statusChartData.map((item) => (
              <div className="legend-item" key={item.name}>
                <span className="legend-dot" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="operations-section">
        <h2>Lead Operations</h2>

        <div className="operations-grid">
          <article className="operation-card import-card">
            <div className="operation-icon">⇧</div>
            <div className="operation-content">
              <h3>Import Legacy Leads</h3>
              <p>Import and reconcile historical CSV records.</p>
              <ImportButton onImported={() => void loadLeads()} />
            </div>
          </article>

          <article className="operation-card">
            <div className="operation-icon">⌖</div>
            <div className="operation-content">
              <h3>Dealer Assignment</h3>
              <p>Leads are routed using dealer pincode rules.</p>
              <span className="operation-note">
                Unmatched pincodes → In-house Sales
              </span>
            </div>
          </article>
        </div>
      </section>

      <section className="leads-panel" id="all-leads">
        <div className="leads-heading">
          <div>
            <h2>All Leads</h2>
            <p>Manage and track your customer enquiries.</p>
          </div>

          <button className="outline-btn" type="button" onClick={() => void loadLeads()}>
            ↻ Refresh
          </button>
        </div>

        <div className="table-toolbar">
          <input id="lead-search" type="search" placeholder="Search name, mobile, pincode, dealer..." value={search} onChange={(event) => { setSearch(event.target.value); setCurrentPage(1); }} />

          <select aria-label="Filter leads by status" value={statusFilter} onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}>
            <option value="All">All statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="empty-state">No matching leads found.</div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="leads-table">
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
                      <td className="customer-cell">
                        <span className="customer-avatar">
                          {lead.name.slice(0, 1).toUpperCase()}
                        </span>
                        <strong>{lead.name}</strong>
                      </td>

                      <td>{lead.mobile}</td>
                      <td>{lead.pincode}</td>
                      <td>{lead.product}</td>
                      <td>{lead.source}</td>
                      <td>{lead.dealer || "In-house Sales"}</td>

                      <td>
                        <span className={`status-badge status-${(lead.status || "New").toLowerCase()}`}>
                          {lead.status || "New"}
                        </span>

                        <select className="status-select" aria-label={`Update status for ${lead.name}`} value={lead.status || "New"} onChange={(event) => void handleStatusChange(lead.id, event.target.value as Lead["status"])}>
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Converted">Converted</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      <td>
                        <button className="delete-btn" type="button" onClick={() => void handleDeleteLead(lead.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="table-footer">
              <span>
                Showing {(safePage - 1) * itemsPerPage + 1}–
                {Math.min(safePage * itemsPerPage, filteredLeads.length)} of{" "}
                {filteredLeads.length} leads
              </span>

              <div className="pagination">
                <button type="button" disabled={safePage <= 1} onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}>
                  Previous
                </button>

                <span>
                  Page {safePage} of {Math.max(totalPages, 1)}
                </span>

                <button type="button" disabled={safePage >= totalPages} onClick={() => setCurrentPage((page) => Math.min(Math.max(totalPages, 1), page + 1))}>
                  Next
                </button>
              </div>
            </footer>
          </>
        )}
      </section>
    </main>
  );
}
