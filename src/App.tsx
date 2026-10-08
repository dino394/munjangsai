
import { useMemo, useState } from "react";

import "./App.css";

import Header from "./assets/components/Header";
import SearchBar from "./assets/components/SearchBar";
import CategoryFilter from "./assets/components/CategoryFilter";
import ArticleCard from "./assets/components/ArticleCard";
import ArticleView from "./assets/components/ArticleView";

import { articles } from "./data/data";

import type { Article, Category } from "./types/types";

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState<"전체" | Category>("전체");

  const [search, setSearch] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  // 글자 크기
  const [fontSize, setFontSize] = useState(1);

  // 목차 펼치기
  const [showAllToc, setShowAllToc] = useState(false);

  // 읽음 표시
  const [readArticles, setReadArticles] = useState<number[]>(
    () => {
      const saved = localStorage.getItem("readArticles");

      if (!saved) {
        return [];
      }

      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }

        return [];
      } catch {
        return [];
      }
    }
  );

  const [selectedArticle, setSelectedArticle] =
    useState<Article | null>(null);

  // =========================
  // 검색 + 카테고리 필터
  // =========================

  const filteredArticles = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "전체" ||
        article.category === selectedCategory;

      const matchesTitle = article.title
        .toLowerCase()
        .includes(keyword);

      const matchesContent = article.content.some(
        (paragraph) =>
          paragraph
            .toLowerCase()
            .includes(keyword)
      );

      const matchesSearch =
        keyword === "" ||
        matchesTitle ||
        matchesContent;

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search]);

  // =========================
  // 목차에 표시할 글
  // =========================

  const visibleTocArticles = showAllToc
    ? filteredArticles
    : filteredArticles.slice(0, 4);

  // =========================
  // 글자 크기 조절
  // =========================

  const handleDecreaseFontSize = () => {
    setFontSize((prev) =>
      Math.max(0.9, prev - 0.1)
    );
  };

  const handleIncreaseFontSize = () => {
    setFontSize((prev) =>
      Math.min(1.1, prev + 0.1)
    );
  };

  // =========================
  // 읽음 표시 토글
  // =========================

  const toggleRead = (articleId: number) => {
    setReadArticles((prev) => {
      let updated: number[];

      if (prev.includes(articleId)) {
        updated = prev.filter(
          (id) => id !== articleId
        );
      } else {
        updated = [...prev, articleId];
      }

      localStorage.setItem(
        "readArticles",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // =========================
  // 글 클릭
  // =========================

  const handleArticleClick = (
    article: Article
  ) => {
    setReadArticles((prev) => {
      if (prev.includes(article.id)) {
        return prev;
      }

      const updated = [
        ...prev,
        article.id,
      ];

      localStorage.setItem(
        "readArticles",
        JSON.stringify(updated)
      );

      return updated;
    });

    setSelectedArticle(article);
  };

  // =========================
  // 목차 글 클릭
  // =========================

  const handleTocClick = (
    article: Article
  ) => {
    setReadArticles((prev) => {
      if (prev.includes(article.id)) {
        return prev;
      }

      const updated = [
        ...prev,
        article.id,
      ];

      localStorage.setItem(
        "readArticles",
        JSON.stringify(updated)
      );

      return updated;
    });

    setSelectedArticle(article);
  };

  // =========================
  // 목록으로 돌아가기
  // =========================

  const handleBack = () => {
    setSelectedArticle(null);
  };

  // =========================
  // 검색 / 카테고리 초기화
  // =========================

  const handleResetFilter = () => {
    setSearch("");
    setSelectedCategory("전체");
  };

  return (
    <div
      className={`app ${
        darkMode ? "dark" : ""
      }`}
      style={
        {
          "--font-scale": fontSize,
        } as React.CSSProperties
      }
    >
      <Header
        darkMode={darkMode}
        onToggleDarkMode={() =>
          setDarkMode((prev) => !prev)
        }
        onIncreaseFontSize={
          handleIncreaseFontSize
        }
        onDecreaseFontSize={
          handleDecreaseFontSize
        }
      />

      <main className="container">
        {selectedArticle ? (
          <ArticleView
            article={selectedArticle}
            onBack={handleBack}
          />
        ) : (
          <>
            {/* =========================
                소개
            ========================= */}

            <section className="intro">
              <p className="eyebrow">
                WORDS BETWEEN US
              </p>

              <h2>
                생각과 문장을
                <br />
                천천히 읽는 공간
              </h2>

              <p className="intro-text">
                하나의 문장을 읽고,
                <br />
                그 문장 사이에 머무는 시간.
              </p>
            </section>

            {/* =========================
                검색
            ========================= */}

            <SearchBar
              search={search}
              onSearchChange={setSearch}
            />

            {/* =========================
                카테고리
            ========================= */}

            <CategoryFilter
              selectedCategory={
                selectedCategory
              }
              onCategoryChange={
                setSelectedCategory
              }
            />

            {/* =========================
                목차
            ========================= */}

            <section className="table-of-contents">
              <div className="toc-header">
                <span>목차</span>

                <span>
                  {filteredArticles.length}개의 글
                </span>
              </div>

              <div className="toc-list">
                {visibleTocArticles.map(
                  (article, index) => {
                    const isRead =
                      readArticles.includes(
                        article.id
                      );

                    return (
                      <button
                        key={article.id}
                        className={`toc-item ${
                          isRead
                            ? "read"
                            : ""
                        }`}
                        onClick={() =>
                          handleTocClick(
                            article
                          )
                        }
                      >
                        <span className="toc-number">
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <span className="toc-title">
                          {article.title}
                        </span>

                        <span className="toc-meta">
                          {isRead && (
                            <span className="toc-read">
                              ✓ 읽음
                            </span>
                          )}

                          <span className="toc-category">
                            {
                              article.category
                            }
                          </span>
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* 글이 4개보다 많을 때만 표시 */}
              {filteredArticles.length >
                4 && (
                <button
                  className="toc-more-button"
                  onClick={() =>
                    setShowAllToc(
                      (prev) => !prev
                    )
                  }
                >
                  {showAllToc
                    ? "목차 접기"
                    : `전체 목차 보기 · ${filteredArticles.length}개`}
                </button>
              )}
            </section>

            {/* =========================
                글 목록
            ========================= */}

            <section className="article-list">
              <div className="list-header">
                <span>
                  {filteredArticles.length}개의 글
                </span>

                {readArticles.length >
                  0 && (
                  <span>
                    {readArticles.length}개 읽음
                  </span>
                )}
              </div>

              {/* 검색 결과가 없는 경우 */}
              {filteredArticles.length ===
              0 ? (
                <div className="empty">
                  <p className="empty-title">
                    {search.trim()
                      ? `'${search.trim()}'에 대한 글을 찾지 못했어요.`
                      : "글을 찾지 못했어요."}
                  </p>

                  <p className="empty-text">
                    다른 단어로 검색해보세요.
                  </p>

                  <button
                    onClick={
                      handleResetFilter
                    }
                  >
                    전체 글 보기
                  </button>
                </div>
              ) : (
                /* 검색 결과가 있는 경우 */
                filteredArticles.map(
                  (article) => {
                    const isRead =
                      readArticles.includes(
                        article.id
                      );

                    return (
                      <ArticleCard
                        key={article.id}
                        article={article}
                        isRead={isRead}
                        onClick={() =>
                          handleArticleClick(
                            article
                          )
                        }
                        onToggleRead={() =>
                          toggleRead(
                            article.id
                          )
                        }
                        search={search}
                      />
                    );
                  }
                )
              )}
            </section>
          </>
        )}
      </main>

      {/* =========================
          푸터
      ========================= */}

      <footer className="footer">
        <p>문장사이</p>
        <span>
          Sentences between us.
        </span>
      </footer>
    </div>
  );
}

export default App;

