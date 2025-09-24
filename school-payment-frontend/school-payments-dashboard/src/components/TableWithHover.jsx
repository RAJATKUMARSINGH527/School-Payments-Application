const statusCellClass = (status) => {
  if (!status) return "";
  if (status.toLowerCase() === "success") return "text-green-600 font-semibold";
  if (status.toLowerCase() === "failed") return "text-red-600 font-semibold";
  if (status.toLowerCase() === "pending") return "text-yellow-600 font-semibold";
  return "text-gray-700 dark:text-gray-200";
};

const TableWithHover = ({ columns, data }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <table className="min-w-full text-sm table-fixed select-none">
      <thead>
        <tr className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          {columns.map((col) => (
            <th
              key={col}
              scope="col"
              className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300 text-xs uppercase tracking-wide"
            >
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-6 text-gray-500 dark:text-gray-400 font-semibold"
            >
              No transactions found for this school.
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={row.collect_id || idx}
              className="
                group relative bg-white dark:bg-gray-900
                hover:-translate-y-[2px]
                hover:shadow-lg
                hover:z-20
                transition-all duration-300
              "
              style={{ willChange: "transform, box-shadow" }}
            >
              {columns.map((col, colIdx) => {
                const key = col
                  .toLowerCase()
                  .replace(/\s+/g, "_")
                  .replace(/[^a-z0-9_]/g, "");
                const val = row[key];
                // Adding rounded corners for first and last td
                const roundedClass =
                  colIdx === 0
                    ? "rounded-l-lg"
                    : colIdx === columns.length - 1
                    ? "rounded-r-lg"
                    : "";
                return (
                  <td
                    key={colIdx}
                    className={`
                      px-6 py-4 whitespace-nowrap align-middle text-gray-700 dark:text-gray-200
                      ${colIdx === 0 ? "font-semibold" : ""}
                      ${col.toLowerCase() === "status" ? statusCellClass(val) : ""}
                      ${roundedClass}
                    `}
                  >
                    {val ?? "N/A"}
                  </td>
                );
              })}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TableWithHover;
