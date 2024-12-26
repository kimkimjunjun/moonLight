import { ReactNode, useEffect, useState } from 'react';
import Modal from 'react-modal';


interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    children: ReactNode;
}

Modal.setAppElement('#__next');

export default function MyModal({ isOpen, closeModal, children }: ModalProps) {
    const [modalOpacity, setModalOpacity] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        setIsModalOpen(isOpen);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            const timer = setInterval(() => {
                setModalOpacity(prevOpacity => Math.min(prevOpacity + 0.01, 0.18));
            }, 10);
            return () => clearInterval(timer);
        } else {
            const timer = setInterval(() => {
                setModalOpacity(prevOpacity => Math.max(prevOpacity - 0.01, 0));
            }, 10);
            return () => clearInterval(timer);
        }
    }, [isOpen]);

    const customStyles: Modal.Styles = {
        overlay: {
            backgroundColor: `rgba(0, 0, 0, ${modalOpacity * 0.5})`,
            transition: 'opacity 0.1s ease',
            zIndex: 10, // 이 값을 높일 필요가 있을 수 있습니다.
        },
        content: {
            zIndex: 20, // zIndex를 추가하여 모달 내용이 항상 위에 보이도록 설정
            transform: isModalOpen ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.2s ease',
            padding: 0, // padding을 0으로 설정
        },
    };


    return (
        <Modal className=""
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={customStyles}
        // overlayClassName="fixed inset-0"
        >
            {children}
        </Modal>
    )
}