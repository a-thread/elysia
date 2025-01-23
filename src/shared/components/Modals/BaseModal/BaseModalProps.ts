import { ModalSize } from "./ModalSize";

export interface BaseModalProps {
  size?: ModalSize;
  onClose: () => void;
  children?: React.ReactNode;
}
