const categoryLabels = {
  Phone: "ទូរស័ព្ទ",
  "Student ID Card": "កាតសិស្ស",
  Wallet: "កាបូប",
  Bag: "កាបូប",
  Keys: "សោ",
  "Laptop / Electronics": "អេឡិចត្រូនិក",
  Documents: "ឯកសារ",
  Clothing: "អាវ / មួក",
  "Books / Stationery": "សម្ភារៈសិក្សា",
  Other: "ផ្សេងៗ",
};

const colors = ["teal", "blue", "orange", "pink", "purple", "green"];

export function getCategoryLabel(categoryName = "Other") {
  return categoryLabels[categoryName] || categoryName;
}

export function getApiCategoryName(categoryLabel) {
  return (
    Object.entries(categoryLabels).find(([, label]) => label === categoryLabel)?.[0] ||
    categoryLabel
  );
}

export function normalizeItem(item, index = 0) {
  const categoryName = item.category?.name || item.category_name || item.category || "Other";
  const images = item.image_urls?.length
    ? item.image_urls
    : item.image_url
      ? [item.image_url]
      : item.images || [];

  return {
    ...item,
    id: item.id || item.public_id,
    title: item.title || "Untitled report",
    category: getCategoryLabel(categoryName),
    categoryKey: categoryName,
    place: item.location || item.place || "Campus",
    date: item.event_date || item.date || "Recently",
    color: item.color || colors[index % colors.length],
    code: item.code || item.title?.slice(0, 2).toUpperCase() || "LF",
    image: images[0] || item.image || "",
    images,
    comments: (item.comments || []).map((comment) => ({
      ...comment,
      text: comment.message || comment.text || "",
      images: comment.image_urls || comment.images || [],
      date: comment.created_at || comment.date || "Recently",
    })),
    contact: item.contact || "",
    reporterName: item.reporter_name || item.reporterName || "RUPP community member",
    status: item.status || "open",
    resolvedAt: item.resolved_at || item.resolvedAt || null,
    resolvedByName: item.resolved_by_name || item.resolvedByName || "",
    resolutionNote: item.resolution_note || item.resolutionNote || "",
    isResolved: Boolean(item.resolved_at || item.resolvedAt),
  };
}
