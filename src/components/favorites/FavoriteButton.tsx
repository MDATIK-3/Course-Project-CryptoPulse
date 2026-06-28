import { useFavoritesContext } from "../../context/FavoritesContext";

interface FavoriteButtonProps {
  assetId: string;
  className?: string;
}

export function FavoriteButton({ assetId, className = "" }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavoritesContext();
  const active = isFavorite(assetId);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggle(assetId);
      }}
      className={`group/fav flex h-7 w-7 items-center justify-center rounded-lg transition-all hover:bg-amber-50 dark:hover:bg-amber-950/30 ${className}`}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <svg
        className={`h-4 w-4 transition-all ${
          active
            ? "fill-amber-400 text-amber-400 scale-110"
            : "fill-none text-gray-300 group-hover/fav:text-amber-400 dark:text-gray-600"
        }`}
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    </button>
  );
}
