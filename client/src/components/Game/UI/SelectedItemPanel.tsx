import type { EntityInfo } from '../Logic/EntityManager'

const SelectedItemPanel = ({
  selectedItem,
  onAlignTo,
  onApproach,
}: {
  selectedItem: EntityInfo | null
  onAlignTo: (id: string) => void
  onApproach: (id: string) => void
}) => (
  <div
    className="outline-light padding-ui"
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '6rem',
      height: '100%',
    }}>
    {selectedItem ? (
      <>
        <div>
          <div>{selectedItem.id}</div>
          <div>{`${Math.round(selectedItem.distance)}m`}</div>
        </div>
        <div>
          <button onClick={() => onAlignTo(selectedItem.id)}>align to</button>
          <button onClick={() => onApproach(selectedItem.id)}>approach</button>
        </div>
      </>
    ) : (
      <div>no item selected</div>
    )}
  </div>
)

export default SelectedItemPanel
