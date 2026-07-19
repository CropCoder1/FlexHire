import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getPosts, createPost, updatePost, deletePost, toggleLikePost, addComment } from '../utils/api';

const Blog = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', description: '', category: 'tips', content: '' });
  const [editingPost, setEditingPost] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [commentTexts, setCommentTexts] = useState({});
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  const loadPosts = async () => {
    try {
      const filters = {};
      if (filter && filter !== 'all' && filter !== 'my-posts') filters.category = filter;
      if (filter === 'my-posts') filters.authorId = user.id;
      if (searchTerm) filters.search = searchTerm;
      const result = await getPosts(filters);
      if (result.success) setPosts(result.data);
    } catch (e) { console.error('Failed to load posts:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadPosts(); }, [filter, searchTerm]);

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) { alert('Please fill in title and content'); return; }
    try {
      const result = await createPost(newPost);
      if (result.success) {
        setNewPost({ title: '', description: '', category: 'tips', content: '' });
        setShowCreatePost(false);
        alert('Post published! 🎉');
        loadPosts();
      }
    } catch (e) { alert('Failed to create post: ' + e.message); }
  };

  const handleUpdatePost = async () => {
    if (!editingPost.title.trim() || !editingPost.content.trim()) { alert('Please fill in title and content'); return; }
    try {
      await updatePost(editingPost.id, { title: editingPost.title, description: editingPost.description, category: editingPost.category, content: editingPost.content });
      setEditingPost(null);
      alert('Post updated! ✏️');
      loadPosts();
    } catch (e) { alert('Failed to update: ' + e.message); }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try { await deletePost(postId); loadPosts(); } catch (e) { alert('Failed: ' + e.message); }
  };

  const handleLikePost = async (postId) => {
    try {
      const result = await toggleLikePost(postId);
      if (result.success) {
        setPosts(posts.map(p => p.id === postId ? { ...p, likes: result.likes, liked_by: result.likedBy } : p));
      }
    } catch (e) { console.error('Like failed:', e); }
  };

  const handleAddComment = async (postId) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    try {
      const result = await addComment(postId, text);
      if (result.success) {
        setCommentTexts({ ...commentTexts, [postId]: '' });
        loadPosts();
      }
    } catch (e) { alert('Failed to comment: ' + e.message); }
  };

  const categories = [
    { value: 'tips', label: '💡 Tips & Tricks', icon: '💡' },
    { value: 'experience', label: '📚 Experience', icon: '📚' },
    { value: 'portfolio', label: '🎨 Portfolio', icon: '🎨' },
    { value: 'news', label: '📰 News', icon: '📰' },
    { value: 'announcement', label: '📣 Announcements', icon: '📣' }
  ];

  const isLiked = (post) => {
    const likedBy = post.liked_by || [];
    return Array.isArray(likedBy) && likedBy.includes(user.id);
  };

  if (loading) return <div className="container"><p>Loading posts...</p></div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '40px' }}>
        <h1>📝 Blog & Posts</h1>
        <p style={{ color: 'var(--color-text_secondary)' }}>Share your knowledge, experience, and portfolio with the community</p>
      </div>

      <div className="filter-section" style={{ marginBottom: '30px' }}>
        <div className="filter-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div className="form-group"><label>🔍 Search Posts</label>
            <input type="text" placeholder="Search by title or content..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="form-group"><label>📂 Category</label>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="my-posts">My Posts</option>
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
          </div>
        </div>
        <button onClick={() => setShowCreatePost(!showCreatePost)} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
          ✍️ {showCreatePost ? 'Cancel' : 'Write New Post'}
        </button>
      </div>

      {(showCreatePost || editingPost) && (
        <div className="card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, var(--color-bg_secondary) 0%, var(--color-bg_tertiary) 100%)', borderLeft: '4px solid var(--color-accent_primary)' }}>
          <h2>{editingPost ? '✏️ Edit Post' : '✍️ Create New Post'}</h2>
          <div className="form-group"><label>📌 Post Title *</label>
            <input type="text" placeholder="Post title..." value={editingPost ? editingPost.title : newPost.title}
              onChange={(e) => editingPost ? setEditingPost({...editingPost, title: e.target.value}) : setNewPost({...newPost, title: e.target.value})} />
          </div>
          <div className="form-group"><label>📄 Short Description</label>
            <input type="text" placeholder="Brief summary..." value={editingPost ? editingPost.description : newPost.description}
              onChange={(e) => editingPost ? setEditingPost({...editingPost, description: e.target.value}) : setNewPost({...newPost, description: e.target.value})} />
          </div>
          <div className="form-group"><label>📂 Category</label>
            <select value={editingPost ? editingPost.category : newPost.category}
              onChange={(e) => editingPost ? setEditingPost({...editingPost, category: e.target.value}) : setNewPost({...newPost, category: e.target.value})}>
              {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
            </select>
          </div>
          <div className="form-group"><label>📝 Full Content *</label>
            <textarea placeholder="Write your post..." value={editingPost ? editingPost.content : newPost.content}
              onChange={(e) => editingPost ? setEditingPost({...editingPost, content: e.target.value}) : setNewPost({...newPost, content: e.target.value})}
              rows="8" style={{ padding: '12px 15px', border: '2px solid var(--color-border)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', backgroundColor: 'var(--color-bg_primary)', color: 'var(--color-text_primary)', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={editingPost ? handleUpdatePost : handleCreatePost} className="btn btn-primary" style={{ flex: 1 }}>{editingPost ? '📤 Update' : '🚀 Publish'}</button>
            <button onClick={() => { setShowCreatePost(false); setEditingPost(null); }} className="btn btn-secondary" style={{ flex: 1 }}>✕ Cancel</button>
          </div>
        </div>
      )}

      <div>
        {posts.length > 0 ? posts.map(post => (
          <div key={post.id} className="card" style={{ marginBottom: '20px', borderLeft: '4px solid var(--color-accent_secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--color-border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--color-accent_secondary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
                  {categories.find(c => c.value === post.category)?.icon} {categories.find(c => c.value === post.category)?.label}
                </div>
                <h3 style={{ marginBottom: '5px', marginTop: '0' }}>{post.title}</h3>
                <div style={{ fontSize: '13px', color: 'var(--color-text_secondary)', marginBottom: '10px' }}>{post.description}</div>
              </div>
              {post.author_id === user.id && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => setEditingPost(post)} className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 10px' }}>✏️ Edit</button>
                  <button onClick={() => handleDeletePost(post.id)} className="btn btn-danger" style={{ fontSize: '12px', padding: '6px 10px' }}>🗑️ Delete</button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '20px', fontSize: '12px', color: 'var(--color-text_secondary)', marginBottom: '15px', paddingBottom: '15px', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
              <div>👤 {post.author_name}</div>
              <div>📅 {new Date(post.created_at).toLocaleDateString()}</div>
              <div>👁️ {post.views} views</div>
              <div>💬 {(post.comments || []).length} comments</div>
            </div>
            <div style={{ fontSize: '14px', color: 'var(--color-text_primary)', lineHeight: '1.6', marginBottom: '20px', maxHeight: '150px', overflow: 'hidden' }}>{post.content}</div>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid var(--color-border)', flexWrap: 'wrap' }}>
              <button onClick={() => handleLikePost(post.id)} style={{ backgroundColor: isLiked(post) ? 'var(--color-accent_secondary)' : 'transparent', color: isLiked(post) ? 'white' : 'var(--color-text_primary)', border: isLiked(post) ? 'none' : '2px solid var(--color-border)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                👍 {post.likes} Likes
              </button>
            </div>

            {/* Comments */}
            {(post.comments || []).length > 0 && (
              <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-text_secondary)', marginBottom: '10px' }}>Comments:</div>
                {(post.comments || []).slice(-3).map(c => (
                  <div key={c.id} style={{ fontSize: '12px', backgroundColor: 'var(--color-bg_secondary)', padding: '8px 12px', borderRadius: '6px', marginBottom: '6px' }}>
                    <strong>{c.author_name}</strong>: {c.text}
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
              <input type="text" placeholder="Add a comment..." value={commentTexts[post.id] || ''} onChange={(e) => setCommentTexts({...commentTexts, [post.id]: e.target.value})}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '13px' }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }} />
              <button onClick={() => handleAddComment(post.id)} className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }}>💬 Send</button>
            </div>
          </div>
        )) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--color-bg_secondary)', borderRadius: '12px', color: 'var(--color-text_secondary)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
            <h3>No posts yet</h3>
            <p>{filter === 'my-posts' ? "You haven't written any posts yet." : 'No posts match your search.'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
