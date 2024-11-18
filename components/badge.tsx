const Badge: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <span
    className={`px-2 py-1 text-xs font-semibold rounded ${
      isOpen
        ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200"
        : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
    }`}
  >
    {isOpen ? "Open" : "Closed"}
  </span>
);

export default Badge;