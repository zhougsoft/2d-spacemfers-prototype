const OverviewPanel = ({
  overviewItems,
}: {
  overviewItems: { distance: number; name: string }[]
}) => (
  <table>
    <thead>
      <tr>
        <th>distance</th>
        <th>name</th>
      </tr>
    </thead>
    <tbody>
      {overviewItems.map((data, index) => (
        <tr key={index}>
          <td>{`${Math.round(data.distance)}m`}</td>
          <td>{data.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default OverviewPanel
