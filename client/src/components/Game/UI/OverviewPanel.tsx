export interface OverviewItem {
  distance: number
  id: string
}

interface OverviewPanelProps {
  overviewItems: OverviewItem[]
  selectedItem: OverviewItem | null
  setSelectedItem: (item: OverviewItem) => void
}

const OverviewPanel = ({
  overviewItems,
  selectedItem,
  setSelectedItem,
}: OverviewPanelProps) => (
  <table>
    <thead>
      <tr>
        <th>distance</th>
        <th>id</th>
      </tr>
    </thead>
    <tbody>
      {overviewItems.map((item, index) => (
        <tr
          key={index}
          onClick={() => setSelectedItem(item)}
          style={{
            cursor: 'pointer',
            backgroundColor: selectedItem === item ? 'red' : 'inherit',
          }}>
          <td>{`${Math.round(item.distance)}m`}</td>
          <td>{item.id}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default OverviewPanel
