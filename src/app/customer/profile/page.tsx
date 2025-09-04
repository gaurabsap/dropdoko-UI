export default function AccountDetailsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Account Details</h1>

      {/* Personal Information */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Personal Information</h2>
        <div className="grid gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Full Name"
            className="border rounded-md px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            className="border rounded-md px-3 py-2"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="border rounded-md px-3 py-2"
          />
        </div>
      </section>

      {/* Shipping Address */}
      <section className="mb-6">
        <h2 className="font-semibold mb-2">Shipping Address</h2>
        <div className="grid gap-4 max-w-lg">
          <input
            type="text"
            placeholder="Address"
            className="border rounded-md px-3 py-2"
          />
          <input
            type="text"
            placeholder="City"
            className="border rounded-md px-3 py-2"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="State"
              className="border rounded-md px-3 py-2"
            />
            <input
              type="text"
              placeholder="Zip Code"
              className="border rounded-md px-3 py-2"
            />
          </div>
        </div>
      </section>

      <button className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 transition">
        Update Account
      </button>
    </div>
  );
}
