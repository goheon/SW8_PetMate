
import {nanoid} from "nanoid";

const shortId = {
  type: String,
  default: () => nanoid(),
  require: true,
  index: true,
};

export default shortId;
