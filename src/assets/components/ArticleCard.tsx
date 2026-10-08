import type { Article } from "../../types/types";

interface ArticleCardProps {
  article: Article;
  isRead: boolean;
  onClick: () => void;
  onToggleRead: () => void;
  search?: string;
}

function ArticleCard({
  article,
  isRead,
  onClick,
  onToggleRead,
  search = "",
}: ArticleCardProps) {
  const keyword = search.trim();

  // 검색어가 포함된 본문 찾기
  const matchedParagraph = article.content.find(
    (paragraph) =>
      paragraph
        .toLowerCase()
        .includes(keyword.toLowerCase())
  );

  // 검색어 강조
  const highlightText = (text: string) => {
    if (!keyword) {
      return text;
    }

    const escapedKeyword = keyword.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );

    const parts = text.split(
      new RegExp(`(${escapedKeyword})`, "gi")
    );

    return parts.map((part, index) => {
      if (
        part.toLowerCase() ===
        keyword.toLowerCase()
      ) {
        return (
          <mark key={index}>
            {part}
          </mark>
        );
      }

      return part;
    });
  };

  // 검색어 주변의 문장만 미리보기
  const getPreview = () => {
    if (!keyword || !matchedParagraph) {
      return null;
    }

    const lowerParagraph =
      matchedParagraph.toLowerCase();

    const keywordIndex =
      lowerParagraph.indexOf(
        keyword.toLowerCase()
      );

    const previewLength = 90;

    let start = Math.max(
      0,
      keywordIndex - 40
    );

    let end = Math.min(
      matchedParagraph.length,
      start + previewLength
    );

    if (end === matchedParagraph.length) {
      start = Math.max(
        0,
        end - previewLength
      );
    }

    let preview =
      matchedParagraph.slice(start, end);

    if (start > 0) {
      preview = "…" + preview;
    }

    if (end < matchedParagraph.length) {
      preview = preview + "…";
    }

    return highlightText(preview);
  };

  const preview = getPreview();

  return (
    <article
      id={`article-${article.id}`}
      className={`article-card ${
        isRead ? "is-read" : ""
      }`}
      onClick={onClick}
    >
      <div className="article-card-top">
        <div className="article-card-meta">

          <button
            className={`read-badge ${
              isRead ? "visible" : ""
            }`}
            onClick={(event) => {
              event.stopPropagation();
              onToggleRead();
            }}
            aria-label={
              isRead
                ? "읽음 표시 해제"
                : "읽음으로 표시"
            }
          >
            {isRead
              ? "✓ 읽음"
              : "○ 안 읽음"}
          </button>

          <span className="article-category">
            {article.category}
          </span>

        </div>
      </div>

      <h3 className="article-title">
        {highlightText(article.title)}
      </h3>

      {/* 검색어가 본문에 있을 경우 미리보기 */}
      {preview && (
        <p className="article-preview">
          {preview}
        </p>
      )}

      {article.date && (
        <span className="article-date">
          {article.date}
        </span>
      )}
    </article>
  );
}

export default ArticleCard;