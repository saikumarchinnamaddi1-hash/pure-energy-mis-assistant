
import { useState, type FormEvent, type ChangeEvent } from "react";
import { createLead } from "../../api";
import "./lead-form.css";

interface Props {
  onCreated: () => void;
}

const initialForm = {
  name: "",
  mobile: "",
  pincode: "",
  product: "",
  source: "Website",
};

export default function LeadForm({ onCreated }: Props) {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [loading, setLoading] = useState(false);

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.target;

    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

    setForm((previous) => ({ ...previous, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setMessageType("error");
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setMessageType("error");
      setMessage("Enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);

    try {
      const result = await createLead(form);
      setMessageType("success");
      setMessage(result.message || "Lead created successfully.");
      setForm({ ...initialForm });
      onCreated();
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error ? error.message : "Unable to save lead."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="lead-page">
      <div className="lead-page-heading">
        <div>
          <span className="lead-eyebrow">LEAD MANAGEMENT / CREATE</span>
          <h1>Add New Lead</h1>
          <p>Enter customer details to create a new sales lead.</p>
        </div>

        <div className="lead-heading-icon" aria-hidden="true">
          +
        </div>
      </div>

      <section className="lead-form-container">
        <div className="lead-card-heading">
          <div className="lead-card-icon" aria-hidden="true">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="8" r="4" />
              <path d="M3 21v-2a6 6 0 0 1 6-6h1" />
              <path d="M19 14v6M16 17h6" />
            </svg>
          </div>

          <div>
            <h2>Customer Information</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        <form className="lead-form" onSubmit={handleSubmit}>
          <div className="lead-form-grid">
            <div className="form-group">
              <label htmlFor="lead-name">
                Customer Name <span>*</span>
              </label>
              <input
                id="lead-name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                autoComplete="name"
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lead-mobile">
                Mobile Number <span>*</span>
              </label>
              <input
                id="lead-mobile"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={10}
                required
              />
              <small>Enter a valid Indian mobile number.</small>
            </div>

            <div className="form-group">
              <label htmlFor="lead-pincode">
                Pincode <span>*</span>
              </label>
              <input
                id="lead-pincode"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="Enter 6-digit pincode"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lead-product">
                Product <span>*</span>
              </label>
              <select
                id="lead-product"
                name="product"
                value={form.product}
                onChange={handleChange}
                required
              >
                <option value="">Select product</option>
                <option value="Solar Panel">Solar Panel</option>
                <option value="Inverter">Inverter</option>
                <option value="Battery">Battery</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group lead-source-group">
              <label htmlFor="lead-source">Lead Source</label>
              <select
                id="lead-source"
                name="source"
                value={form.source}
                onChange={handleChange}
              >
                <option value="Website">Website</option>
                <option value="Phone">Phone</option>
                <option value="Referral">Referral</option>
                <option value="Walk-in">Walk-in</option>
              </select>
            </div>
          </div>

          {message && (
            <div
              className={`lead-form-message ${messageType}`}
              role={messageType === "error" ? "alert" : "status"}
            >
              <span>{message}</span>
            </div>
          )}

          <div className="lead-form-footer">
            <p>
              <span>*</span> Please verify customer details before saving.
            </p>

            <button type="submit" disabled={loading}>
              {loading ? (
                "Saving..."
              ) : (
                <>
                  <span aria-hidden="true">＋</span> Save Lead
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
