import styles from './Pagination.module.scss';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  if (totalPages <= 1) return null;
  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.pageButton}
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &larr; Prev
      </button>

      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>

      <button
        className={styles.pageButton}
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next &rarr;
      </button>
    </div>
  );
};