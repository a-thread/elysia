import { Recipe } from "@recipes/models/Recipe";
import { IdTitle } from "@shared/models/Tag";
import { TitleDescriptionImgUrl } from "@shared/models/TitleDescriptionImgUrl";
import { Permission } from "@shared/models/Permission";

export interface Collection extends TitleDescriptionImgUrl {
  id: string;
  description: string;
  img_url: string;
  is_public: boolean;
  public_permission?: Permission;

  tags?: IdTitle[];
  recipes?: Recipe[];

  can_edit?: boolean;
  is_owner?: boolean;
}
