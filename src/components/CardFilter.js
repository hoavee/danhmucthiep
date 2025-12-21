"use client";
import React, { useState, useMemo, useEffect } from "react";
// Giả định file cardData.json nằm cùng thư mục hoặc theo cấu trúc của bạn
import MOCK_CARDS from "../data/cardData.json";

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

// --- HIỂN THỊ CHI TIẾT THIỆP (Popup) ---
const PriceDetail = ({ card, setIsModalOpen, setSelectedCard, isAdmin }) => {
  const [showVideo, setShowVideo] = useState(false);

  const groupLabels = {
    chat_lieu: "Chất liệu",
    phom_dang: "Phom dáng",
    tong_mau: "Tông màu",
    thiet_ke_ruot: "Thiết kế ruột",
    mui_huong: "Mùi hương",
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
          className="fixed md:absolute top-6 right-6 md:top-3 md:right-3 w-10 h-10 md:w-9 md:h-9 flex items-center justify-center bg-gray-900/10 md:bg-gray-100 backdrop-blur-md md:backdrop-blur-none rounded-full font-bold text-gray-600 md:text-gray-400 hover:bg-red-500 hover:text-white transition-all z-[110]"
        >
          ✕
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-10">
          <div className="md:w-1/3 text-center">
            <div
              className="bg-gray-50 rounded-xl p-4 mb-4 cursor-zoom-in group relative"
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
              <p className="mt-1 text-gray-400">Nhấp vào ảnh để phóng to</p>
            </div>
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">
              {card.productCode}
            </h2>

            {isAdmin && (
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1 mb-4">
                Mã NPP: {card.distributorCode}
              </p>
            )}

            {card.videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="inline-flex px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors items-center justify-center gap-2 shadow-md mb-6"
              >
                <span className="text-xs">▶</span> Video
              </button>
            )}

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                Đặt in mẫu thiệp này:
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
                    className="w-4 h-4"
                    alt="Zalo"
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
                    className="w-4 h-4"
                    alt="Messenger"
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
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

              {card.categories.mo_ta && card.categories.mo_ta.length > 0 && (
                <div className="pt-4 border-t border-gray-200 mt-2">
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-blue-600 uppercase w-20 shrink-0">
                      Mô tả:
                    </span>
                    <span className="text-sm font-medium text-gray-600 italic leading-relaxed">
                      {card.categories.mo_ta.join(", ")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {isAdmin && renderTiers(card.pricing.purchase, "purchase")}
              {renderTiers(card.pricing.sale, "sale")}
            </div>
          </div>
        </div>

        {showVideo && (
          <div
            className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowVideo(false)}
          >
            <div className="relative w-full max-w-3xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <button
                onClick={() => setShowVideo(false)}
                className="absolute top-2 right-2 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full z-[130] flex items-center justify-center"
              >
                ✕
              </button>
              <iframe
                className="w-full h-full"
                src={`${card.videoUrl?.replace(
                  "watch?v=",
                  "embed/"
                )}?autoplay=1`}
                title="Product Video"
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

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "Hoangviet@70") {
      setIsAdmin(true);
    }

    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedTags]);

  useEffect(() => {
    document.body.style.overflow = selectedCard ? "hidden" : "unset";
  }, [selectedCard]);

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
      if (groupKey === "mo_ta") {
        return prev.includes(tag)
          ? prev.filter((t) => t !== tag)
          : [...prev, tag];
      } else {
        const tagsInGroup = groupedAttributes[groupKey];
        const otherGroupsTags = prev.filter((t) => !tagsInGroup.includes(t));
        return prev.includes(tag) ? otherGroupsTags : [...otherGroupsTags, tag];
      }
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

  // HÀM LẤY GIÁ BÁN THẤP NHẤT (Thường là mốc cuối cùng trong mảng sale)
  const getCheapestPrice = (card) => {
    const saleTiers = card.pricing.sale;
    if (saleTiers && saleTiers.length > 0) {
      return saleTiers[saleTiers.length - 1].unit_price;
    }
    return null;
  };

  if (!mounted) return <div className="min-h-screen bg-[#f8f9fa]" />;

  return (
    <div
      className="relative p-4 md:p-6 bg-[#f8f9fa] min-h-screen text-gray-900"
      style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}
    >
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
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900 tracking-tight">
              Bộ lọc
            </h3>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-[10px] font-bold text-red-500 hover:text-red-700 tracking-widest uppercase border-b border-red-200"
              >
                Xóa hết
              </button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">
              Tìm kiếm mã / đặc điểm
            </p>
            <input
              type="text"
              placeholder="Nhập mã thiệp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white shadow-inner"
            />
          </div>

          <div className="space-y-5 max-h-[50vh] lg:max-h-none overflow-y-auto pr-2 custom-scrollbar">
            {Object.entries(groupedAttributes).map(
              ([key, tags]) =>
                tags.length > 0 && (
                  <div key={key} className="space-y-3">
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                      <span className="w-1 h-1 bg-blue-600 rounded-full"></span>
                      {groupLabels[key]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagClick(key, tag)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-95"
                              : "bg-white text-gray-600 border-gray-100 hover:border-blue-400 hover:text-blue-600"
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
            {filteredCards.length > 0 ? (
              filteredCards.map((card) => (
                <div
                  key={card.id}
                  className={`group bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 cursor-pointer ${
                    selectedCard?.id === card.id
                      ? "ring-2 ring-blue-600 border-transparent shadow-lg"
                      : "border-gray-100 shadow-sm"
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="aspect-square p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={card.imagePath}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      alt={card.productCode}
                    />
                  </div>
                  <div className="p-3 border-t border-gray-50 text-center bg-gray-50/30">
                    <p className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                      {card.productCode}
                    </p>

                    {/* HIỂN THỊ GIÁ RẺ NHẤT TẠI LIST */}
                    <p className="text-[11px] font-bold text-emerald-600 mt-0.5">
                      Giá từ: {getCheapestPrice(card)}đ
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                  Không tìm thấy sản phẩm nào phù hợp
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

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
          __html: `
        @keyframes progress-loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `,
        }}
      />
    </div>
  );
};

export default CardFilter;
