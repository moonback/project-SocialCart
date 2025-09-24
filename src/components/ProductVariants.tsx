import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Hash, 
  X,
  Tag,
  Settings
} from 'lucide-react';

interface ProductVariant {
  id: string;
  name: string;
  options: string[];
}

interface ProductVariantsProps {
  variants: ProductVariant[];
  onVariantsChange: (variants: ProductVariant[]) => void;
  className?: string;
}

export function ProductVariants({
  variants,
  onVariantsChange,
  className = ''
}: ProductVariantsProps) {
  
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: Date.now().toString(),
      name: '',
      options: ['']
    };
    onVariantsChange([...variants, newVariant]);
  };

  const updateVariant = (index: number, field: 'name' | 'options', value: string | string[]) => {
    const updatedVariants = variants.map((variant, i) => 
      i === index ? { ...variant, [field]: value } : variant
    );
    onVariantsChange(updatedVariants);
  };

  const removeVariant = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index));
  };

  const addVariantOption = (variantIndex: number) => {
    const updatedVariants = variants.map((variant, i) => 
      i === variantIndex ? { ...variant, options: [...variant.options, ''] } : variant
    );
    onVariantsChange(updatedVariants);
  };

  const updateVariantOption = (variantIndex: number, optionIndex: number, value: string) => {
    const updatedVariants = variants.map((variant, i) => 
      i === variantIndex 
        ? { 
            ...variant, 
            options: variant.options.map((option, j) => 
              j === optionIndex ? value : option
            )
          } 
        : variant
    );
    onVariantsChange(updatedVariants);
  };

  const removeVariantOption = (variantIndex: number, optionIndex: number) => {
    const updatedVariants = variants.map((variant, i) => 
      i === variantIndex 
        ? { 
            ...variant, 
            options: variant.options.filter((_, j) => j !== optionIndex)
          } 
        : variant
    );
    onVariantsChange(updatedVariants);
  };

  const duplicateVariant = (variantIndex: number) => {
    const variantToDuplicate = variants[variantIndex];
    const duplicatedVariant: ProductVariant = {
      id: Date.now().toString(),
      name: `${variantToDuplicate.name} (copie)`,
      options: [...variantToDuplicate.options]
    };
    
    const updatedVariants = [
      ...variants.slice(0, variantIndex + 1),
      duplicatedVariant,
      ...variants.slice(variantIndex + 1)
    ];
    onVariantsChange(updatedVariants);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
            <Hash className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-surface-900">Variantes</h2>
            <p className="text-surface-600 text-sm">Définissez les options de votre produit</p>
          </div>
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={addVariant}
          className="btn-primary flex items-center space-x-2 px-6 py-3"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une variante</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {variants.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12 border-2 border-dashed border-surface-300 rounded-2xl"
          >
            <Settings className="w-12 h-12 text-surface-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Aucune variante définie
            </h3>
            <p className="text-surface-500 mb-6">
              Ajoutez des variantes comme la taille, la couleur, etc.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={addVariant}
              className="btn-secondary flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Créer la première variante</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <motion.div
                key={variant.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="card p-6 space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                      <Tag className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-surface-900">
                      Variante {index + 1}
                    </h3>
                  </div>
                  
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => duplicateVariant(index)}
                      className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors"
                      title="Dupliquer"
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => removeVariant(index)}
                      className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Variant Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Nom de la variante *
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(index, 'name', e.target.value)}
                      className="input"
                      placeholder="ex: Taille, Couleur, Matériau..."
                    />
                    <p className="text-xs text-surface-500">
                      Le nom de la variante sera affiché aux clients
                    </p>
                  </div>
                  
                  {/* Variant Options */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-white">
                      Options disponibles *
                    </label>
                    <div className="space-y-2">
                      {variant.options.map((option, optionIndex) => (
                        <motion.div
                          key={optionIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateVariantOption(index, optionIndex, e.target.value)}
                            className="input flex-1"
                            placeholder="Option"
                          />
                          {variant.options.length > 1 && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              type="button"
                              onClick={() => removeVariantOption(index, optionIndex)}
                              className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </motion.button>
                          )}
                        </motion.div>
                      ))}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => addVariantOption(index)}
                        className="w-full py-3 border-2 border-dashed border-surface-300 rounded-xl text-surface-600 hover:border-primary-400 hover:text-primary-600 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter une option</span>
                      </motion.button>
                    </div>
                    
                    <p className="text-xs text-surface-500">
                      Ajoutez toutes les options possibles pour cette variante
                    </p>
                  </div>
                </div>

                {/* Variant Preview */}
                {variant.name && variant.options.some(opt => opt.trim()) && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-surface-50 rounded-xl"
                  >
                    <h4 className="text-sm font-semibold text-white mb-2">
                      Aperçu :
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-sm font-medium text-surface-600">
                        {variant.name}:
                      </span>
                      {variant.options
                        .filter(opt => opt.trim())
                        .map((option, optIndex) => (
                          <span
                            key={optIndex}
                            className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                          >
                            {option}
                          </span>
                        ))
                      }
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Variants Summary */}
      {variants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 rounded-2xl p-4"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Hash className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-surface-900">
                Résumé des variantes
              </h4>
              <p className="text-sm text-surface-600">
                {variants.length} variante{variants.length > 1 ? 's' : ''} définie{variants.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
