import { useState, type FormEvent } from "react";
import { createLead } from "../../api";

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
  const [loading, setLoading] = useState(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      setMessage("Enter a valid 6-digit pincode.");
      return;
    }

    setLoading(true);

    try {
      const result = await createLead(form);
      setMessage(result.message || "Lead created successfully.");
      setForm(initialForm);
      onCreated();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save lead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit}>
      <h2>Add New Lead</h2>

      <label htmlFor="lead-name">Customer Name</label>
      <input
        id="lead-name"
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Enter customer name"
        required
      />

      <label htmlFor="lead-mobile">Mobile Number</label>
      <input
        id="lead-mobile"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
        placeholder="10-digit mobile number"
        inputMode="numeric"
        maxLength={10}
        required
      />

      <label htmlFor="lead-pincode">Pincode</label>
      <input
        id="lead-pincode"
        name="pincode"
        value={form.pincode}
        onChange={handleChange}
        placeholder="6-digit pincode"
        inputMode="numeric"
        maxLength={6}
        required
      />

      <label htmlFor="lead-product">Product</label>
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

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Save Lead"}
      </button>

      {message && <p role="status">{message}</p>}
    </form>
  );
}