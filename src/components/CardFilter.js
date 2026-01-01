"use client";
import React, { useState, useMemo, useEffect } from "react";
import MOCK_CARDS from "../data/cardData.json";
import QUESTIONS from "../data/questions.json";
// Import component modal đã tách (giả sử tên file là CardDetailModal.js)
import CardDetailModal from "./CardDetailModal";

const CardFilter = () => {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State cho bộ lọc
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    chat_lieu: true,
    tong_mau: true,
    gia_tien: true, // Thêm group giá vào trạng thái mở
  });

  useEffect(() => {
    setMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("view") === "Hoangviet@70") setIsAdmin(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, selectedTags, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags]);

  const groupLabels = {
    gia_tien: "Giá tiền", // Label mới thêm vào
    chat_lieu: "Chất liệu",
    phom_dang: "Phom dáng",
    tong_mau: "Tông màu",
    thiet_ke_ruot: "Thiết kế ruột",
    mui_huong: "Mùi hương",
    mo_ta: "Mô tả",
  };

  const groupedAttributes = useMemo(() => {
    const groups = {};
    // Khởi tạo nhóm Giá tiền thủ công
    groups["gia_tien"] = ["Giá cao", "Giá thấp"];

    Object.keys(groupLabels).forEach((key) => {
      if (key !== "gia_tien") groups[key] = new Set();
    });

    MOCK_CARDS.forEach((card) => {
      Object.keys(groupLabels).forEach((key) => {
        if (key !== "gia_tien" && card.categories[key])
          card.categories[key].forEach((val) => groups[key].add(val));
      });
    });
    return Object.fromEntries(
      Object.entries(groups).map(([key, val]) => [
        key,
        Array.isArray(val) ? val : Array.from(val).sort(),
      ])
    );
  }, []);

  const handleTagClick = (groupKey, tag) => {
    setSelectedTags((prev) => {
      // Logic riêng cho Giá tiền: Chỉ chọn 1 trong 2
      if (groupKey === "gia_tien") {
        const otherPriceTag = tag === "Giá cao" ? "Giá thấp" : "Giá cao";
        if (prev.includes(tag)) return prev.filter((t) => t !== tag);
        return [...prev.filter((t) => t !== otherPriceTag), tag];
      }

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

  const toggleGroup = (key) => {
    setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Hàm helper lấy giá mốc "trên 500" để sắp xếp
  const getPriceForSort = (card) => {
    const saleTiers = card.pricing.sale;
    // Tìm tier có min_quantity là "trên 500"
    const tier500 = saleTiers.find((t) => t.min_quantity === "trên 500");
    if (tier500) {
      return parseFloat(tier500.unit_price.replace(/\./g, ""));
    }
    // Nếu không thấy, lấy mốc cuối cùng của mảng sale
    return parseFloat(
      saleTiers[saleTiers.length - 1].unit_price.replace(/\./g, "")
    );
  };

  const filteredCards = useMemo(() => {
    let result = MOCK_CARDS.filter((card) => {
      const allText = `${card.productCode} ${
        card.distributorCode
      } ${Object.values(card.categories).flat().join(" ")}`.toLowerCase();

      const matchesInput = searchTerm
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .every((kw) => allText.includes(kw));

      // Lọc bỏ tags giá tiền ra khỏi việc so khớp category
      const nonPriceTags = selectedTags.filter(
        (t) => t !== "Giá cao" && t !== "Giá thấp"
      );

      const matchesTags =
        nonPriceTags.length === 0 ||
        nonPriceTags.every((tag) =>
          Object.values(card.categories)
            .flat()
            .some((cardTag) => cardTag.toLowerCase() === tag.toLowerCase())
        );

      return matchesInput && matchesTags;
    });

    // Thực hiện sắp xếp
    if (selectedTags.includes("Giá cao")) {
      result.sort((a, b) => getPriceForSort(b) - getPriceForSort(a));
    } else if (selectedTags.includes("Giá thấp")) {
      result.sort((a, b) => getPriceForSort(a) - getPriceForSort(b));
    } else {
      // Sắp xếp mặc định của file gốc
      result.sort((a, b) => {
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
    }

    return result;
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
    <div className="relative p-4 md:p-8 bg-[#f8f9fa] min-h-screen text-gray-900">
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 h-1 z-[200] overflow-hidden bg-blue-50">
          <div className="h-full bg-blue-600 w-full animate-progress"></div>
        </div>
      )}

      <button
        onClick={() => setIsFilterOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-[90] bg-blue-600/95 backdrop-blur-sm text-white pl-4 pr-5 py-2.5 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex items-center gap-2 transition-all active:scale-90"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
        <span className="text-xs font-bold tracking-tight">
          Bộ lọc {selectedTags.length > 0 && `(${selectedTags.length})`}
        </span>
      </button>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        <aside
          className={`fixed inset-0 z-[150] lg:relative lg:inset-auto lg:z-10 lg:block lg:w-1/4 ${
            isFilterOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          } transition-transform duration-300 ease-in-out bg-black/40 lg:bg-transparent`}
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="h-full w-[280px] bg-white overflow-y-auto p-6 lg:p-0 lg:sticky lg:top-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 lg:hidden border-b pb-4">
              <h3 className="text-xl font-black">Bộ lọc</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-2xl p-2"
              >
                &times;
              </button>
            </div>
            <div className="bg-white lg:p-6 space-y-6">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-widest">
                  Tìm kiếm mã
                </p>
                <input
                  type="text"
                  placeholder="Nhập mã thiệp..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
                />
              </div>

              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="w-full py-3 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  Xóa tất cả bộ lọc
                </button>
              )}
              <div className="space-y-2">
                {Object.entries(groupedAttributes).map(([key, tags]) => (
                  <div
                    key={key}
                    className="border-b border-gray-50 pb-2 last:border-0"
                  >
                    <button
                      onClick={() => toggleGroup(key)}
                      className="flex justify-between items-center w-full py-2 text-left group"
                    >
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                        {groupLabels[key]}
                      </span>
                      <span
                        className={`text-[10px] transition-transform duration-300 ${
                          expandedGroups[key] ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </button>
                    {expandedGroups[key] && (
                      <div className="flex flex-wrap gap-2 mt-2 mb-3 animate-fadeIn">
                        {tags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => handleTagClick(key, tag)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                              selectedTags.includes(tag)
                                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                : "bg-white text-gray-600 border-gray-100 hover:border-blue-300"
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <div
          className={`lg:w-3/4 w-full transition-opacity duration-200 ${
            isLoading ? "opacity-30" : "opacity-100"
          }`}
        >
          {filteredCards.length === 0 ? (
            <div className="bg-white rounded-3xl p-20 text-center border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold">
                Không tìm thấy mẫu thiệp nào phù hợp.
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTags([]);
                }}
                className="mt-4 text-blue-600 font-bold underline"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {currentCards.map((card) => (
                <div
                  key={card.id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden"
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="relative aspect-square p-3 md:p-6 flex items-center justify-center bg-gray-50/50">
                    {card.isFeatured && (
                      <div className="absolute top-0 left-0 z-10">
                        <div className="bg-[#ba0000] text-white px-3 py-1.5 rounded-br-xl shadow-lg flex items-center gap-1.5 border-b border-r border-white/20">
                          <span className="text-[9px] font-black uppercase tracking-[0.15em] leading-none">
                            Bán chạy
                          </span>
                        </div>
                      </div>
                    )}
                    <img
                      src={card.imagePath}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      alt={card.productCode}
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 border-t border-gray-50 text-center bg-white">
                    <p className="text-sm md:text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">
                      {card.productCode}
                    </p>
                    <p className="text-xs md:text-xs font-bold text-emerald-600 mt-1">
                      {getCheapestPrice(card)}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-4 gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border rounded-xl disabled:opacity-30"
              >
                ←
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-xl text-sm font-bold ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white border hover:border-blue-300"
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
                className="p-3 bg-white border rounded-xl disabled:opacity-30"
              >
                →
              </button>
            </div>
          )}

          <div className="w-full mt-4 mb-14 pt-4 border-t border-gray-200">
            <h3 className="text-xl font-black text-gray-900 mb-4 uppercase text-center md:text-left">
              Câu hỏi thường gặp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {QUESTIONS.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedFaq(item)}
                  className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-blue-400 transition-all group flex justify-between items-center"
                >
                  <p className="font-bold text-gray-700 group-hover:text-blue-600 text-sm">
                    {item.question}
                  </p>
                  <span className="text-blue-200 group-hover:text-blue-500">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedFaq && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={() => setSelectedFaq(null)}
        >
          <div
            className="bg-white p-6 md:p-8 rounded-3xl shadow-2xl relative max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedFaq(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-red-500 text-xl"
            >
              ✕
            </button>
            <h4 className="text-xl font-black text-blue-600 mb-5">
              {selectedFaq.question}
            </h4>
            <div
              className="text-gray-600 leading-relaxed text-sm md:text-base"
              dangerouslySetInnerHTML={{ __html: selectedFaq.answer }}
            />
          </div>
        </div>
      )}

      {/* SỬ DỤNG COMPONENT MỚI Ở ĐÂY */}
      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          setSelectedCard={setSelectedCard}
          isAdmin={isAdmin}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes progress-loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } } 
            @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            .animate-progress { animation: progress-loading 1s infinite linear; }
            .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
          `,
        }}
      />
    </div>
  );
};

export default CardFilter;
