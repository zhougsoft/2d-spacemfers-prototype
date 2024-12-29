import type { OverviewItem } from './OverviewPanel'

const SelectedItemPanel = ({
  selectedItem,
}: {
  selectedItem: OverviewItem | null
}) => (
  <div className="outline-light padding-ui">
    {selectedItem ? (
      <>
        <div>{selectedItem.id}</div>
        <div>{`${Math.round(selectedItem.distance)}m`}</div>
      </>
    ) : (
      <div>no item selected</div>
    )}
  </div>
)

export default SelectedItemPanel
