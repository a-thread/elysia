import { Recipe } from "@recipes/models/Recipe";
import { IdTitle } from "@shared/models/Tag";
import { TitleDescriptionImgUrl } from "@shared/models/TitleDescriptionImgUrl";

export interface Collection extends TitleDescriptionImgUrl {
  id: string;
  description: string;
  img_url: string;
  is_public: boolean;

  tags?: IdTitle[];
  recipes?: Recipe[];

  can_edit?: boolean;
}
