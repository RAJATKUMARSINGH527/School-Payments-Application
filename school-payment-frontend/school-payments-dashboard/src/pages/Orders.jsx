import { useState } from "react";
import axios from "axios";


const BASE_URL = process.env.NODE_ENV === "development" ? bcUrlLocal : bcUrl;

const CreatePaymentPage = () => {
  const [form, setForm] = useState({
    school_id: "",
    trustee_id: "",
    student_info: { name: "", id: "", email: "", phone: "" },
    gateway_name: "",
    amount: "", 
    transaction_amount: "", 
    custom_order_id: "",
    callback_url: `${BASE_URL}/payment-status`,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("student_info.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        student_info: { ...prev.student_info, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Client-side validation for amounts
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
      setError("Order amount must be a positive number.");
      return;
    }

    if (form.transaction_amount && (isNaN(Number(form.transaction_amount)) || Number(form.transaction_amount) < 0)) {
      setError("Transaction amount must be a number zero or greater.");
      return;
    }

    setLoading(true);

    const payload = {
      school_id: form.school_id.trim(),
      trustee_id: form.trustee_id.trim(),
      student_info: {
        name: form.student_info.name.trim(),
        id: form.student_info.id.trim(),
        email: form.student_info.email.trim(),
        phone: form.student_info.phone.trim() || undefined,
      },
      gateway_name: form.gateway_name.trim(),
      amount: Number(form.amount),
      transaction_amount: form.transaction_amount ? Number(form.transaction_amount) : Number(form.amount),
      custom_order_id: form.custom_order_id.trim(),
      callback_url: form.callback_url.trim(),
    };

    try {
      const token = localStorage.getItem("jwt_token");
      const res = await axios.post(
        `${BASE_URL}/orders/create-payment`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const paymentLink = res.data.payment_link;
      if (paymentLink) {
        window.location.href = paymentLink;
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const messages = err.response.data.errors.map((e) => e.msg).join(", ");
        setError(`Validation failed: ${messages}`);
      } else {
        setError(err.response?.data?.error || "Failed to create payment.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 sm:p-10 bg-white dark:bg-gray-900 rounded-md shadow-md transition-colors duration-500">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 dark:text-white text-center sm:text-left">
        Create Payment
      </h2>
      {error && (
        <p className="mb-6 text-center sm:text-left text-red-600 font-semibold">
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit} className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <input
          name="school_id"
          placeholder="School ID"
          value={form.school_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="trustee_id"
          placeholder="Trustee ID"
          value={form.trustee_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="student_info.name"
          placeholder="Student Name"
          value={form.student_info.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:col-span-2"
        />
        <input
          name="student_info.id"
          placeholder="Student ID"
          value={form.student_info.id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="student_info.email"
          placeholder="Student Email"
          type="email"
          value={form.student_info.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="student_info.phone"
          placeholder="Student Phone (optional)"
          value={form.student_info.phone}
          onChange={handleChange}
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="gateway_name"
          placeholder="Gateway Name"
          value={form.gateway_name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="amount"
          placeholder="Order Amount (INR)"
          type="number"
          value={form.amount}
          onChange={handleChange}
          required
          min="1"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="transaction_amount"
          placeholder="Transaction Amount (INR)"
          type="number"
          value={form.transaction_amount}
          onChange={handleChange}
          min="0"
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <input
          name="custom_order_id"
          placeholder="Custom Order ID"
          value={form.custom_order_id}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:col-span-2"
        />
        <input
          name="callback_url"
          placeholder="Callback URL"
          value={form.callback_url}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-md px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition sm:col-span-2"
        />

        <button
          type="submit"
          disabled={loading}
          className="sm:col-span-2 bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-md font-semibold disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Payment"}
        </button>
      </form>
    </div>
  );
};

export default CreatePaymentPage;
