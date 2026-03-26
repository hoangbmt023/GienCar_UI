import "./RenderPagination.scss";
function RenderPagination({ data, onPageChange }) {

    const handlePageChange = (newPage) => {
        if (onPageChange) {
            onPageChange(newPage);
        }
    };



    if (!data || data.last <= 1) return null;

    const currentPage = data.page;
    const endPage = data.last;
    const pages = [];

    const addPageButton = (page) => {
        pages.push(
            <button
                key={page}
                className={`page-btn-pagination ${currentPage === page ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
            >
                {page}
            </button>
        );
    };

    if (endPage <= 4) {
        for (let i = 1; i <= endPage; i++) {

            addPageButton(i);
        }
    } else {

        addPageButton(1);

        // Hiển thị "..." nếu currentPage > 3
        if (currentPage > 3) {
            pages.push(<span key="start-ellipsis">...</span>);
        }

        // Hiển thị currentPage nếu nó không nằm trong đầu/cuối
        if (currentPage > 1 && currentPage < endPage) {
            addPageButton(currentPage);
        }

        // Hiển thị trang kế tiếp nếu currentPage < endPage - 1
        if (currentPage + 1 < endPage) {
            addPageButton(currentPage + 1);
        }

        // Hiển thị "..." nếu cần giữa current và endPage
        if (currentPage + 2 < endPage) {
            pages.push(<span key="end-ellipsis">...</span>);
        }

        // Hiển thị trang cuối nếu khác trang đầu
        if (endPage !== 1) {
            addPageButton(endPage);
        }

    }

    return (
        <div className="table-page-pagination">
            <button
                className="page-btn-pagination"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                &lt;
            </button>
            {pages}
            <button
                className="page-btn-pagination"
                disabled={currentPage === endPage}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                &gt;
            </button>
        </div>
    );
};

export default RenderPagination;