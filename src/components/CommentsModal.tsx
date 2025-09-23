import React, { useState, useEffect } from 'react';
import { Heart, Send, MoreVertical, Reply } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserAvatar } from './UserAvatar';
import { useSocial } from '../hooks/useSocial';
import { useAuth } from '../hooks/useAuth';
import { SocialService, ProductComment } from '../lib/social';
import toast from 'react-hot-toast';

interface CommentsModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsModal({ productId, isOpen, onClose }: CommentsModalProps) {
  const { user } = useAuth();
  const { addComment, deleteComment, toggleCommentLike } = useSocial();
  const [comments, setComments] = useState<ProductComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && productId) {
      loadComments();
    }
  }, [isOpen, productId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await SocialService.getProductComments(productId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Erreur lors du chargement des commentaires');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment(productId, newComment.trim());
      setNewComment('');
      loadComments(); // Recharger les commentaires
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      await addComment(productId, replyContent.trim(), parentId);
      setReplyContent('');
      setReplyingTo(null);
      loadComments(); // Recharger les commentaires
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      loadComments(); // Recharger les commentaires
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await toggleCommentLike(commentId);
      loadComments(); // Recharger les commentaires pour mettre à jour les compteurs
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'À l\'instant';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end md:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-3xl md:rounded-3xl w-full max-w-2xl max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Commentaires</h3>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <span className="text-gray-600 text-lg">×</span>
            </motion.button>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Aucun commentaire pour le moment</p>
                <p className="text-sm">Soyez le premier à commenter !</p>
              </div>
            ) : (
              comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  {/* Main Comment */}
                  <div className="flex space-x-3">
                    <UserAvatar
                      avatarUrl={comment.user?.avatar_url}
                      username={comment.user?.username}
                      size="sm"
                      className="w-8 h-8"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold text-sm text-gray-900">
                            @{comment.user?.username}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-800 text-sm leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 mt-2 ml-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleLikeComment(comment.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{comment.likes_count}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                          <span className="text-xs">Répondre</span>
                        </motion.button>

                        {user?.id === comment.user_id && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-gray-500 hover:text-red-500 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </motion.button>
                        )}
                      </div>

                      {/* Reply Input */}
                      <AnimatePresence>
                        {replyingTo === comment.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 ml-4"
                          >
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Répondre..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    handleSubmitReply(comment.id);
                                  }
                                }}
                              />
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={!replyContent.trim()}
                                className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center disabled:opacity-50"
                              >
                                <Send className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="ml-11 space-y-2">
                      {comment.replies.map((reply) => (
                        <motion.div
                          key={reply.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex space-x-3"
                        >
                          <UserAvatar
                            avatarUrl={reply.user?.avatar_url}
                            username={reply.user?.username}
                            size="sm"
                            className="w-6 h-6"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-2">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-semibold text-xs text-gray-900">
                                  @{reply.user?.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatTimeAgo(reply.created_at)}
                                </span>
                              </div>
                              <p className="text-gray-800 text-xs leading-relaxed">
                                {reply.content}
                              </p>
                            </div>
                            
                            {/* Reply Actions */}
                            <div className="flex items-center space-x-3 mt-1 ml-2">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLikeComment(reply.id)}
                                className="flex items-center space-x-1 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Heart className="w-3 h-3" />
                                <span className="text-xs">{reply.likes_count}</span>
                              </motion.button>

                              {user?.id === reply.user_id && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDeleteComment(reply.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <MoreVertical className="w-3 h-3" />
                                </motion.button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>

          {/* Comment Input */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <UserAvatar
                  avatarUrl={user.avatar_url}
                  username={user.username}
                  size="sm"
                  className="w-8 h-8"
                />
                <div className="flex-1 flex space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitComment();
                      }
                    }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmitComment}
                    disabled={!newComment.trim()}
                    className="w-10 h-10 bg-primary-500 text-white rounded-full flex items-center justify-center disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
