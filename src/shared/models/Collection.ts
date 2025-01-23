import { Recipe } from "./Recipe";
import { Tag } from "./Tag";
import { TitleDescriptionImgUrl } from "./TitleDescriptionImgUrl";

export interface Collection extends TitleDescriptionImgUrl {
  id?: string;
  tags: Tag[];
  recipes: Recipe[];

  is_public?: boolean;
  can_edit?: boolean;
}
