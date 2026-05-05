import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, BookOpen } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center px-4">
        <div className="mb-8">
          <span className="text-8xl font-bold bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            404
          </span>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">
          页面未找到
        </h1>

        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          抱歉，您访问的页面不存在或已被移除。请检查 URL 是否正确，或返回首页继续浏览。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-primary text-primary-foreground text-base font-medium hover:bg-primary/80 transition-colors"
          >
            <Home className="mr-2 h-4 w-4" />
            返回首页
          </Link>

          <Link
            href="/categories"
            className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-border bg-background hover:bg-muted text-base font-medium transition-colors"
          >
            <BookOpen className="mr-2 h-4 w-4" />
            浏览分类
          </Link>
        </div>

        <div className="mt-12 p-6 bg-muted/50 rounded-lg max-w-md mx-auto">
          <p className="text-sm text-muted-foreground">
            如果您认为这是一个错误，请检查链接或联系网站管理员。
          </p>
        </div>
      </div>
    </div>
  );
}
