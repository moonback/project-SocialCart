import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Image, 
  Video, 
  Type, 
  BarChart3, 
  HelpCircle,
  Upload,
  X,
  Check,
  Palette,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  ArrowUp,
  Save,
  Trash2
} from 'lucide-react';
import { ProductStory } from '../lib/stories';
import { useStoryCreation } from '../hooks/useStories';
import { ProductService } from '../lib/products';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface StoryCreatorProps {
  productId?: string;
  onClose: () => void;
  onStoryCreated?: (story: ProductStory) => void;
}

export function StoryCreator({ productId, onClose, onStoryCreated }: StoryCreatorProps) {
  const { user } = useAuth();
  const { createStory, creating } = useStoryCreation();
  const [step, setStep] = useState<'type' | 'content' | 'preview'>('type');
  const [storyType, setStoryType] = useState<ProductStory['type']>('image');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    content: '',
    media_url: '',
    thumbnail_url: '',
    duration: 5,
    background_color: '#000000',
    text_color: '#FFFFFF',
    font_size: 'medium' as 'small' | 'medium' | 'large',
    poll_options: [] as string[],
    quiz_question: '',
    quiz_options: [] as string[],
    quiz_answer: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const storyTypes = [
    { type: 'image', label: 'Image', icon: Image, color: 'bg-blue-500' },
    { type: 'video', label: 'Vidéo', icon: Video, color: 'bg-red-500' },
    { type: 'text', label: 'Texte', icon: Type, color: 'bg-green-500' },
    { type: 'poll', label: 'Sondage', icon: BarChart3, color: 'bg-purple-500' },
    { type: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'bg-orange-500' }
  ];

  const backgroundColors = [
    '#000000', '#1a1a1a', '#2d2d2d', '#404040',
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
    '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
  ];

  const textColors = [
    '#FFFFFF', '#F8F9FA', '#E9ECEF', '#DEE2E6',
    '#000000', '#495057', '#6C757D', '#ADB5BD'
  ];

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('stories')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName);

      setFormData(prev => ({
        ...prev,
        media_url: publicUrl,
        thumbnail_url: storyType === 'video' ? publicUrl : publicUrl
      }));

      toast.success('Fichier uploadé avec succès !');
    } catch (error) {
      toast.error('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleCreateStory = async () => {
    if (!user || !selectedProduct) {
      toast.error('Erreur: utilisateur ou produit non sélectionné');
      return;
    }

    const storyData = {
      product_id: selectedProduct.id,
      seller_id: user.id,
      type: storyType,
      content: formData.content,
      media_url: formData.media_url,
      thumbnail_url: formData.thumbnail_url,
      duration: formData.duration,
      background_color: formData.background_color,
      text_color: formData.text_color,
      font_size: formData.font_size,
      poll_options: storyType === 'poll' ? formData.poll_options : undefined,
      poll_results: storyType === 'poll' ? {} : undefined,
      quiz_question: storyType === 'quiz' ? formData.quiz_question : undefined,
      quiz_options: storyType === 'quiz' ? formData.quiz_options : undefined,
      quiz_answer: storyType === 'quiz' ? formData.quiz_answer : undefined,
      quiz_results: storyType === 'quiz' ? {} : undefined
    };

    const story = await createStory(storyData);
    if (story && onStoryCreated) {
      onStoryCreated(story);
    }
  };

  const addPollOption = () => {
    setFormData(prev => ({
      ...prev,
      poll_options: [...prev.poll_options, '']
    }));
  };

  const updatePollOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      poll_options: prev.poll_options.map((option, i) => i === index ? value : option)
    }));
  };

  const removePollOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      poll_options: prev.poll_options.filter((_, i) => i !== index)
    }));
  };

  const addQuizOption = () => {
    setFormData(prev => ({
      ...prev,
      quiz_options: [...prev.quiz_options, '']
    }));
  };

  const updateQuizOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      quiz_options: prev.quiz_options.map((option, i) => i === index ? value : option)
    }));
  };

  const removeQuizOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      quiz_options: prev.quiz_options.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Créer une Story</h2>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <AnimatePresence mode="wait">
            {step === 'type' && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Type de Story</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {storyTypes.map((type) => (
                      <motion.button
                        key={type.type}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setStoryType(type.type as ProductStory['type'])}
                        className={`p-6 rounded-xl border-2 transition-all text-center ${
                          storyType === type.type
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-12 h-12 ${type.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                          <type.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="font-medium text-gray-900">{type.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('content')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
                  >
                    Suivant
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Sélection du produit */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Produit associé *
                  </label>
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const product = products.find(p => p.id === e.target.value);
                      setSelectedProduct(product);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner un produit</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contenu selon le type */}
                {storyType === 'image' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Image *
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                      >
                        {formData.media_url ? (
                          <img src={formData.media_url} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                        ) : (
                          <div>
                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Cliquez pour uploader une image</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Décrivez votre produit..."
                      />
                    </div>
                  </div>
                )}

                {storyType === 'video' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Vidéo *
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                      >
                        {formData.media_url ? (
                          <video src={formData.media_url} className="w-full h-48 object-cover rounded-lg" controls />
                        ) : (
                          <div>
                            <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">Cliquez pour uploader une vidéo</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file);
                        }}
                        className="hidden"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Description
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Décrivez votre produit..."
                      />
                    </div>
                  </div>
                )}

                {storyType === 'text' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Texte *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={4}
                        placeholder="Votre message..."
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Couleur de fond
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {backgroundColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setFormData(prev => ({ ...prev, background_color: color }))}
                              className={`w-8 h-8 rounded-full border-2 ${
                                formData.background_color === color ? 'border-gray-800' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                          Couleur du texte
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {textColors.map((color) => (
                            <button
                              key={color}
                              onClick={() => setFormData(prev => ({ ...prev, text_color: color }))}
                              className={`w-8 h-8 rounded-full border-2 ${
                                formData.text_color === color ? 'border-gray-800' : 'border-gray-300'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Taille de police
                      </label>
                      <select
                        value={formData.font_size}
                        onChange={(e) => setFormData(prev => ({ ...prev, font_size: e.target.value as 'small' | 'medium' | 'large' }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="small">Petite</option>
                        <option value="medium">Moyenne</option>
                        <option value="large">Grande</option>
                      </select>
                    </div>
                  </div>
                )}

                {storyType === 'poll' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Question du sondage *
                      </label>
                      <textarea
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Votre question..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Options du sondage *
                      </label>
                      <div className="space-y-3">
                        {formData.poll_options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updatePollOption(index, e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder={`Option ${index + 1}`}
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removePollOption(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={addPollOption}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Ajouter une option
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}

                {storyType === 'quiz' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Question du quiz *
                      </label>
                      <textarea
                        value={formData.quiz_question}
                        onChange={(e) => setFormData(prev => ({ ...prev, quiz_question: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows={3}
                        placeholder="Votre question..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Options du quiz *
                      </label>
                      <div className="space-y-3">
                        {formData.quiz_options.map((option, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuizOption(index, e.target.value)}
                              className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder={`Option ${index + 1}`}
                            />
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeQuizOption(index)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          </div>
                        ))}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={addQuizOption}
                          className="w-full p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-purple-500 transition-colors"
                        >
                          <Plus className="w-4 h-4 inline mr-2" />
                          Ajouter une option
                        </motion.button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Bonne réponse *
                      </label>
                      <select
                        value={formData.quiz_answer}
                        onChange={(e) => setFormData(prev => ({ ...prev, quiz_answer: e.target.value }))}
                        className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="">Sélectionner la bonne réponse</option>
                        {formData.quiz_options.map((option, index) => (
                          <option key={index} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Durée */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Durée (secondes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 5 }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('type')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                  >
                    Retour
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('preview')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold"
                  >
                    Aperçu
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === 'preview' && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu de votre Story</h3>
                  
                  <div 
                    className="aspect-[9/16] rounded-2xl overflow-hidden relative"
                    style={{ backgroundColor: formData.background_color }}
                  >
                    {storyType === 'image' && formData.media_url && (
                      <img
                        src={formData.media_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    
                    {storyType === 'video' && formData.media_url && (
                      <video
                        src={formData.media_url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                      />
                    )}
                    
                    {(storyType === 'text' || storyType === 'poll' || storyType === 'quiz') && (
                      <div className="w-full h-full flex items-center justify-center p-8">
                        <div className="text-center">
                          <h2 
                            className="font-bold mb-4"
                            style={{ 
                              color: formData.text_color,
                              fontSize: formData.font_size === 'large' ? '2rem' : 
                                       formData.font_size === 'small' ? '1rem' : '1.5rem'
                            }}
                          >
                            {storyType === 'poll' || storyType === 'quiz' ? 
                              (storyType === 'poll' ? formData.content : formData.quiz_question) : 
                              formData.content}
                          </h2>
                          
                          {(storyType === 'poll' || storyType === 'quiz') && (
                            <div className="space-y-2">
                              {(storyType === 'poll' ? formData.poll_options : formData.quiz_options).map((option, index) => (
                                <div
                                  key={index}
                                  className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium"
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Overlay avec informations du produit */}
                    {selectedProduct && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 text-white">
                          <div className="flex items-center space-x-3">
                            <img
                              src={selectedProduct.primary_image_url}
                              alt={selectedProduct.name}
                              className="w-8 h-8 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold text-sm">{selectedProduct.name}</h3>
                              <p className="text-xs text-gray-300">
                                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(selectedProduct.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep('content')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold"
                  >
                    Retour
                  </motion.button>
                  
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCreateStory}
                    disabled={creating}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center space-x-2"
                  >
                    {creating ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Création...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Publier la Story</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
