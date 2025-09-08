const DemoFormPreview = () => {
  return (
    <section className="formboost-container max-w-md mx-auto border p-4 py-8 border-[#0080FF]">
      <form
        action="https://formboost.com/s/6m4j_vpr7oa"
        method="POST"
        encType="multipart/form-data"
        className="space-y-6"
      >
        <div className="formcarry-block">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Your first and last name"
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div className="formcarry-block">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Your Email Address
          </label>
          <input
            type="email"
            name="email"
            id=""
            placeholder="john@doe.com"
            className="mt-1 block w-full rounded-md border p-2"
          />
        </div>

        <div className="formcarry-block">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-800 mb-1"
          >
            Your message
          </label>
          <textarea
            name="message"
            id="message"
            placeholder="Enter your message..."
            className="mt-1 block w-full rounded-md border p-2"
            rows="4"
          ></textarea>
        </div>

        <div className="formcarry-block">
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#0080FF] hover:bg-[#243299] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0080FF]"
          >
            Send
          </button>
        </div>
      </form>
    </section>
  );
};

export default DemoFormPreview;
