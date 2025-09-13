
export const metadata = {
  title: "Help & Support | YourStore",
  description: "Find answers to common questions and contact support for your orders.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* New Header Design */}
      <header className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white pt-12 md:pt-16 pb-20 md:pb-24 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="circles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="white" />
            </pattern>
            <rect x="0" y="0" width="100" height="100" fill="url(#circles)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center justify-center mb-4 md:mb-6">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3 md:mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Help Center</h1>
          </div>
          
          <p className="text-orange-100 text-center text-base md:text-lg max-w-2xl mx-auto mb-6 md:mb-8">
            Get answers to your questions about orders, shipping, returns, payments, and more.
          </p>
          
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-3 md:p-4 max-w-2xl mx-auto">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-white mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              <input 
                type="text" 
                placeholder="Search for answers..." 
                className="bg-transparent border-none text-white placeholder-orange-200 focus:ring-0 w-full text-sm md:text-base"
              />
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 120" className="w-full h-10 md:h-16 text-orange-50">
            <path fill="currentColor" d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" />
            <path fill="currentColor" d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" />
            <path fill="currentColor" d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
          </svg>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 -mt-12 md:-mt-16 relative z-20">
        {/* Quick Help Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 md:mb-16">
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">Order Help</h3>
            <p className="text-gray-600 text-xs md:text-sm">Tracking, cancellations, modifications and more</p>
            <button className="mt-3 md:mt-4 text-orange-500 font-medium text-xs md:text-sm hover:text-orange-600">
              Get help &rarr;
            </button>
          </div>
          
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">Shipping Info</h3>
            <p className="text-gray-600 text-xs md:text-sm">Delivery times, shipping options and tracking</p>
            <button className="mt-3 md:mt-4 text-orange-500 font-medium text-xs md:text-sm hover:text-orange-600">
              Learn more &rarr;
            </button>
          </div>
          
          <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 text-center hover:shadow-lg transition">
            <div className="w-10 h-10 md:w-14 md:h-14 bg-orange-100 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2">Returns & Refunds</h3>
            <p className="text-gray-600 text-xs md:text-sm">Return policies, exchanges and refunds</p>
            <button className="mt-3 md:mt-4 text-orange-500 font-medium text-xs md:text-sm hover:text-orange-600">
              See policy &rarr;
            </button>
          </div>
        </section>

        {/* Improved FAQ Section */}
        <section className="mb-12 md:mb-16">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Frequently Asked Questions</h2>
            <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">Quick answers to common questions</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-start">
                <div className="bg-orange-100 p-1 md:p-2 rounded-lg mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">How do I track my order?</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    After placing an order, you will receive a tracking link via email. You can also check your orders in your account dashboard under Order History.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-start">
                <div className="bg-orange-100 p-1 md:p-2 rounded-lg mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">What is your return policy?</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    We offer a 30-day return policy for most items in original condition. Some products may have specific return conditions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-start">
                <div className="bg-orange-100 p-1 md:p-2 rounded-lg mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">Which payment methods are accepted?</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    We accept credit/debit cards, PayPal, Apple Pay, Google Pay, and other local payment options depending on your region.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-start">
                <div className="bg-orange-100 p-1 md:p-2 rounded-lg mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">How can I change my delivery address?</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    You can change your delivery address before your order ships by contacting our support team with your order number.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-start">
                <div className="bg-orange-100 p-1 md:p-2 rounded-lg mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">Do you ship internationally?</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    No, we ship only in nepal. Shipping costs and delivery times vary by destination.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition">
              <div className="flex items-start">
                <div className="bg-orange-100 p-1 md:p-2 rounded-lg mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-base md:text-lg mb-1 md:mb-2 text-gray-800">How do I apply a discount code?</h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Enter your code in the Promo Code box during checkout. Click apply to see the discount reflected in your order total.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 md:mt-10">
            <button className="bg-orange-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-lg hover:bg-orange-600 transition font-medium text-sm md:text-base">
              View All FAQs
            </button>
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-xl md:rounded-2xl shadow-lg p-6 md:p-8 text-white mb-12 md:mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4">Still need help?</h2>
            <p className="mb-4 md:mb-6 max-w-2xl mx-auto text-sm md:text-base">Our customer support team is available 7 days a week to assist you</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
              <button className="bg-white text-orange-500 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-gray-100 transition text-sm md:text-base">
                Contact Support
              </button>
              <button className="bg-transparent border border-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition text-sm md:text-base">
                Live Chat
              </button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}