const billingFields = [
  { label: "Company Name",   type: "text",  placeholder: undefined },
  { label: "Address",        type: "text",  placeholder: "House / Flat No., Street, Sector / Area" },
  { label: "Town/City",      type: "text",  placeholder: "Delhi / Noida / Ghaziabad" },
  { label: "State",          type: "text",  placeholder: "Delhi / Uttar Pradesh" },
  { label: "Pincode",        type: "text",  placeholder: "110001 / 201301" },
  { label: "Mobile",         type: "tel",   placeholder: "+91 9876543210" },
  { label: "Email Address",  type: "email", placeholder: "yourname@gmail.com" },
];

export default function BillingForm() {
  return (
    <div className="col-md-12 col-lg-6 col-xl-7">
      {/* First Name + Last Name */}
      <div className="row">
        <div className="col-md-12 col-lg-6">
          <div className="form-item w-100">
            <label className="form-label my-3">
              First Name<sup>*</sup>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
        <div className="col-md-12 col-lg-6">
          <div className="form-item w-100">
            <label className="form-label my-3">
              Last Name<sup>*</sup>
            </label>
            <input type="text" className="form-control" />
          </div>
        </div>
      </div>

      {/* Remaining fields */}
      {billingFields.map((field) => (
        <div className="form-item" key={field.label}>
          <label className="form-label my-3">
            {field.label}<sup>*</sup>
          </label>
          <input
            type={field.type}
            className="form-control"
            placeholder={field.placeholder}
          />
        </div>
      ))}

      {/* Create account */}
      <div className="form-check my-3">
        <input
          type="checkbox"
          className="form-check-input"
          id="Account-1"
          name="Accounts"
          value="Accounts"
        />
        <label className="form-check-label" htmlFor="Account-1">
          Create an account?
        </label>
      </div>

      <hr />

      {/* Ship to different address */}
      <div className="form-check my-3">
        <input
          className="form-check-input"
          type="checkbox"
          id="Address-1"
          name="Address"
          value="Address"
        />
        <label className="form-check-label" htmlFor="Address-1">
          Ship to a different address?
        </label>
      </div>

      {/* Order notes */}
      <div className="form-item">
        <textarea
          name="text"
          className="form-control"
          spellCheck={false}
          cols={30}
          rows={11}
          placeholder="Order Notes (Optional)"
        />
      </div>
    </div>
  );
}
