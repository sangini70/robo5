import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
<<<<<<< HEAD
=======
import { db, auth } from '../../firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp, Timestamp, query, where, getDocs } from 'firebase/firestore';
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
import DOMPurify from 'dompurify';
import { RichTextEditor } from './RichTextEditor';

interface PostFormProps {
  initialData?: any;
  postId?: string;
}

export function PostForm({ initialData, postId }: PostFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '환율',
    tags: '',
    thumbnail: '',
    status: 'draft',
    publishDate: '',
    seoTitle: '',
    seoDescription: '',
    customCss: '',
    customJs: '',
    structuredDataJsonLd: '',
    flowType: '',
    language: 'ko',
  });
  const [loading, setLoading] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [showPreview, setShowPreview] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [titleHistory, setTitleHistory] = useState<any[]>([]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    if (initialData) {
      setOriginalTitle(initialData.title || '');
      setTitleHistory(initialData.titleHistory || []);
      setFormData({
        title: initialData.title || '',
        slug: initialData.slug || '',
        description: initialData.description || '',
        content: initialData.content || '',
        category: initialData.category || '환율',
        tags: initialData.tags ? initialData.tags.join(', ') : '',
        thumbnail: initialData.thumbnail || '',
        status: initialData.status || 'draft',
        publishDate: initialData.publishDate 
          ? new Date(initialData.publishDate.toDate().getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16) 
          : '',
        seoTitle: initialData.seoTitle || '',
        seoDescription: initialData.seoDescription || '',
        customCss: initialData.customCss || '',
        customJs: initialData.customJs || '',
        structuredDataJsonLd: initialData.structuredDataJsonLd || '',
        flowType: initialData.flowType || '',
        language: initialData.language || 'ko',
      });
      if (initialData.status === 'published' && initialData.publishDate && initialData.publishDate.toDate() > new Date()) {
        setPublishMode('schedule');
      }
    }
  }, [initialData]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => {
      // Only auto-generate slug if it's a new post and user hasn't manually edited slug much
      if (!postId && (!prev.slug || prev.slug === generateSlug(prev.title))) {
        return { ...prev, title, slug: generateSlug(title) };
      }
      return { ...prev, title };
    });
  };

  const checkSlugAvailability = async (slug: string) => {
    if (!slug) return;
    try {
<<<<<<< HEAD
      const response = await fetch('/api/admin/posts');
      const posts = await response.json();
      const isDuplicate = posts.some((p: any) => p.slug === slug && p.id !== postId);
=======
      const q = query(collection(db, 'posts'), where('slug', '==', slug));
      const querySnapshot = await getDocs(q);
      const isDuplicate = querySnapshot.docs.some(doc => doc.id !== postId);
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      if (isDuplicate) {
        setSlugError('이미 사용 중인 슬러그입니다.');
      } else {
        setSlugError('');
      }
    } catch (error) {
      console.error("Error checking slug:", error);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value;
    setFormData(prev => ({ ...prev, slug }));
    checkSlugAvailability(slug);
  };

  const handleSlugBlur = () => {
    checkSlugAvailability(formData.slug);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const cleanHtmlContent = (content: string, customJs: string, customCss: string, jsonLd: string) => {
    let html = content;

    // 1. Remove JS wrappers
    const wrapperRegex = /(?:export\s+const\s+\w+\s*=\s*(?:\{\s*content\s*:\s*)?|const\s+\w+\s*=\s*)`([\s\S]*?)`(?:[\s\S]*)/;
    const match = html.match(wrapperRegex);
    if (match) {
      html = match[1];
    }

    // 2. Remove citations like [cite: 1] or [cite: 1, 2]
    html = html.replace(/\[cite:[^\]]+\]/gi, '');

    // 3. Remove markdown code blocks and backticks
    html = html.replace(/^```html\s*/i, '').replace(/\s*```$/i, '');
    html = html.replace(/`/g, '');

    // 4. Extract scripts and styles
    let newCustomJs = customJs || '';
    let newStructuredDataJsonLd = jsonLd || '';
    let newCustomCss = customCss || '';
    
    // Extract application/ld+json
    const ldJsonRegex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    html = html.replace(ldJsonRegex, (match, scriptContent) => {
      newStructuredDataJsonLd += (newStructuredDataJsonLd ? '\n' : '') + scriptContent.trim();
      return '';
    });

    // Extract other scripts
    const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
    html = html.replace(scriptRegex, (match, scriptContent) => {
      newCustomJs += (newCustomJs ? '\n' : '') + scriptContent.trim();
      return '';
    });

    // Extract styles
    const styleRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    html = html.replace(styleRegex, (match, styleContent) => {
      newCustomCss += (newCustomCss ? '\n' : '') + styleContent.trim();
      return '';
    });

    return {
      content: html.trim(),
      customJs: newCustomJs,
      structuredDataJsonLd: newStructuredDataJsonLd,
      customCss: newCustomCss
    };
  };

  const handleCleanHtml = () => {
    const cleaned = cleanHtmlContent(formData.content, formData.customJs, formData.customCss, formData.structuredDataJsonLd);
    setFormData(prev => ({ ...prev, ...cleaned }));
    showToast('HTML이 정리되고 스크립트/스타일이 추출되었습니다.');
  };

  const handlePreview = () => {
    const cleaned = cleanHtmlContent(formData.content, formData.customJs, formData.customCss, formData.structuredDataJsonLd);
    setFormData(prev => ({ ...prev, ...cleaned }));
    setShowPreview(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugError) {
      showToast('슬러그 오류를 해결해 주세요.');
      return;
    }
    setLoading(true);

    try {
      const cleaned = cleanHtmlContent(formData.content, formData.customJs, formData.customCss, formData.structuredDataJsonLd);
      setFormData(prev => ({ ...prev, ...cleaned }));

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
<<<<<<< HEAD
      let publishDate = null;
      let publishHour = null;
      if (formData.status === 'published') {
        if (publishMode === 'schedule' && formData.publishDate) {
          const kstDate = new Date(`${formData.publishDate}+09:00`);
          publishDate = kstDate.toISOString();
          publishHour = kstDate.getHours();
        } else {
          const now = new Date();
          publishDate = now.toISOString();
          const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
          publishHour = kstNow.getUTCHours();
=======
      let publishTimestamp = null;
      let publishHour = null;
      if (formData.status === 'published') {
        if (publishMode === 'schedule' && formData.publishDate) {
          // Treat the input as KST (UTC+9)
          const kstDate = new Date(`${formData.publishDate}+09:00`);
          publishTimestamp = Timestamp.fromDate(kstDate);
          publishHour = kstDate.getHours();
        } else {
          publishTimestamp = serverTimestamp();
          // Get current hour in KST
          const now = new Date();
          const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
          publishHour = kstNow.getUTCHours(); // getUTCHours of a date shifted by +9 gives the KST hour
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
        }
      }

      const postData: any = {
<<<<<<< HEAD
        id: postId || undefined,
=======
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        content: cleaned.content,
        category: formData.category,
        tags: tagsArray,
        thumbnail: formData.thumbnail,
        status: formData.status,
<<<<<<< HEAD
        publishDate: publishDate,
=======
        publishDate: publishTimestamp,
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        customCss: cleaned.customCss,
        customJs: cleaned.customJs,
        structuredDataJsonLd: cleaned.structuredDataJsonLd,
        flowType: formData.flowType,
        language: formData.language,
<<<<<<< HEAD
=======
        authorId: auth.currentUser?.uid,
        updatedAt: serverTimestamp(),
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      };
      
      if (publishHour !== null) {
        postData.publishHour = publishHour;
      }

      if (postId) {
        if (originalTitle && originalTitle !== formData.title) {
          postData.titleHistory = [
            ...titleHistory,
            {
              oldTitle: originalTitle,
              newTitle: formData.title,
              changedAt: new Date().toISOString()
            }
          ];
        } else {
          postData.titleHistory = titleHistory;
        }
<<<<<<< HEAD
      } else {
        postData.titleHistory = [];
        postData.postViews = 0;
        postData.impressions = 0;
        postData.clicks = 0;
        postData.googleIndexStatus = 'none';
        postData.naverIndexStatus = 'none';
      }

      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '저장에 실패했습니다.');
=======
        await updateDoc(doc(db, 'posts', postId), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          titleHistory: [],
          postViews: 0,
          impressions: 0,
          clicks: 0,
          createdAt: serverTimestamp(),
          googleIndexStatus: 'none',
          naverIndexStatus: 'none',
        });
      }

      // Sync to JSON files
      try {
        const syncResponse = await fetch('/api/sync-json', { method: 'POST' });
        const syncData = await syncResponse.json();
        
        if (!syncData.success) {
          throw new Error(syncData.error || 'JSON 동기화에 실패했습니다.');
        }
        
        console.log("Sync successful:", syncData);
      } catch (syncError: any) {
        console.error("Error syncing JSON:", syncError);
        showToast(`데이터 동기화 실패: ${syncError.message}`);
        setLoading(false);
        return; // Stop if sync fails
>>>>>>> 10c5b2f5f68a9f7126f4f756ee74c038e23a51bd
      }

      showToast("저장 및 동기화 완료!");
      router.push('/admin/posts');
    } catch (error: any) {
      console.error("Error saving post:", error);
      showToast(`저장 실패: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 text-gray-900 font-sans">
      {/* Toast Message */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-md shadow-lg z-50">
          {toastMessage}
        </div>
      )}

      {/* Left Column: Content */}
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleTitleChange}
            required
            className="w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            placeholder="Post Title"
          />
        </div>
        
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <button
              type="button"
              onClick={handleCleanHtml}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              Clean HTML & Extract Scripts
            </button>
          </div>
          <RichTextEditor value={formData.content} onChange={handleContentChange} />
        </div>
      </div>

      {/* Right Column: Settings */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Publish Settings</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="draft">Draft (임시저장)</option>
              <option value="published">Published (발행)</option>
            </select>
          </div>

          {formData.status === 'published' && (
            <div className="mt-2 space-y-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publishMode"
                    checked={publishMode === 'now'}
                    onChange={() => setPublishMode('now')}
                    className="text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">지금 발행</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="publishMode"
                    checked={publishMode === 'schedule'}
                    onChange={() => {
                      setPublishMode('schedule');
                      if (!formData.publishDate) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const randomHour = Math.floor(Math.random() * 14) + 8; // 8 to 21
                        const randomMinute = Math.floor(Math.random() * 60);
                        tomorrow.setHours(randomHour, randomMinute, 0, 0);
                        
                        const yyyy = tomorrow.getFullYear();
                        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                        const dd = String(tomorrow.getDate()).padStart(2, '0');
                        const hh = String(tomorrow.getHours()).padStart(2, '0');
                        const min = String(tomorrow.getMinutes()).padStart(2, '0');
                        setFormData(prev => ({ ...prev, publishDate: `${yyyy}-${mm}-${dd}T${hh}:${min}` }));
                      }
                    }}
                    className="text-gray-900 focus:ring-gray-900"
                  />
                  <span className="text-sm text-gray-700">예약 발행</span>
                </label>
              </div>

              {publishMode === 'schedule' && (
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">예약 발행 시간 (한국시간)</label>
                  <input
                    type="datetime-local"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleChange}
                    required={publishMode === 'schedule'}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={loading || !!slugError}
              className="flex-1 inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Post Details</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              onBlur={handleSlugBlur}
              required
              className={`w-full bg-white border ${slugError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-900'} rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all text-sm`}
              placeholder="my-post-slug"
            />
            {slugError && <p className="text-xs text-red-500 mt-1">{slugError}</p>}
            <p className="text-xs text-gray-400 mt-1">예: my-first-post (영문 소문자, 하이픈만 사용)</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="환율">환율</option>
              <option value="ETF">ETF</option>
              <option value="경제 기초">경제 기초</option>
              <option value="미국 증시">미국 증시</option>
              <option value="세금/지원금">세금/지원금</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">흐름 섹션 배치 (선택)</label>
            <select
              name="flowType"
              value={formData.flowType}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="">배치 안 함</option>
              <option value="지금 시장 흐름">지금 시장 흐름</option>
              <option value="과거에서 찾는 답">과거에서 찾는 답</option>
              <option value="앞으로의 방향">앞으로의 방향</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">언어 (Language)</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            >
              <option value="ko">한국어 (Korean)</option>
              <option value="en">영어 (English)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="tag1, tag2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Thumbnail URL</label>
            <input
              type="url"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="https://..."
            />
          </div>

          {titleHistory && titleHistory.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Title History</label>
              <div className="bg-gray-50 rounded-md p-3 border border-gray-200 max-h-40 overflow-y-auto">
                <ul className="space-y-3">
                  {titleHistory.map((history, idx) => (
                    <li key={idx} className="text-xs">
                      <div className="text-gray-400 mb-1">{new Date(history.changedAt).toLocaleString()}</div>
                      <div className="flex flex-col gap-1">
                        <span className="text-red-500 line-through">{history.oldTitle}</span>
                        <span className="text-emerald-600">{history.newTitle}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">SEO</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">SEO Title</label>
            <input
              type="text"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">SEO Description</label>
            <textarea
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Short Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              placeholder="Used for post cards..."
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-3">Advanced (HTML/JS)</h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Custom CSS</label>
            <textarea
              name="customCss"
              value={formData.customCss}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
              placeholder=".my-class { color: red; }"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Custom JS</label>
            <textarea
              name="customJs"
              value={formData.customJs}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
              placeholder="console.log('Hello');"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Structured Data (JSON-LD)</label>
            <textarea
              name="structuredDataJsonLd"
              value={formData.structuredDataJsonLd}
              onChange={handleChange}
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm font-mono"
              placeholder='{ "@context": "https://schema.org", ... }'
            />
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Preview</h2>
              <button 
                type="button"
                onClick={() => setShowPreview(false)} 
                className="text-gray-500 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              <article className="max-w-3xl mx-auto">
                <header className="mb-12">
                  <h1 className="text-4xl font-medium tracking-tighter text-gray-900 mb-6 leading-tight">
                    {formData.title || 'Untitled Post'}
                  </h1>
                </header>
                {formData.customCss && <style>{formData.customCss}</style>}
                <div 
                  className="prose prose-lg prose-gray mx-auto leading-relaxed max-w-none break-words [overflow-wrap:anywhere]"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(formData.content, { 
                      ADD_ATTR: ['target', 'class', 'style'], 
                      ADD_TAGS: ['iframe', 'style'] 
                    }) 
                  }}
                />
              </article>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
