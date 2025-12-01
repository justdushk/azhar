import { supabase } from "./supabaseClient";
import { useContentStore } from "./contentStore";

export async function loadTranslations(lang: "ru" | "kz") {
  console.log("🔄 Загружаем переводы для языка:", lang);
  
  const { data, error } = await supabase
    .from("translations")
    .select("*");

  if (error) {
    console.error("❌ Ошибка загрузки:", error);
    return;
  }

  console.log("✅ Данные из Supabase:", data);

  const map: Record<string, string> = {};
  const valueColumn = lang === "ru" ? "value_ru" : "value_kz";
  
  data?.forEach((row) => {
    map[row.key] = row[valueColumn] || row.key;
  });

  console.log("📦 Созданный map:", map);

  useContentStore.getState().setContent(map);
  console.log("✅ Переводы загружены в store");
}