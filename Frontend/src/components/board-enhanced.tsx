import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { PlusCircle, MessageSquare, Heart, User, Languages, TrendingUp, Clock, Eye } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  language: string;
  timestamp: Date;
  likes: number;
  replies: Comment[];
  views: number;
  isPopular?: boolean;
  isLiked?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
  isLiked?: boolean;
}

export function BoardEnhanced() {
  const { t, currentLanguage } = useLanguage();

  const [posts, setPosts] = useState<Post[]>([]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [newComment, setNewComment] = useState('');
  const [showTranslation, setShowTranslation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // 공통 헤더 생성 함수
  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken') || '';
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: '*/*',
    };
  };

  // 1. 게시글 생성 API
  const createPost = async (title: string, content: string) => {
    const response = await fetch('/api/post', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ title, content }),
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error('게시글 생성 실패');
    return data.data;
  };

  // 2. 모든 게시글 조회 API
  const fetchAllPosts = async () => {
    const response = await fetch('/api/post/all', {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error('게시글 조회 실패');
    const postsData: Post[] = data.data.map((p: any) => ({
      id: p.postId,
      title: p.title,
      content: p.content,
      author: p.creatorNickname,
      language: currentLanguage,
      timestamp: new Date(p.createdAt),
      likes: p.likeCount,
      replies: [], // 상세 조회할 때 불러옴
      views: p.viewCount,
      isPopular: p.likeCount >= 20,
      isLiked: p.isLiked,
    }));
    setPosts(postsData);
  };

  // 3. 게시글 좋아요 토글 API
  const togglePostLike = async (postId: string) => {
    await fetch(`/api/post/like/${postId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: '',
    });
    const isLiked = likedPosts.has(postId);
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: isLiked ? post.likes - 1 : post.likes + 1, isLiked: !isLiked }
        : post
    ));
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      isLiked ? newSet.delete(postId) : newSet.add(postId);
      return newSet;
    });
  };

  // 4. 특정 게시글 상세 조회 (댓글 포함)
  const fetchPostDetail = async (postId: string) => {
    const response = await fetch(`/api/post/${postId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error('상세 조회 실패');

    const postData = data.data;
    const comments: Comment[] = postData.comments.map((c: any) => ({
      id: c.id,
      content: c.content,
      author: c.creatorNickname,
      timestamp: new Date(c.createdAt),
      likes: c.likeCount,
      isLiked: c.isLiked,
    }));

    setSelectedPost({
      id: postData.postId,
      title: postData.title,
      content: postData.content,
      author: postData.creatorNickname,
      language: currentLanguage,
      timestamp: new Date(postData.createdAt),
      likes: postData.likeCount,
      replies: comments,
      views: postData.viewCount,
      isPopular: postData.likeCount >= 20,
      isLiked: postData.isLiked,
    });
    setIsDialogOpen(true);
  };

  // 5. 새로운 댓글 추가 API
  const addComment = async (postId: string, content: string) => {
    const response = await fetch(`/api/comments/add/${postId}?req=${encodeURIComponent(JSON.stringify({ content }))}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: '',
    });
    const data = await response.json();
    if (data.code !== 200) throw new Error('댓글 추가 실패');

    // 상세글 다시 불러와 댓글 갱신
    await fetchPostDetail(postId);
    setNewComment('');
  };

  // 6. 댓글 좋아요 토글 API
  const toggleCommentLike = async (commentId: string) => {
    await fetch(`/api/comments/like/${commentId}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: '',
    });

    if (!selectedPost) return;
    const isLiked = likedComments.has(commentId);
    const updatedReplies = selectedPost.replies.map(reply =>
      reply.id === commentId
        ? { ...reply, likes: isLiked ? reply.likes - 1 : reply.likes + 1, isLiked: !isLiked }
        : reply
    );
    setSelectedPost({ ...selectedPost, replies: updatedReplies });

    setLikedComments(prev => {
      const newSet = new Set(prev);
      isLiked ? newSet.delete(commentId) : newSet.add(commentId);
      return newSet;
    });
  };

  // 7. 게시글의 모든 댓글 조회는 4번 API에서 댓글 포함하여 처리

  const handleSubmitPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.author) {
      alert('모든 항목을 입력해 주세요.');
      return;
    }
    try {
      await createPost(newPost.title, newPost.content);
      await fetchAllPosts();
      setNewPost({ title: '', content: '', author: '' });
      setIsDialogOpen(false);
      alert('게시글이 성공적으로 작성되었습니다.');
    } catch (error) {
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleLike = (postId: string) => {
    togglePostLike(postId);
  };

  const handleCommentLike = (commentId: string) => {
    toggleCommentLike(commentId);
  };

  const handleSubmitComment = () => {
    if (newComment && selectedPost) {
      addComment(selectedPost.id, newComment);
    }
  };

  const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
      ko: '🇰🇷',
      vi: '🇻🇳',
      zh: '🇨🇳',
      ja: '🇯🇵',
      en: '🇺🇸',
    };
    return flags[lang] || '🌍';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'ko' ? 'ko-KR' : 'en-US');
  };

  const translateText = (text: string, fromLang: string) => {
    // 임시 번역 예시 (실제 번역 API 필요)
    const translations: { [key: string]: { [key: string]: string } } = {
      vi: { ko: 'Chào mọi người! → 안녕하세요 여러분!', en: 'Hello everyone!' },
      zh: { ko: '大家好！ → 안녕하세요!', en: 'Hello everyone!' },
      en: { ko: 'Korean drama recommendations? → 한국 드라마 추천해주세요?', vi: 'Tôi muốn cải thiện tiếng Hàn bằng cách xem phim' },
    };
    return translations[fromLang]?.[currentLanguage] || '번역 중...';
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'popular':
        return posts.filter(post => post.isPopular || post.likes >= 20).sort((a, b) => b.likes - a.likes);
      case 'recent':
        return [...posts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      default:
        return posts;
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  return (
    <div className="web-container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-gray-800 mb-2">커뮤니티 게시판</h2>
          <p className="text-gray-600">친구들과 소통하고 경험을 나누어요!</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <PlusCircle className="w-4 h-4 mr-2" />
              새 글 쓰기
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>새 게시글 작성</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="제목을 입력하세요"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              />
              <Input
                placeholder="이름을 입력하세요"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
              />
              <Textarea
                placeholder="내용을 입력하세요"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                rows={6}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={handleSubmitPost}>
                  게시
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>전체</span>
          </TabsTrigger>
          <TabsTrigger value="popular" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>인기글</span>
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>최신글</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-6">
          {getFilteredPosts().map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => fetchPostDetail(post.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CardTitle className="text-lg">{post.title}</CardTitle>
                      {post.isPopular && (
                        <Badge className="bg-red-100 text-red-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          인기
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{getLanguageFlag(post.language)}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTranslation(showTranslation === post.id ? null : post.id);
                        }}
                      >
                        <Languages className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{post.author}</span>
                    </div>
                    <span>{formatDate(post.timestamp)}</span>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{post.views}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 line-clamp-2">{post.content}</p>

                  {showTranslation === post.id && post.language !== currentLanguage && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Languages className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">번역</span>
                      </div>
                      <p className="text-sm">{translateText(post.content, post.language)}</p>
                    </div>
                  )}

                  <div className="flex items-center space-x-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(post.id);
                      }}
                      className="flex items-center space-x-1"
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{post.likes}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-1"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.replies.length}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Post Detail Dialog */}
      {selectedPost && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedPost.title}</span>
                <Badge variant="outline">{getLanguageFlag(selectedPost.language)}</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <User className="w-4 h-4" />
                    <span>{selectedPost.author}</span>
                  </div>
                  <span>{formatDate(selectedPost.timestamp)}</span>
                </div>
                <p className="text-gray-800 leading-relaxed">{selectedPost.content}</p>

                <div className="flex items-center space-x-4 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(selectedPost.id)}
                    className="flex items-center space-x-1"
                  >
                    <Heart className={`w-4 h-4 ${selectedPost.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{selectedPost.likes}</span>
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">
                  댓글 ({selectedPost.replies.length})
                </h3>

                {/* New Comment Input */}
                <div className="flex space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm">
                    나
                  </div>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="댓글을 입력하세요..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                    />
                    <Button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim()}
                      size="sm"
                    >
                      댓글 달기
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                  {selectedPost.replies.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-sm">
                        {comment.author[0]}
                      </div>
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-sm">{comment.author}</span>
                            <span className="text-xs text-gray-500">{formatDate(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCommentLike(comment.id)}
                          className="flex items-center space-x-1 mt-1"
                        >
                          <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span className="text-xs">{comment.likes}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
