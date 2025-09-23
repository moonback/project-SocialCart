// Version améliorée de la page de détail du produit avec plus d'informations
// =============================================

// Remplacez la section "Description" existante par cette version améliorée

{/* Detailed Information Tabs */}
<div className="space-y-6">
  {/* Tab Navigation */}
  <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
    {[
      { id: 'description', label: 'Description', icon: FileText },
      { id: 'specifications', label: 'Spécifications', icon: Package },
      { id: 'shipping', label: 'Livraison', icon: Truck },
      { id: 'reviews', label: 'Avis', icon: MessageCircle }
    ].map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
          activeTab === tab.id
            ? 'bg-white text-purple-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <tab.icon className="w-4 h-4" />
        <span>{tab.label}</span>
      </button>
    ))}
  </div>

  {/* Tab Content */}
  <div className="min-h-[200px]">
    {activeTab === 'description' && (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Description du produit</h3>
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {showFullDescription ? product.description : `${product.description.substring(0, 300)}...`}
            </p>
            {product.description.length > 300 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-purple-600 hover:text-purple-700 font-medium mt-2"
              >
                {showFullDescription ? 'Voir moins' : 'Lire la suite'}
              </button>
            )}
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )}

    {activeTab === 'specifications' && (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Spécifications techniques</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {product.sku && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Référence</span>
              </div>
              <p className="text-gray-900 font-semibold mt-1">{product.sku}</p>
            </div>
          )}

          {product.weight && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Scale className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Poids</span>
              </div>
              <p className="text-gray-900 font-semibold mt-1">{product.weight} kg</p>
            </div>
          )}

          {product.dimensions && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Dimensions</span>
              </div>
              <p className="text-gray-900 font-semibold mt-1">{product.dimensions}</p>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Garantie</span>
            </div>
            <p className="text-gray-900 font-semibold mt-1">2 ans</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Retour</span>
            </div>
            <p className="text-gray-900 font-semibold mt-1">30 jours</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Paiement</span>
            </div>
            <p className="text-gray-900 font-semibold mt-1">Sécurisé</p>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'shipping' && (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Informations de livraison</h3>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center space-x-3">
              <Truck className="w-6 h-6 text-blue-600" />
              <div>
                <h4 className="font-semibold text-blue-900">Livraison standard</h4>
                <p className="text-blue-700 text-sm">3-5 jours ouvrés</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-green-600" />
              <div>
                <h4 className="font-semibold text-green-900">Livraison express</h4>
                <p className="text-green-700 text-sm">24-48h (+5€)</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Frais de port</span>
              </div>
              <p className="text-gray-900 font-semibold mt-1">Gratuit dès 50€</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Assurance</span>
              </div>
              <p className="text-gray-900 font-semibold mt-1">Incluse</p>
            </div>
          </div>
        </div>
      </div>
    )}

    {activeTab === 'reviews' && (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Avis clients</h3>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{product.rating_average || 4.8}</span>
            <span className="text-gray-500">({product.rating_count || 324} avis)</span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 w-8">{rating}</span>
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full" 
                  style={{ width: `${Math.random() * 100}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">
                {Math.floor(Math.random() * 100)}
              </span>
            </div>
          ))}
        </div>

        {/* Sample Reviews */}
        <div className="space-y-4">
          {[
            { name: 'Marie L.', rating: 5, comment: 'Excellent produit, très satisfaite de mon achat !' },
            { name: 'Pierre M.', rating: 4, comment: 'Très bon rapport qualité-prix, je recommande.' },
            { name: 'Sophie K.', rating: 5, comment: 'Livraison rapide et produit conforme à la description.' }
          ].map((review, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{review.name}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
</div>
