import { ReactNode } from "react";
import styles from "../../styles/components/modals/modal.module.scss";
import { RxCross2 } from "react-icons/rx";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const AppModal = ({ isOpen, onClose, title, children }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2>{title}</h2>
          <button onClick={onClose}>
            <RxCross2 />
          </button>
        </div>

        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
};

export default AppModal;
