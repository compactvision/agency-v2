import { useForm } from '@inertiajs/react'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

type Page = {
  id: number | null
  title: string
  slug: string
  content: string
  status: 'draft' | 'published'
}

export default function PagePopup({
  onClose,
  page,
}: {
  page: Page | null
  onClose: () => void
}) {
  const isEditing = !!page

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    slug: '',
    content: '',
    status: 'draft' as 'draft' | 'published',
    _method: isEditing ? 'PUT' : '',
  })

  useEffect(() => {
    if (page) {
      setData({
        title: page.title || '',
        slug: page.slug || '',
        content: page.content || '',
        status: page.status || 'draft',
        _method: 'PUT',
      })
    } else {
      reset()
    }
  }, [page])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const url = isEditing ? `/dashboard/pages/${page?.id}` : `/dashboard/pages`

    post(url, {
      preserveScroll: true,
      onSuccess: () => onClose(),
      onError: (errors) => {
        if (Object.keys(errors).length === 0) {
          toast.error('Erreur inconnue lors de la soumission.')
        }
      },
    })
  }

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true">
      <div className="popup-container">
        <h2 className="popup-title">{isEditing ? 'Modifier la page' : 'Créer une page'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData('title', e.target.value)}
              className="form-input"
              required
            />
            {errors.title && <div className="error-message">{errors.title}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Slug</label>
            <input
              type="text"
              value={data.slug}
              onChange={(e) => setData('slug', e.target.value)}
              className="form-input"
              required
            />
            {errors.slug && <div className="error-message">{errors.slug}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Contenu</label>
            <textarea
              value={data.content}
              onChange={(e) => setData('content', e.target.value)}
              className="form-input"
              rows={5}
              required
            />
            {errors.content && <div className="error-message">{errors.content}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Statut</label>
            <select
              value={data.status}
              onChange={(e) => setData('status', e.target.value as 'draft' | 'published')}
              className="form-input"
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
            {errors.status && <div className="error-message">{errors.status}</div>}
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button cancel-button">
              Annuler
            </button>
            <button type="submit" className="button submit-button" disabled={processing}>
              {isEditing ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
