"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";

const WeddingInfoPage = () => {
  const [mounted, setMounted] = useState(false);
  const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSfhnlI_CzDhJMPYoHG36_mupWA6E3zJn5Ipga9Oyf3IVojuIQ/viewform?embedded=true";
  const formTopRef = useRef(null);

  // Khắc phục lỗi Hydration bằng cách đảm bảo component chỉ render nội dung động sau khi mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFormLoad = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[#f8f9fa]" />;
  }

  return (
    <div
      className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 text-gray-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-blue-600 transition-colors"
          >
            <span className="text-sm">←</span> Quay lại trang mẫu thiệp
          </Link>
        </div>

        <div ref={formTopRef} className="scroll-mt-10"></div>

        <div className="bg-white shadow-xl rounded-b-2xl border-x border-b border-gray-100 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          </div>

          <iframe
            src={GOOGLE_FORM_URL}
            width="100%"
            height="1800"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            className="w-full transition-opacity duration-500 bg-transparent"
            onLoad={handleFormLoad}
          >
            Đang tải biểu mẫu...
          </iframe>
        </div>

        <div className="mt-10 mb-8 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">
            Thiệp Cưới Linh Lam
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeddingInfoPage;
