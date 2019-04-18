import ItemLootingProps from "./ItemLooting/xlsxProps";
import PcRoomProps from "./PcRoom/xlsxProps";

export function getFilesList() {
  const res = {};
  [/* ItemLootingProps,  */ PcRoomProps].forEach(props => {
    res[props.ProcName.toUpperCase()] = props;
  });
  return res;
}
