const OverviewPanel = ({
  overviewItems,
}: {
  overviewItems: { name: string; distance: number }[]
}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>distance</th>
          <th>name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>???</td>
          <td>???</td>
        </tr>
      </tbody>
    </table>
  )
}

export default OverviewPanel
