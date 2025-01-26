import { Recipe } from "./Recipe";
import { IdTitle } from "./Tag";
import { TitleDescriptionImgUrl } from "./TitleDescriptionImgUrl";

export interface Collection extends TitleDescriptionImgUrl {
  id: string;
  description: string;
  img_url: string;
  is_public: boolean;

  tags?: IdTitle[];
  recipes?: Recipe[];

  can_edit?: boolean;
}
