import type { EntityInfo } from '../Logic/EntityManager'

interface OverviewPanelProps {
  overviewItems: EntityInfo[]
  selectedItemId: string | null
  onSelectItem: (id: string) => void
}

const OverviewPanel = ({
  overviewItems,
  selectedItemId,
  onSelectItem,
}: OverviewPanelProps) => (
  <table>
    <thead>
      <tr>
        <th>distance</th>
        <th>id</th>
      </tr>
    </thead>
    <tbody>
      {overviewItems.map(item => (
        <tr
          key={item.id}
          onClick={() => onSelectItem(item.id)}
          style={{
            cursor: 'pointer',
            backgroundColor: selectedItemId === item.id ? 'red' : 'inherit',
          }}>
          <td>{`${Math.round(item.distance)}m`}</td>
          <td>{item.id}</td>
        </tr>
      ))}
    </tbody>
  </table>
)

export default OverviewPanel
