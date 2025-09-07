import React, { useState } from 'react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { PlusCircle, MessageSquare, Heart, User } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  language: string;
  timestamp: Date;
  likes: number;
  replies: number;
}

export function Board() {
  const { t, currentLanguage } = useLanguage();
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      title: '안녕하세요! 처음 가입했어요',
      content: '한국어 공부를 시작한 지 한 달 됐어요. 모두 반가워요!',
      author: '민수',
      language: 'ko',
      timestamp: new Date(2024, 0, 15),
      likes: 12,
      replies: 3
    },
    {
      id: '2',
      title: 'Chào mọi người!',
      content: 'Mình là người Việt Nam và đang học tiếng Hàn. Rất vui được gặp mọi người!',
      author: 'Linh',
      language: 'vi',
      timestamp: new Date(2024, 0, 14),
      likes: 8,
      replies: 5
    },
    {
      id: '3',
      title: '大家好！',
      content: '我来自中国，正在学习韩语。希望能和大家一起进步！',
      author: '小明',
      language: 'zh',
      timestamp: new Date(2024, 0, 13),
      likes: 15,
      replies: 2
    }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });

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
        replies: 0
      };
      setPosts([post, ...posts]);
      setNewPost({ title: '', content: '', author: '' });
      setIsDialogOpen(false);
    }
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl">{t('board')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              {t('newPost')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t('writePost')}</DialogTitle>
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
                rows={4}
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

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <Badge variant="outline">
                  {getLanguageFlag(post.language)}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{post.author}</span>
                </div>
                <span>{formatDate(post.timestamp)}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{post.content}</p>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1"
                >
                  <Heart className="w-4 h-4" />
                  <span>{post.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.replies}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">아직 게시글이 없습니다.</p>
            <p className="text-sm text-muted-foreground">첫 번째 게시글을 작성해보세요!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}