import "./table.css";

export default function Table({
  columns = [],
  data = [],
  renderActions,
  emptyMessage = "No hay datos.",
  striped = true,
  hover = true,
}) {
  return (
    <div className="table-container">
      <table
        className={`
          table
          ${striped ? "table-striped" : ""}
          ${hover ? "table-hover" : ""}
        `}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.align === "right" ? "text-right" : ""}
              >
                {col.title}
              </th>
            ))}

            {renderActions && (
              <th className="table-actions-header">Acciones</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="table-empty"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={row.id ?? index}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.align === "right" ? "text-right" : ""}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}

                {renderActions && (
                  <td className="table-actions-cell">
                    <div className="table-actions">{renderActions(row)}</div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
