import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
}

interface Comment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  likes: number;
}

export function BoardEnhanced() {
  const { t, currentLanguage } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: '안녕하세요! 처음 가입했어요',
      content: '한국어 공부를 시작한 지 한 달 됐어요. 모두 반가워요! 어려운 발음이 많지만 열심히 연습하고 있어요.',
      author: '민수',
      language: 'ko',
      timestamp: new Date(2024, 11, 15),
      likes: 23,
      replies: [
        { id: '1-1', content: '환영해요! 저도 처음에 발음이 어려웠는데 계속 연습하면 늘어요!', author: '지영', timestamp: new Date(2024, 11, 15), likes: 5 },
        { id: '1-2', content: '함께 열심히 해요~ 화이팅!', author: '준호', timestamp: new Date(2024, 11, 15), likes: 3 }
      ],
      views: 156,
      isPopular: true
    },
    {
      id: '2',
      title: 'Chào mọi người!',
      content: 'Mình là người Việt Nam và đang học tiếng Hàn. Rất vui được gặp mọi người! Có ai có thể chia sẻ kinh nghiệm học không?',
      author: 'Linh',
      language: 'vi',
      timestamp: new Date(2024, 11, 14),
      likes: 18,
      replies: [
        { id: '2-1', content: '안녕하세요! 저도 베트남어 조금 배워요. 서로 도와요!', author: '수진', timestamp: new Date(2024, 11, 14), likes: 7 }
      ],
      views: 89,
      isPopular: true
    },
    {
      id: '3',
      title: '大家好！',
      content: '我来自中国，正在学习韩语。希望能和大家一起进步！最近在练习韩语发音，有什么好的方法吗？',
      author: '小明',
      language: 'zh',
      timestamp: new Date(2024, 11, 13),
      likes: 31,
      replies: [
        { id: '3-1', content: '발음 앱을 사용해보세요! 정말 도움이 돼요.', author: '현우', timestamp: new Date(2024, 11, 13), likes: 8 },
        { id: '3-2', content: '저도 중국어 배우고 있어요. 언어교환 어때요?', author: '미영', timestamp: new Date(2024, 11, 13), likes: 6 }
      ],
      views: 203,
      isPopular: true
    },
    {
      id: '4',
      title: '한국 음식 처음 만들어봤어요!',
      content: '김치찌개를 처음 만들어봤는데 생각보다 맛있게 나왔어요! 다음엔 불고기에 도전해볼 예정이에요.',
      author: '마리아',
      language: 'ko',
      timestamp: new Date(2024, 11, 12),
      likes: 15,
      replies: [],
      views: 67
    },
    {
      id: '5',
      title: 'Korean drama recommendations?',
      content: 'I want to improve my Korean by watching dramas. Any good recommendations for beginners?',
      author: 'Emma',
      language: 'en',
      timestamp: new Date(2024, 11, 11),
      likes: 12,
      replies: [
        { id: '5-1', content: '"사랑의 불시착" 추천해요! 재미있고 한국어 공부에도 좋아요.', author: '태영', timestamp: new Date(2024, 11, 11), likes: 4 }
      ],
      views: 94
    }
  ]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const [newComment, setNewComment] = useState('');
  const [showTranslation, setShowTranslation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  const handleSubmitPost = () => {
    if (newPost.title && newPost.content && newPost.author) {
      const post: Post = {
        id: Date.now().toString(),
        title: newPost.title,
        content: newPost.content,
        author: newPost.author,
        language: currentLanguage,
        timestamp: new Date(),
        likes: 0,
        replies: [],
        views: 0
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', author: '' });
      setIsDialogOpen(false);
    }
  };

  const handleSubmitComment = () => {
    if (newComment && selectedPost) {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: '나', // 현재 사용자
        timestamp: new Date(),
        likes: 0
      };
      
      const updatedPosts = posts.map(post => 
        post.id === selectedPost.id 
          ? { ...post, replies: [...post.replies, comment] }
          : post
      );
      setPosts(updatedPosts);
      setSelectedPost({...selectedPost, replies: [...selectedPost.replies, comment]});
      setNewComment('');
    }
  };

  const handleLike = (postId: string) => {
    const isLiked = likedPosts.has(postId);
    
    if (isLiked) {
      setLikedPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: Math.max(0, post.likes - 1) }
          : post
      ));
    } else {
      setLikedPosts(prev => new Set(prev).add(postId));
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ));
    }
  };

  const handleCommentLike = (commentId: string) => {
    if (selectedPost) {
      const isLiked = likedComments.has(commentId);
      
      if (isLiked) {
        setLikedComments(prev => {
          const newSet = new Set(prev);
          newSet.delete(commentId);
          return newSet;
        });
        const updatedReplies = selectedPost.replies.map(reply =>
          reply.id === commentId ? { ...reply, likes: Math.max(0, reply.likes - 1) } : reply
        );
        setSelectedPost({ ...selectedPost, replies: updatedReplies });
      } else {
        setLikedComments(prev => new Set(prev).add(commentId));
        const updatedReplies = selectedPost.replies.map(reply =>
          reply.id === commentId ? { ...reply, likes: reply.likes + 1 } : reply
        );
        setSelectedPost({ ...selectedPost, replies: updatedReplies });
      }
    }
  };

  const getLanguageFlag = (lang: string) => {
    const flags: { [key: string]: string } = {
      ko: '🇰🇷',
      vi: '🇻🇳',
      zh: '🇨🇳',
      ja: '🇯🇵',
      en: '🇺🇸'
    };
    return flags[lang] || '🌍';
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(currentLanguage === 'ko' ? 'ko-KR' : 'en-US');
  };

  const translateText = (text: string, fromLang: string) => {
    // 실제로는 번역 API를 사용해야 하지만, 여기서는 데모용 번역
    const translations: { [key: string]: { [key: string]: string } } = {
      'vi': {
        'ko': 'Chào mọi người! → 안녕하세요 여러분!',
        'en': 'Hello everyone!'
      },
      'zh': {
        'ko': '大家好！ → 안녕하세요!',
        'en': 'Hello everyone!'
      },
      'en': {
        'ko': 'Korean drama recommendations? → 한국 드라마 추천해주세요?',
        'vi': 'Tôi muốn cải thiện tiếng Hàn bằng cách xem phim'
      }
    };
    return translations[fromLang]?.[currentLanguage] || '번역 중...';
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'popular':
        return posts.filter(post => post.isPopular || post.likes >= 20).sort((a, b) => b.likes - a.likes);
      case 'recent':
        return posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      default:
        return posts;
    }
  };

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
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedPost(post)}>
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
                      <Badge variant="outline">
                        {getLanguageFlag(post.language)}
                      </Badge>
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
                      <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-red-500 text-red-500' : ''}`} />
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
        <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <span>{selectedPost.title}</span>
                <Badge variant="outline">
                  {getLanguageFlag(selectedPost.language)}
                </Badge>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Post Content */}
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
                    <Heart className={`w-4 h-4 ${likedPosts.has(selectedPost.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{selectedPost.likes}</span>
                  </Button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">댓글 ({selectedPost.replies.length})</h3>
                
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
                          <Heart className={`w-3 h-3 ${likedComments.has(comment.id) ? 'fill-red-500 text-red-500' : ''}`} />
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

      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">아직 게시글이 없습니다.</p>
            <p className="text-sm text-gray-400">첫 번째 게시글을 작성해보세요!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}