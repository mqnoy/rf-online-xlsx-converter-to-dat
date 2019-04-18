import FileReader from "../../classes/FileReader";
import ReaderSheet from "./serverFileReaderSheet";
import ProcName from "./procName";

export default class ServerReader extends FileReader {
  constructor(props = {}) {
    super({
      ...props,
      name: ProcName,
      struct: ReaderSheet
    });
  }
}
