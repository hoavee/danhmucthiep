"use client";
import React, { useState } from "react";

// --- COMPONENT MODAL XEM ẢNH FULL (Giữ nguyên từ gốc) ---
const ImageModal = ({ imageUrl, altText, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white text-4xl hover:text-red-500 transition-colors"
        >
          &times;
        </button>
        <img
          src={imageUrl}
          alt={altText}
          className="max-h-[85vh] max-w-full object-contain shadow-2xl rounded-sm"
        />
      </div>
    </div>
  );
};

// --- COMPONENT CHI TIẾT THIỆP (Tách từ PriceDetail gốc) ---
const CardDetailModal = ({ card, setSelectedCard, isAdmin }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState(card.videoUrl || "");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const groupLabels = {
    chat_lieu: "Chất liệu",
    phom_dang: "Phom dáng",
    tong_mau: "Tông màu",
    thiet_ke_ruot: "Thiết kế ruột",
    mui_huong: "Mùi hương",
    mo_ta: "Mô tả",
  };

  const getCheapestPrice = (card) => {
    const saleTiers = card.pricing.sale;
    return saleTiers && saleTiers.length > 0
      ? saleTiers[saleTiers.length - 1].unit_price
      : null;
  };

  const getEmbedUrl = (url) => {
    if (!url) return "";
    if (url.includes("youtube.com/shorts/")) {
      const videoId = url.split("/shorts/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }
    if (url.includes("tiktok.com")) {
      const videoIdMatch = url.match(/\/video\/(\d+)/);
      if (videoIdMatch && videoIdMatch[1]) {
        return `https://www.tiktok.com/embed/v2/${videoIdMatch[1]}?autoplay=1`;
      }
    }
    return url;
  };

  const renderTiers = (tiers, type) => (
    <div className="flex-1 p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
      <h4
        className={`text-[11px] font-bold mb-3 tracking-widest ${
          type === "purchase" ? "text-blue-700" : "text-emerald-700"
        }`}
      >
        {type === "purchase" ? "GIÁ NHẬP" : "GIÁ BÁN"}
      </h4>
      <div className="space-y-2">
        {tiers.map((tier, index) => (
          <div
            key={index}
            className="flex justify-between text-sm border-b border-gray-50 pb-1 last:border-0"
          >
            <span className="text-gray-500">sl {tier.min_quantity}:</span>
            <span className="font-bold text-gray-900">{tier.unit_price}đ</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
        onClick={() => setSelectedCard(null)}
      >
        <div
          className="bg-white p-5 md:p-8 rounded-2xl shadow-2xl border border-gray-100 relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setSelectedCard(null)}
            className="fixed md:absolute top-6 right-6 md:top-3 md:right-3 w-10 h-10 md:w-9 md:h-9 flex items-center justify-center bg-gray-900/10 md:bg-gray-100 rounded-full font-bold text-gray-600 hover:bg-red-500 hover:text-white transition-all z-[110]"
          >
            ✕
          </button>

          <div className="flex flex-col md:flex-row gap-6 md:gap-10">
            <div className="md:w-1/3 text-center">
              <div
                className="bg-gray-50 rounded-xl p-4 cursor-zoom-in group relative"
                onClick={() => setIsModalOpen(true)}
              >
                <img
                  src={card.imagePath}
                  className="max-h-72 object-contain mx-auto transition-transform duration-300 group-hover:scale-105"
                  alt={card.productCode}
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center text-[10px] font-bold uppercase text-gray-600">
                  Phóng to
                </div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mt-4">
                {card.productCode}
              </h2>
              <div className="mb-2">
                <p className="text-lg font-bold text-emerald-600">
                  {getCheapestPrice(card)}đ
                </p>
                <p className="text-[12px] text-gray-500 italic px-4 mt-1">
                  Giá áp dụng cho số lượng trên 800. Số lượng ít hơn vui lòng
                  liên hệ để biết giá chi tiết.
                </p>
              </div>

              {isAdmin && (
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 mb-4">
                  Mã NPP: {card.distributorCode}
                </p>
              )}

              {card.videoUrl && (
                <button
                  onClick={() => {
                    setActiveVideo(card.videoUrl);
                    setShowVideo(true);
                  }}
                  className="inline-flex px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors items-center justify-center gap-2 shadow-md"
                >
                  <span className="text-xs">▶</span> Xem Video
                </button>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                  Liên hệ tư vấn và đặt in:
                </p>
                <div className="flex gap-2">
                  <a
                    href="https://zalo.me/0974569396"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0068ff] text-white rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-sm"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg"
                      alt="Zalo"
                      className="w-4 h-4"
                    />
                    Zalo
                  </a>
                  <a
                    href="https://m.me/thiepcuoilinhlam"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#0084FF] text-white rounded-lg text-xs font-bold transition-transform active:scale-95 shadow-sm"
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg"
                      alt="Messenger"
                      className="w-4 h-4"
                    />
                    Messenger
                  </a>
                </div>
              </div>
            </div>

            <div className="md:w-2/3 space-y-6">
              <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                  Đặc điểm sản phẩm
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(groupLabels).map(
                    ([key, label]) =>
                      card.categories[key]?.length > 0 && (
                        <div key={key} className="flex items-baseline gap-2">
                          <span className="text-[10px] font-bold text-blue-600 uppercase w-20 shrink-0">
                            {label}:
                          </span>
                          <span className="text-sm font-bold text-gray-800">
                            {card.categories[key].join(", ")}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>

              {card.past_weddings && card.past_weddings.length > 0 && (
                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    Dâu rể đã lựa chọn
                  </h3>
                  <p className="text-[10px] text-gray-500 italic px-4 mt-1">
                    Nhấp vào để xem video
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-4 mt-3">
                    {card.past_weddings.map((wedding, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveVideo(wedding.videoUrl);
                          setShowVideo(true);
                        }}
                        className="text-sm font-bold text-gray-700 hover:text-blue-600 transition-colors flex items-center group cursor-pointer"
                      >
                        <div className="flex items-center justify-center mr-1">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="w-5 h-5 text-gray-500 group-hover:text-blue-500"
                          >
                            <rect x="3" y="4" width="18" height="16" rx="2" />
                            <path d="M7 4v3M12 4v3M17 4v3M7 17v3M12 17v3M17 17v3" />
                            <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                          </svg>
                        </div>
                        {wedding.names}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                {isAdmin && renderTiers(card.pricing.purchase, "purchase")}
                {isAdmin && renderTiers(card.pricing.sale, "sale")}
              </div>
            </div>
          </div>

          {showVideo && (
            <div
              className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
              onClick={() => setShowVideo(false)}
            >
              <div
                className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-3xl overflow-hidden border-4 border-gray-800"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowVideo(false)}
                  className="absolute top-4 left-4 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center transition-colors z-10"
                >
                  ✕
                </button>
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(activeVideo)}
                  title="Video Player"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ImageModal
          imageUrl={card.imagePath}
          altText={card.productCode}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default CardDetailModal;
