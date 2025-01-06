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
  <div className="outline-light padding-ui">
    {selectedItem ? (
      <>
        <div>{selectedItem.id}</div>
        <div>{`${Math.round(selectedItem.distance)}m`}</div>
        <button onClick={() => onAlignTo(selectedItem.id)}>align to</button>
        <button onClick={() => onApproach(selectedItem.id)}>approach</button>
      </>
    ) : (
      <div>no item selected</div>
    )}
  </div>
)

export default SelectedItemPanel
