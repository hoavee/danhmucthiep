"use client";
import React, { useState, useMemo, useEffect } from "react";
import MOCK_CARDS from "../data/cardData.json";
import QUESTIONS from "../data/questions.json";

// --- COMPONENT MODAL XEM ẢNH FULL ---
const ImageModal = ({ imageUrl, altText, onClose }) => {
  if (!imageUrl) return null;
  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      style={{ animation: "fadeIn 0.2s ease-out" }}
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

// --- HIỂN THỊ CHI TIẾT THIỆP ---
const PriceDetail = ({ card, setIsModalOpen, setSelectedCard, isAdmin }) => {
  const [showVideo, setShowVideo] = useState(false);
  const [activeVideo, setActiveVideo] = useState(card.videoUrl || "");

  const groupLabels = {
    chat_lieu: "Chất liệu",
    phom_dang: "Phom dáng",
    tong_mau: "Tông màu",
    thiet_ke_ruot: "Thiết kế ruột",
    mui_huong: "Mùi hương",
    mo_ta: "Mô tả",
  };

  // ĐÃ SỬA LỖI TẠI ĐÂY: Viết liền saleTiers
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
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
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
              <p className="text-[10px] text-gray-500 italic px-4 mt-1">
                Giá áp dụng cho số lượng trên 800. Số lượng ít hơn vui lòng liên
                hệ để biết giá chi tiết.
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

            {/* --- ICON THƯỚC PHIM THEO ẢNH MẪU --- */}
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
                          {/* Khung thước phim */}
                          <rect x="3" y="4" width="18" height="16" rx="2" />
                          {/* Các lỗ phim trên/dưới */}
                          <path d="M7 4v3M12 4v3M17 4v3M7 17v3M12 17v3M17 17v3" />
                          {/* Nút Play ở giữa giống mẫu */}
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
            className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <div
              className="relative w-full max-w-[360px] aspect-[9/16] bg-black rounded-3xl overflow-hidden border-4 border-gray-800"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-4 left-4 w-9 h-9 bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
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
  );
};

// --- COMPONENT CHÍNH ---
const CardFilter = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;
  const [selectedFaq, setSelectedFaq] = useState(null);

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "Hoangviet@70") setIsAdmin(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedTags]);

  const groupLabels = {
    chat_lieu: "Chất liệu",
    phom_dang: "Phom dáng",
    tong_mau: "Tông màu",
    thiet_ke_ruot: "Thiết kế ruột",
    mui_huong: "Mùi hương",
    mo_ta: "Mô tả",
  };

  const groupedAttributes = useMemo(() => {
    const groups = {};
    Object.keys(groupLabels).forEach((key) => (groups[key] = new Set()));
    MOCK_CARDS.forEach((card) => {
      Object.keys(groupLabels).forEach((key) => {
        if (card.categories[key])
          card.categories[key].forEach((val) => groups[key].add(val));
      });
    });
    return Object.fromEntries(
      Object.entries(groups).map(([key, set]) => [key, Array.from(set).sort()])
    );
  }, []);

  const handleTagClick = (groupKey, tag) => {
    setSelectedTags((prev) => {
      if (groupKey === "mo_ta")
        return prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
      const tagsInGroup = groupedAttributes[groupKey];
      const otherGroupsTags = prev.filter((t) => !tagsInGroup.includes(t));
      return prev.includes(tag) ? otherGroupsTags : [...otherGroupsTags, tag];
    });
    setSelectedCard(null);
  };

  const filteredCards = useMemo(() => {
    return MOCK_CARDS.filter((card) => {
      const allText = `${card.productCode} ${
        card.distributorCode
      } ${Object.values(card.categories).flat().join(" ")}`.toLowerCase();
      const matchesInput = searchTerm
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .every((kw) => allText.includes(kw));
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          Object.values(card.categories)
            .flat()
            .some((cardTag) => cardTag.toLowerCase() === tag.toLowerCase())
        );
      return matchesInput && matchesTags;
    });
  }, [searchTerm, selectedTags]);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  const getCheapestPrice = (card) => {
    const saleTiers = card.pricing.sale;
    return saleTiers && saleTiers.length > 0
      ? saleTiers[saleTiers.length - 1].unit_price
      : null;
  };

  if (!mounted) return <div className="min-h-screen bg-[#f8f9fa]" />;

  return (
    <div className="relative p-4 md:p-6 bg-[#f8f9fa] min-h-screen text-gray-900">
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[110] overflow-hidden bg-blue-50">
          <div
            className="h-full bg-blue-600 w-full"
            style={{ animation: "progress-loading 0.8s infinite linear" }}
          ></div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4 w-full p-6 bg-white rounded-2xl shadow-sm border border-gray-100 h-fit lg:sticky lg:top-6 z-20 space-y-6">
          <h3 className="text-lg font-black text-gray-900 tracking-tight">
            Bộ lọc
          </h3>
          <input
            type="text"
            placeholder="Nhập mã thiệp..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
          />
          <div className="space-y-5">
            {Object.entries(groupedAttributes).map(
              ([key, tags]) =>
                tags.length > 0 && (
                  <div key={key} className="space-y-3">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                      {groupLabels[key]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(key, tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-600 border-gray-100 hover:border-blue-400"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        <div
          className={`lg:w-3/4 w-full transition-opacity duration-200 ${
            isLoading ? "opacity-30" : "opacity-100"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {currentCards.map((card) => (
              <div
                key={card.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <div className="aspect-square p-4 flex items-center justify-center">
                  <img
                    src={card.imagePath}
                    className="w-full h-full object-contain transition-transform group-hover:scale-110"
                    alt={card.productCode}
                  />
                </div>
                <div className="p-3 border-t border-gray-50 text-center bg-gray-50/30">
                  <p className="text-sm font-black text-gray-900 group-hover:text-blue-600">
                    {card.productCode}
                  </p>
                  <p className="text-[11px] font-bold text-emerald-600">
                    {getCheapestPrice(card)}đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border rounded-xl text-sm font-bold disabled:opacity-30"
              >
                Trước
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white border"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white border rounded-xl text-sm font-bold disabled:opacity-30"
              >
                Sau
              </button>
            </div>
          )}

          {/* CÂU HỎI THƯỜNG GẶP */}
          <div className="w-full mt-12 pt-12 border-t border-gray-200">
            <h3 className="text-xl font-black text-gray-900 mb-6 uppercase">
              Câu hỏi thường gặp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {QUESTIONS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedFaq(item)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-400 group flex justify-between items-center"
                >
                  <p className="font-bold text-blue-600">{item.question}</p>
                  <span className="text-gray-300 group-hover:text-blue-500">
                    →
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* POPUP FAQ */}
      {selectedFaq && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setSelectedFaq(null)}
        >
          <div
            className="bg-white p-8 rounded-2xl shadow-2xl relative max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFaq(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
            <h4 className="text-lg font-black text-blue-600 mb-4">
              {selectedFaq.question}
            </h4>
            <div
              className="text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
            />
          </div>
        </div>
      )}

      {selectedCard && (
        <PriceDetail
          card={selectedCard}
          setIsModalOpen={setIsModalOpen}
          setSelectedCard={setSelectedCard}
          isAdmin={isAdmin}
        />
      )}
      {selectedCard && isModalOpen && (
        <ImageModal
          imageUrl={selectedCard.imagePath}
          altText={selectedCard.productCode}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `@keyframes progress-loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
        }}
      />
    </div>
  );
};

export default CardFilter;
