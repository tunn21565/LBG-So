import React, { useState } from "react";
import { 
  AI_INTEGRATION_FRAMEWORK, 
  DIGITAL_COMPETENCE_FRAMEWORK, 
  NUTRITION_INTEGRATION, 
  DEFENSE_INTEGRATION 
} from "../data/integrationData";
import { 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Apple, 
  Copy, 
  Check, 
  Search
} from "lucide-react";

export const IntegrationReference: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<"ai" | "nls" | "nutrition" | "defense">("ai");
  const [searchFilter, setSearchFilter] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Header Banner */}
      <div className="bg-white p-6 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-black text-white border border-black">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-black uppercase tracking-wider font-serif">
                Khung Tích Hợp Lồng Ghép Giáo Dục Tiểu Học
              </h2>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl font-serif">
              Tra cứu và chọn lọc các chỉ báo tích hợp Trí tuệ nhân tạo (AI), Năng lực số (CV 3456/BGDĐT), Giáo dục Quốc phòng & An ninh (TT 08/2024), Giáo dục Dinh dưỡng, Quyền con người để đưa vào Kế hoạch bài dạy.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64 font-serif">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Tìm kiếm chỉ báo, mã số..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-black focus:outline-none"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center border border-black overflow-hidden bg-white mt-6 shadow-[1px_1px_0px_rgba(0,0,0,1)] flex-wrap">
          <button
            onClick={() => setActiveCategory("ai")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider border-r border-black transition-colors ${
              activeCategory === "ai"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>1. Trí Tuệ Nhân Tạo (AI)</span>
          </button>

          <button
            onClick={() => setActiveCategory("nls")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider border-r border-black transition-colors ${
              activeCategory === "nls"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Năng Lực Số (CV 3456)</span>
          </button>

          <button
            onClick={() => setActiveCategory("nutrition")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider border-r border-black transition-colors ${
              activeCategory === "nutrition"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>3. GD Dinh Dưỡng</span>
          </button>

          <button
            onClick={() => setActiveCategory("defense")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              activeCategory === "defense"
                ? "bg-black text-white"
                : "bg-white text-stone-800 hover:bg-stone-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Quốc Phòng & An Ninh</span>
          </button>
        </div>
      </div>

      {/* CATEGORY 1: AI FRAMEWORK */}
      {activeCategory === "ai" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AI_INTEGRATION_FRAMEWORK.filter(item => 
            !searchFilter || 
            item.code.toLowerCase().includes(searchFilter.toLowerCase()) || 
            item.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
            item.requirement.toLowerCase().includes(searchFilter.toLowerCase())
          ).map((item) => (
            <div key={item.id} className="bg-white p-5 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="px-2 py-0.5 bg-stone-100 text-black font-mono font-bold text-[10px] border border-black uppercase">
                  Mã: {item.code}
                </span>
                <button
                  onClick={() => handleCopy(`Tích hợp AI: ${item.code} - ${item.requirement}`, item.id)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-stone-600 hover:text-black transition-colors"
                >
                  {copiedCode === item.id ? (
                    <Check className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCode === item.id ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-black font-serif uppercase tracking-tight">{item.title}</h4>
              <p className="text-xs text-stone-700 leading-relaxed font-serif">{item.requirement}</p>

              <div className="bg-stone-50 p-3 border border-stone-300 text-xs text-stone-800 font-serif">
                <strong className="text-black block mb-1 uppercase text-[10px] tracking-wider">Gợi ý hoạt động thực hiện:</strong>
                {item.suggestedActivity}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY 2: NĂNG LỰC SỐ CV 3456 */}
      {activeCategory === "nls" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DIGITAL_COMPETENCE_FRAMEWORK.filter(item =>
            !searchFilter ||
            item.code.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.subDomain.toLowerCase().includes(searchFilter.toLowerCase())
          ).map((item) => (
            <div key={item.id} className="bg-white p-5 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="px-2 py-0.5 bg-stone-100 text-black font-mono font-bold text-[10px] border border-black uppercase">
                  {item.code} ({item.level})
                </span>
                <button
                  onClick={() => handleCopy(`Tích hợp NLS (CV 3456): ${item.code} - ${item.description}`, item.id)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-stone-600 hover:text-black transition-colors"
                >
                  {copiedCode === item.id ? (
                    <Check className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCode === item.id ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">{item.domain}</span>
                <h4 className="font-bold text-sm text-black font-serif mt-0.5">{item.subDomain}</h4>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed font-serif">{item.description}</p>

              <div className="bg-stone-50 p-3 border border-stone-300 text-xs text-stone-800 font-serif">
                <strong className="block mb-1 text-black uppercase text-[10px] tracking-wider">Ứng dụng trong tiết học:</strong>
                {item.example}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY 3: DINH DƯỠNG */}
      {activeCategory === "nutrition" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NUTRITION_INTEGRATION.filter(item =>
            !searchFilter ||
            item.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.topic.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.targetRequirement.toLowerCase().includes(searchFilter.toLowerCase())
          ).map((item) => (
            <div key={item.id} className="bg-white p-5 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="px-2 py-0.5 bg-stone-100 text-black font-mono font-bold text-[10px] border border-black uppercase">
                  {item.subject} - Khối {item.grade}
                </span>
                <button
                  onClick={() => handleCopy(`Tích hợp Dinh dưỡng: Môn ${item.subject} (${item.topic}) - ${item.targetRequirement}`, item.id)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-stone-600 hover:text-black transition-colors"
                >
                  {copiedCode === item.id ? (
                    <Check className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCode === item.id ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-black font-serif">{item.topic}</h4>
              <p className="text-xs text-stone-700 leading-relaxed font-serif">{item.targetRequirement}</p>

              <div className="bg-stone-50 p-3 border border-stone-300 text-xs text-stone-800 font-serif">
                <strong className="block mb-1 text-black uppercase text-[10px] tracking-wider">Địa chỉ tích hợp:</strong>
                {item.notes}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CATEGORY 4: QUỐC PHÒNG AN NINH */}
      {activeCategory === "defense" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEFENSE_INTEGRATION.filter(item =>
            !searchFilter ||
            item.subject.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.topic.toLowerCase().includes(searchFilter.toLowerCase()) ||
            item.content.toLowerCase().includes(searchFilter.toLowerCase())
          ).map((item) => (
            <div key={item.id} className="bg-white p-5 border border-black shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_rgba(0,0,0,1)] transition-all space-y-3">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="px-2 py-0.5 bg-stone-100 text-black font-mono font-bold text-[10px] border border-black uppercase">
                  {item.subject} - Khối {item.grade} (TT 08/2024)
                </span>
                <button
                  onClick={() => handleCopy(`Tích hợp GDQPAN (TT 08/2024): ${item.content}`, item.id)}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-stone-600 hover:text-black transition-colors"
                >
                  {copiedCode === item.id ? (
                    <Check className="w-3.5 h-3.5 text-black" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedCode === item.id ? "Đã chép" : "Sao chép"}</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-black font-serif">{item.topic}</h4>
              <p className="text-xs text-stone-700 leading-relaxed font-serif">{item.content}</p>

              <div className="bg-stone-50 p-3 border border-stone-300 text-xs text-stone-800 font-serif">
                <strong className="block mb-1 text-black uppercase text-[10px] tracking-wider">Hình thức lồng ghép:</strong>
                {item.method}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

