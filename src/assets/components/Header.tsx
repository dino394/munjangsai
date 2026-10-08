
interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
}

function Header({
  darkMode,
  onToggleDarkMode,
  onIncreaseFontSize,
  onDecreaseFontSize,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <h1 className="logo">
          문장사이
        </h1>

        <div className="header-actions">
          <div className="font-control">
            <button
              onClick={onDecreaseFontSize}
              aria-label="글자 크기 줄이기"
            >
              A−
            </button>

            <button
              onClick={onIncreaseFontSize}
              aria-label="글자 크기 키우기"
            >
              A+
            </button>
          </div>

          <button
            className="icon-button"
            onClick={onToggleDarkMode}
            aria-label="다크모드"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;

