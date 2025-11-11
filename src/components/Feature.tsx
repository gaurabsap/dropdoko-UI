"use client";

import { Truck, DollarSign, Phone } from "lucide-react";

export default function Feature() {
  const features = [
    {
      icon: <Truck className="w-8 h-8 text-orange-500" />,
      title: "Fast Delivery",
      description:
        "No more long waits. We make sure your order reaches you quickly and safely, no matter where you are in Nepal.",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-500" />,
      title: "Cash On Delivery",
      description:
        "Enjoy the ease of paying after delivery. With COD, you can shop stress-free and pay only when your order arrives.",
    },
    {
      icon: <Phone className="w-8 h-8 text-orange-500" />,
      title: "24/7 Support",
      description:
        "Got a question or issue? Our team is always ready to help — any time, any day. You're never shopping alone.",
    },
  ];

  return (
    <section className="w-full mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10 text-center">
          <h2 className="text-center text-2xl md:text-3xl lg:text-4xl lg:text-start font-bold text-gray-800">
            Why DropDoko?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 border rounded-2xl shadow-sm"
            >
              <div className="w-20 h-20 flex items-center justify-center rounded-full bg-orange-100 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-3xl font-bold text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
