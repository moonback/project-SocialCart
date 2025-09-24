import { useState, useCallback } from 'react';

interface ModalState {
  showInfo: boolean;
  showComments: boolean;
  showShare: boolean;
  showActionsMenu: boolean;
  showDeleteConfirm: boolean;
  productToDelete: string | null;
}

interface ModalActions {
  setShowInfo: (show: boolean) => void;
  setShowComments: (show: boolean) => void;
  setShowShare: (show: boolean) => void;
  setShowActionsMenu: (show: boolean) => void;
  setShowDeleteConfirm: (show: boolean) => void;
  openDeleteConfirm: (productId: string) => void;
  closeAllModals: () => void;
}

export function useVideoFeedModals(): ModalState & ModalActions {
  const [showInfo, setShowInfo] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const openDeleteConfirm = useCallback((productId: string) => {
    setProductToDelete(productId);
    setShowDeleteConfirm(true);
    setShowActionsMenu(false);
  }, []);

  const closeAllModals = useCallback(() => {
    setShowInfo(false);
    setShowComments(false);
    setShowShare(false);
    setShowActionsMenu(false);
    setShowDeleteConfirm(false);
    setProductToDelete(null);
  }, []);

  return {
    showInfo,
    showComments,
    showShare,
    showActionsMenu,
    showDeleteConfirm,
    productToDelete,
    setShowInfo,
    setShowComments,
    setShowShare,
    setShowActionsMenu,
    setShowDeleteConfirm,
    openDeleteConfirm,
    closeAllModals,
  };
}
