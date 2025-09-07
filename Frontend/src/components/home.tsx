import React from 'react';
import { useLanguage } from './language-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookOpen, MessageSquare, Star, Users } from 'lucide-react';

interface HomeProps {
  points: number;
  onNavigate: (tab: string) => void;
}

export function Home({ points, onNavigate }: HomeProps) {
  const { t } = useLanguage();

  const quickActions = [
    {
      title: t('learning'),
      description: '상황별 한국어 회화 학습',
      icon: BookOpen,
      color: 'bg-blue-500',
      action: () => onNavigate('learning')
    },
    {
      title: t('board'),
      description: '친구들과 소통하고 경험 공유',
      icon: MessageSquare,
      color: 'bg-green-500',
      action: () => onNavigate('board')
    }
  ];

  const achievements = [
    { label: '학습한 주제', value: points > 100 ? '5개' : points > 50 ? '3개' : '1개' },
    { label: '획득 포인트', value: `${points}점` },
    { label: '연속 학습일', value: '3일' },
    { label: '달 진행률', value: `${Math.min(Math.floor((points / 1000) * 100), 100)}%` }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl">반월</h1>
        <p className="text-xl text-muted-foreground">{t('welcome')}!</p>
        <div className="flex justify-center">
          <div className="text-6xl animate-bounce">🌙</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl mb-4">빠른 시작</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                onClick={action.action}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                  <Button className="w-full" onClick={action.action}>
                    시작하기
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-xl mb-4">나의 성과</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((achievement, index) => (
            <Card key={index}>
              <CardContent className="text-center p-4">
                <div className="text-2xl mb-2">
                  {achievement.value}
                </div>
                <p className="text-sm text-muted-foreground">
                  {achievement.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Daily Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span>오늘의 팁</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            매일 조금씩이라도 한국어를 연습하면 실력이 빨리 늘어요. 
            오늘도 새로운 표현을 하나씩 배워보세요! 🌟
          </p>
        </CardContent>
      </Card>

      {/* Community Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span>반월 커뮤니티</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl mb-1">1,234</div>
              <p className="text-xs text-muted-foreground">총 학습자</p>
            </div>
            <div>
              <div className="text-xl mb-1">567</div>
              <p className="text-xs text-muted-foreground">오늘 접속자</p>
            </div>
            <div>
              <div className="text-xl mb-1">89</div>
              <p className="text-xs text-muted-foreground">새 게시글</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}