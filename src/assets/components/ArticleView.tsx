import { useEffect, useState } from "react";
import type { Article } from "../../types/types";

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
}

function ArticleView({
  article,
  onBack,
}: ArticleViewProps) {
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;

      if (documentHeight <= 0) {
        setReadingProgress(0);
        return;
      }

      const progress =
        (scrollTop / documentHeight) * 100;

      setReadingProgress(
        Math.min(100, Math.max(0, progress))
      );
    };

    window.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  const scrollToFootnote = (footnoteId: number) => {
    const element = document.getElementById(
      `footnote-${footnoteId}`
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const scrollToFootnoteReference = (
    footnoteId: number
  ) => {
    const element = document.getElementById(
      `footnote-reference-${footnoteId}`
    );

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <article className="article-view">

      {/* 읽기 진행률 */}
      <div className="reading-progress">
        <div
          className="reading-progress-bar"
          style={{
            width: `${readingProgress}%`,
          }}
        />
      </div>

      {/* 목록으로 돌아가기 */}
      <button
        className="back-button"
        onClick={onBack}
      >
        ← 목록으로 돌아가기
      </button>

      {/* 글 제목 */}
      <header className="article-view-header">

        <span className="article-view-category">
          {article.category}
        </span>

        <h1>{article.title}</h1>

        <div className="article-view-meta">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>

      </header>

      {/* 본문 */}
      <div className="article-content">

        {article.content.map(
          (paragraph, index) => (
            <p key={index}>
              {paragraph}

              {/* 첫 번째 문단 뒤에 각주 번호 표시 */}
              {index === 0 &&
                article.footnotes &&
                article.footnotes.length > 0 && (
                  <button
                    id={`footnote-reference-${article.footnotes[0].id}`}
                    className="footnote-reference"
                    onClick={() =>
                      scrollToFootnote(
                        article.footnotes![0].id
                      )
                    }
                    aria-label="각주 보기"
                  >
                    {article.footnotes[0].id}
                  </button>
                )}
            </p>
          )
        )}

      </div>

      {/* 각주 */}
      {article.footnotes &&
        article.footnotes.length > 0 && (
          <section className="footnotes">

            <h2>각주</h2>

            {article.footnotes.map(
              (footnote) => (
                <p
                  key={footnote.id}
                  id={`footnote-${footnote.id}`}
                >
                  <sup>{footnote.id}</sup>

                  {footnote.text}

                  <button
                    className="footnote-back"
                    onClick={() =>
                      scrollToFootnoteReference(
                        footnote.id
                      )
                    }
                    aria-label="본문으로 돌아가기"
                  >
                    ↑
                  </button>
                </p>
              )
            )}

          </section>
        )}

    </article>
  );
}

export default ArticleView;