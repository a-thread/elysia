import { IdTitle } from "./Tag";

export interface TitleDescriptionImgUrl extends IdTitle {
  description?: string;
  img_url?: string;
}
