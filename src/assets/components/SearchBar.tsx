interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

function SearchBar({
  search,
  onSearchChange,
}: SearchBarProps) {
  return (
    <section className="search-section">
      <div className="search-box">
        <span className="search-icon">
          ⌕
        </span>

        <input
          type="text"
          placeholder="글을 검색해보세요"
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
        />

        {search && (
          <button
            className="clear-button"
            onClick={() => onSearchChange("")}
            aria-label="검색어 삭제"
          >
            ×
          </button>
        )}
      </div>
    </section>
  );
}

export default SearchBar;