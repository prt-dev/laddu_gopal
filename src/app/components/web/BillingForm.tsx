const billingFields = [
  { label: "Address", type: "text", placeholder: "House / Flat No., Street, Area" },
  { label: "Town/City", type: "text", placeholder: "Kolkata / Delhi / Mumbai" },
  { label: "State", type: "text", placeholder: "West Bengal / Delhi" },
  { label: "Pincode", type: "text", placeholder: "743145" },
  { label: "Mobile / WhatsApp", type: "tel", placeholder: "8013395004" },
  { label: "Email Address", type: "email", placeholder: "yourname@example.com" },
];

export default function BillingForm() {
  return (
    <div className="space-y-4">
      {/* First Name + Last Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            First Name<sup>*</sup>
          </label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-black mb-1">
            Last Name<sup>*</sup>
          </label>
          <input
            type="text"
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Remaining fields */}
      {billingFields.map((field) => (
        <div key={field.label}>
          <label className="block text-xs font-bold text-black mb-1">
            {field.label}<sup>*</sup>
          </label>
          <input
            type={field.type}
            className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
            placeholder={field.placeholder}
          />
        </div>
      ))}

      {/* Order notes */}
      <div>
        <label className="block text-xs font-bold text-black mb-1">
          Special Devotional Instructions (Optional)
        </label>
        <textarea
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2 text-xs text-black focus:border-[#d20b4f] focus:outline-hidden"
          placeholder="e.g. Please include extra mor pankh or specific size note..."
        />
      </div>
    </div>
  );
}
